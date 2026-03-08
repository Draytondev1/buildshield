import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = 'force-dynamic';

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
  
  console.log("API Key exists:", !!apiKey);
  console.log("API Key length:", apiKey?.length);
  
  const endDate = new Date();
  const startDate = new Date();
  // 20 years of daily data (much lower API cost than hourly)
  startDate.setFullYear(endDate.getFullYear() - 20);
  
  // Remove 'include=hours' to get daily data only (reduces API cost by ~24x)
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${startDate.toISOString().split("T")[0]}/${endDate.toISOString().split("T")[0]}?unitGroup=metric&key=${apiKey}`;
  
  console.log("Fetching weather from URL (key hidden):", url.replace(apiKey || '', '***'));
  
  const response = await fetch(url);
  console.log("Response status:", response.status);
  console.log("Response content-type:", response.headers.get('content-type'));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Weather API error response:", errorText.substring(0, 500));
    throw new Error(`Failed to fetch weather data: ${response.status} - ${errorText.substring(0, 200)}`);
  }
  