import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Geocode address using OpenStreetMap Nominatim
async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await response.json();
  
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  }
  throw new Error("Could not geocode address");
}

// Fetch weather data from Visual Crossing
async function fetchWeatherData(lat: number, lon: number) {
  const apiKey = process.env.VISUAL_CROSSING_API_KEY;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 20);
  
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${startDate.toISOString().split("T")[0]}/${endDate.toISOString().split("T")[0]}?unitGroup=metric&include=hours&key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  
  return await response.json();
}

// Calculate building envelope stress metrics
function calculateMetrics(weatherData: any) {
  const days = weatherData.days || [];
  let freezeThawDays = 0;
  let thermalShockEvents = 0;
  let totalPrecipitation = 0;
  let highHumidityHours = 0;
  let extremeColdHours = 0;
  let extremeHeatHours = 0;
  let totalHours = 0;
  let heavyRainEvents = 0;
  let maxTemp = -Infinity;
  let minTemp = Infinity;
  let totalHumidity = 0;
  let maxWindSpeed = 0;

  days.forEach((day: any) => {
    const hours = day.hours || [];
    const dayTemps = hours.map((h: any) => h.temp);
    const dayMax = Math.max(...dayTemps);
    const dayMin = Math.min(...dayTemps);
    
    maxTemp = Math.max(maxTemp, dayMax);
    minTemp = Math.min(minTemp, dayMin);
    
    // Freeze-thaw day: crosses 0°C
    if (dayMax > 0 && dayMin < 0) {
      freezeThawDays++;
    }
    
    // Precipitation
    totalPrecipitation += day.precip || 0;
    if (day.precip > 25) {
      heavyRainEvents++;
    }
    
    hours.forEach((hour: any) => {
      totalHours++;
      
      // Humidity
      if (hour.humidity > 90) {
        highHumidityHours++;
      }
      totalHumidity += hour.humidity || 0;
      
      // Extreme temperatures
      if (hour.temp < -20) extremeColdHours++;
      if (hour.temp > 30) extremeHeatHours++;
      
      // Wind speed
      maxWindSpeed = Math.max(maxWindSpeed, hour.windspeed || 0);
      
      // Thermal shock: >10°C change in 3 hours
      const hourIndex = hours.indexOf(hour);
      if (hourIndex >= 3) {
        const tempChange = Math.abs(hour.temp - hours[hourIndex - 3].temp);
        if (tempChange > 10) {
          thermalShockEvents++;
        }
      }
    });
  });

  const years = days.length / 365.25;
  
  return {
    freezeThawDays: Math.round(freezeThawDays / years),
    annualPrecipitation: Math.round(totalPrecipitation / years),
    thermalShockEvents: Math.round(thermalShockEvents / years),
    highHumidityHours: Math.round(highHumidityHours / years),
    extremeColdHours: Math.round(extremeColdHours / years),
    extremeHeatHours: Math.round(extremeHeatHours / years),
    temperatureRange: Math.round(maxTemp - minTemp),
    avgHumidity: Math.round(totalHumidity / totalHours),
    heavyRainEvents: Math.round(heavyRainEvents / years),
    maxWindSpeed: Math.round(maxWindSpeed),
  };
}

