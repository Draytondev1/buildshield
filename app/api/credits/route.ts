 export const dynamic = 'force-dynamic';

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import puppeteer from "puppeteer";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: report, error } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (error || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (!report.ai_report) {
      return NextResponse.json(
        { error: "Report not ready" },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1E2A3A; background: white; }
          .header { background: #1E2A3A; color: white; padding: 40px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .content { padding: 40px; max-width: 800px; margin: 0 auto; }
          .section { margin-bottom: 32px; }
          .section-title { font-size: 20px; font-weight: 600; color: #1E2A3A; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #E85D04; }
          .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
          .metric-card { background: #F5F1E8; padding: 16px; border-radius: 8px; text-align: center; }
          .metric-value { font-size: 24px; font-weight: 700; color: #E85D04; margin-bottom: 4px; }
          .property-details { background: #F5F1E8; padding: 20px; border-radius: 8px; margin-bottom: 24px; }
          .property-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .footer { background: #1E2A3A; color: white; padding: 20px 40px; text-align: center; font-size: 12px; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Building Envelope Assessment Report</h1>
        </div>
        <div class="content">
          <div class="section">
            <h2 class="section-title">Property Information</h2>
            <div class="property-details">
              <div class="property-row"><span>Address:</span><span>${report.property_address}</span></div>
              <div class="property-row"><span>Roof Type:</span><span>${report.roof_type}</span></div>
              <div class="property-row"><span>Roof Age:</span><span>${report.roof_age} years</span></div>
              <div class="property-row"><span>Building Use:</span><span>${report.building_use}</span></div>
            </div>
          </div>
          <div class="section">
            <h2 class="section-title">Weather Analysis</h2>
            <div class="metrics-grid">
              <div class="metric-card"><div class="metric-value">${report.weather_metrics.freezeThawDays}</div><div>Freeze-Thaw Days/Year</div></div>
              <div class="metric-card"><div class="metric-value">${report.weather_metrics.annualPrecipitation}mm</div><div>Annual Precipitation</div></div>
              <div class="metric-card"><div class="metric-value">${report.weather_metrics.thermalShockEvents}</div><div>Thermal Shock Events/Year</div></div>
            </div>
          </div>
          <div class="section">
            <h2 class="section-title">Expert Assessment</h2>
            <div>${report.ai_report.replace(/\n/g, "<br>")}</div>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 Waterloo Intel - BuildShield Platform</p>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="BuildShield-Report-${params.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}