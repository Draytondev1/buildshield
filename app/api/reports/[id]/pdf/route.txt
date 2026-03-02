export const dynamic = 'force-dynamic';

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import puppeteer from "puppeteer";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: report } = await supabaseAdmin
      .from("reports")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (!report.ai_report) {
      return NextResponse.json({ error: "Report not ready" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial; padding: 40px; }
          h1 { color: #1E2A3A; }
          .metric { background: #F5F1E8; padding: 10px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Building Envelope Assessment Report</h1>
        <p>Address: ${report.property_address}</p>
        <p>Roof Type: ${report.roof_type}</p>
        <p>Roof Age: ${report.roof_age} years</p>
        <div class="metric">Freeze-Thaw Days: ${report.weather_metrics.freezeThawDays}/year</div>
        <div class="metric">Annual Precipitation: ${report.weather_metrics.annualPrecipitation}mm</div>
        <div class="metric">Thermal Shock Events: ${report.weather_metrics.thermalShockEvents}/year</div>
        <hr>
        <pre>${report.ai_report}</pre>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Report-${params.id}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}