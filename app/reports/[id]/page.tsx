"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Shield, 
  ArrowLeft, 
  FileText, 
  Download, 
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Home,
  Building2,
  CheckCircle,
  Clock
} from "lucide-react";
import { Report } from "@/types";

export default function ReportDetail() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [params.id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    
    try {
      const response = await fetch(`/api/reports/${report.id}/pdf`);
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BuildShield-Report-${report.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-beige flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-beige flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-navy mb-2">Error Loading Report</h2>
          <p className="text-gray-warm mb-4">{error || "Report not found"}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-orange hover:text-orange-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-beige">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-navy" />
          <span className="text-xl font-bold text-navy">BuildShield</span>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-navy hover:text-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                report.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : report.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
            <span className="text-sm text-gray-warm">
              Generated on {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2">
            Building Envelope Assessment
          </h1>
          <p className="text-gray-warm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {report.propertyAddress}
          </p>
        </div>

        {/* Property Details Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-navy mb-4">Property Details</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-warm mb-1">
                <Home className="w-4 h-4" />
                Roof Type
              </div>
              <div className="font-medium text-navy">{report.roofType}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-warm mb-1">
                <Calendar className="w-4 h-4" />
                Roof Age
              </div>
              <div className="font-medium text-navy">{report.roofAge} years</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-warm mb-1">
                <Building2 className="w-4 h-4" />
                Building Use
              </div>
              <div className="font-medium text-navy">{report.buildingUse}</div>
            </div>
          </div>
        </div>

        {/* Weather Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-navy mb-4">Weather Analysis (20-Year Historical Data)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-1">
                {report.weatherMetrics.freezeThawDays}
              </div>
              <div className="text-sm text-gray-warm">Freeze-Thaw Days/Year</div>
            </div>
            <div className="p-4 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-1">
                {report.weatherMetrics.annualPrecipitation}mm
              </div>
              <div className="text-sm text-gray-warm">Annual Precipitation</div>
            </div>
            <div className="p-4 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-1">
                {report.weatherMetrics.thermalShockEvents}
              </div>
              <div className="text-sm text-gray-warm">Thermal Shock Events/Year</div>
            </div>
            <div className="p-4 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-1">
                {report.weatherMetrics.highHumidityHours}
              </div>
              <div className="text-sm text-gray-warm">High Humidity Hours/Year</div>
            </div>
            <div className="p-4 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-1">
                {report.weatherMetrics.temperatureRange}°C
              </div>
              <div className="text-sm text-gray-warm">Temperature Range</div>
            </div>
            <div className="p-4 bg-cream rounded-lg">
              <div className="text-3xl font-bold text-orange mb-1">
                {report.weatherMetrics.heavyRainEvents}
              </div>
              <div className="text-sm text-gray-warm">Heavy Rain Events/Year</div>
            </div>
          </div>
        </div>

        {/* AI Report */}
        {report.aiReport ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-navy">Expert Assessment Report</h2>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-hover transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {report.aiReport}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8 text-center">
            <Clock className="w-12 h-12 text-orange mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-navy mb-2">Report Generation in Progress</h3>
            <p className="text-gray-warm max-w-md mx-auto">
              Our AI is analyzing the weather data and generating your comprehensive report. 
              This typically takes 1-2 minutes. Please refresh the page to check for updates.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-navy hover:text-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/new-assessment"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-hover transition-colors"
          >
            <FileText className="w-4 h-4" />
            New Assessment
          </Link>
        </div>
      </main>
    </div>
  );
}
