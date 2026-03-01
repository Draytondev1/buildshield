"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { 
  Shield, 
  ArrowLeft, 
  Building2, 
  Home, 
  Calendar, 
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const roofTypes = [
  "Modified Bitumen (Mod-Bit)",
  "TPO Single-Ply Membrane",
  "EPDM Single-Ply Membrane",
  "PVC Single-Ply Membrane",
  "Built-Up Roofing (BUR)",
  "Metal Standing Seam",
  "Asphalt Shingles",
  "Green/Vegetative Roof",
  "Spray Polyurethane Foam (SPF)",
  "Concrete/Inverted Assembly",
];

const buildingUses = [
  "Educational/School",
  "Office/Commercial",
  "Industrial/Warehouse",
  "Retail/Mixed-Use",
  "Healthcare/Institutional",
  "Multi-Residential",
  "Municipal/Government",
  "Religious/Community",
];

export default function NewAssessment() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    roofType: "",
    roofAge: "",
    buildingUse: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: formData.address,
          roofType: formData.roofType,
          roofAge: parseInt(formData.roofAge),
          buildingUse: formData.buildingUse,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create assessment");
      }

      router.push(`/reports/${data.reportId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.address.length > 5;
    if (step === 2) return formData.roofType && formData.roofAge && parseInt(formData.roofAge) > 0;
    if (step === 3) return formData.buildingUse;
    return false;
  };

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
      <main className="px-6 py-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">New Assessment</h1>
          <p className="text-gray-warm">
            Enter your property details to generate a comprehensive building envelope report.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-orange text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span
                className={`text-sm ${
                  step >= s ? "text-navy font-medium" : "text-gray-400"
                }`}
              >
                {s === 1 ? "Location" : s === 2 ? "Roof Details" : "Building"}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-navy rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Property Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter full property address"
                    className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                  />
                  <p className="mt-2 text-sm text-gray-400">
                    Include street address, city, and postal code for accurate weather analysis.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    <Home className="w-4 h-4 inline mr-2" />
                    Roof Type
                  </label>
                  <select
                    value={formData.roofType}
                    onChange={(e) =>
                      setFormData({ ...formData, roofType: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                  >
                    <option value="">Select roof type</option>
                    {roofTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Approximate Roof Age (years)
                  </label>
                  <input
                    type="number"
                    value={formData.roofAge}
                    onChange={(e) =>
                      setFormData({ ...formData, roofAge: e.target.value })
                    }
                    placeholder="e.g., 15"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Building Use
                  </label>
                  <select
                    value={formData.buildingUse}
                    onChange={(e) =>
                      setFormData({ ...formData, buildingUse: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-navy-light border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                  >
                    <option value="">Select building use</option>
                    {buildingUses.map((use) => (
                      <option key={use} value={use}>
                        {use}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-navy-light rounded-lg">
                  <h4 className="text-white font-medium mb-2">Assessment Summary</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="text-white">{formData.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Roof Type:</span>
                      <span className="text-white">{formData.roofType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Roof Age:</span>
                      <span className="text-white">{formData.roofAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Building Use:</span>
                      <span className="text-white">{formData.buildingUse}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 text-white hover:text-orange transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid()}
                  className="px-6 py-2 bg-orange text-white rounded-lg hover:bg-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isStepValid() || loading}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-orange text-white rounded-lg hover:bg-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      Generate Report
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange mt-0.5" />
            <div>
              <h4 className="font-medium text-navy mb-1">What happens next?</h4>
              <p className="text-sm text-gray-warm">
                We&apos;ll analyze 30 years of historical weather data for your location, calculate building 
                envelope stress metrics, and generate a comprehensive PDF report with expert assessments. 
                This process typically takes 1-2 minutes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