// Generate AI report using Claude
async function generateAIReport(
  metrics: any,
  buildingType: string,
  location: string,
  roofType: string,
  roofAge: number
) {
  const prompt = `Generate a professional building envelope assessment report for a ${buildingType} in ${location}.

Building Details:
- Roof Type: ${roofType}
- Roof Age: ${roofAge} years
- Location: ${location}

Weather Analysis (20-Year Historical Data):
- Freeze-Thaw Days: ${metrics.freezeThawDays} days/year (days crossing 0°C)
- Annual Precipitation: ${metrics.annualPrecipitation}mm
- Thermal Shock Events: ${metrics.thermalShockEvents} events/year (>10°C change in 3 hours)
- High Humidity Hours: ${metrics.highHumidityHours} hours/year (>90% relative humidity)
- Extreme Cold Hours: ${metrics.extremeColdHours} hours/year (<-20°C)
- Extreme Heat Hours: ${metrics.extremeHeatHours} hours/year (>30°C)
- Temperature Range: ${metrics.temperatureRange}°C
- Average Humidity: ${metrics.avgHumidity}%
- Heavy Rain Events: ${metrics.heavyRainEvents} events/year (>25mm/day)
- Maximum Wind Speed: ${metrics.maxWindSpeed} m/s

Please generate a comprehensive report with the following sections:

1. EXECUTIVE SUMMARY
   - Overview of critical findings
   - Overall risk assessment (LOW/MEDIUM/HIGH/CRITICAL)
   - Key recommendations summary

2. CRITICAL FINDINGS
   - Freeze-Thaw Cycling Impact
   - Precipitation Loading Analysis
   - Moisture & Humidity Exposure
   - Thermal Shock Events

3. RISK ASSESSMENT MATRIX
   - Roof Membrane risk level and justification
   - Flashings/Seals risk level and justification
   - Drainage Systems risk level and justification
   - Wall Assemblies risk level and justification
   - Windows/Glazing risk level and justification
   - Expansion Joints risk level and justification

4. EXPERT PANEL ASSESSMENT
   Include assessments from three fictional experts:
   a) Senior Roofing Consultant (25+ years experience)
   b) Building Envelope Engineer (PE, Building Science Specialist)
   c) Climate Data Specialist (30-Year Analysis)
   
   Each expert should provide a 2-3 sentence quote about the findings.

5. RECOMMENDATIONS
   - Immediate Actions (0-12 months): Critical repairs and inspections
   - Short-Term Actions (1-3 years): Planned maintenance and upgrades
   - Long-Term Strategy (3-10 years): Comprehensive envelope improvements

6. FINANCIAL IMPACT
   - Estimated costs for each recommendation phase
   - ROI analysis
   - Avoided costs from proactive maintenance

Format the report in a professional, technical style suitable for facility managers and building owners. Use specific data points from the weather analysis to support all conclusions.`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user credits
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("credits_remaining")
      .eq("user_id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userData.credits_remaining <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 }
      );
    }

    const { address, roofType, roofAge, buildingUse } = await req.json();

    // Validate input
    if (!address || !roofType || !roofAge || !buildingUse) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Geocode address
    const geocoded = await geocodeAddress(address);

    // Check weather cache
    const cacheKey = `${geocoded.lat.toFixed(2)},${geocoded.lon.toFixed(2)}`;
    const { data: cachedWeather } = await supabaseAdmin
      .from("weather_cache")
      .select("*")
      .eq("location_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    let metrics;
    if (cachedWeather) {
      metrics = cachedWeather.metrics;
    } else {
      // Fetch weather data
      const weatherData = await fetchWeatherData(geocoded.lat, geocoded.lon);
      metrics = calculateMetrics(weatherData);

      // Cache weather data
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await supabaseAdmin.from("weather_cache").upsert({
        location_key: cacheKey,
        latitude: geocoded.lat,
        longitude: geocoded.lon,
        metrics,
        expires_at: expiresAt.toISOString(),
      });
    }

    // Create report record
    const { data: report, error: reportError } = await supabaseAdmin
      .from("reports")
      .insert({
        user_id: userId,
        property_address: geocoded.displayName,
        latitude: geocoded.lat,
        longitude: geocoded.lon,
        roof_type: roofType,
        roof_age: roofAge,
        building_use: buildingUse,
        weather_metrics: metrics,
        status: "pending",
      })
      .select()
      .single();

    if (reportError) {
      throw reportError;
    }

    // Deduct credit
    await supabaseAdmin
      .from("users")
      .update({ credits_remaining: userData.credits_remaining - 1 })
      .eq("user_id", userId);

    // Generate AI report asynchronously
    generateAIReport(metrics, buildingUse, geocoded.displayName, roofType, roofAge)
      .then(async (aiReport) => {
        await supabaseAdmin
          .from("reports")
          .update({
            ai_report: aiReport,
            status: "completed",
          })
          .eq("id", report.id);
      })
      .catch(async (error) => {
        console.error("AI report generation failed:", error);
        await supabaseAdmin
          .from("reports")
          .update({ status: "failed" })
          .eq("id", report.id);
      });

    return NextResponse.json({
      reportId: report.id,
      message: "Assessment created successfully",
    });
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json(
      { error: "Failed to create assessment" },
      { status: 500 }
    );
  }
}
