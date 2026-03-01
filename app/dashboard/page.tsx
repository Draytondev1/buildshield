"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Plus, 
  FileText, 
  CreditCard, 
  Calendar, 
  MapPin, 
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Report, UserCredits } from "@/types";

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (isSignedIn) {
      fetchDashboardData();
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, creditsRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/credits"),
      ]);

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData.reports);
      }

      if (creditsRes.ok) {
        const creditsData = await creditsRes.json();
        setCredits(creditsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-beige flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-navy/10 rounded-lg">
            <CreditCard className="w-4 h-4 text-navy" />
            <span className="text-sm font-medium text-navy">
              {credits?.creditsRemaining ?? 0} Credits
            </span>
          </div>
          <Link
            href="/new-assessment"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            Welcome back, {user?.firstName || "Assessor"}
          </h1>
          <p className="text-gray-warm">
            Manage your building envelope assessments and credits
          </p>
        </div>

        {/* Credits Alert */}
        {(credits?.creditsRemaining ?? 0) === 0 && (
          <div className="mb-6 p-4 bg-orange/10 border border-orange/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange" />
            <div className="flex-1">
              <p className="text-sm text-navy">
                You&apos;re out of credits. Purchase more to continue generating assessments.
              </p>
            </div>
            <Link
              href="/purchase-credits"
              className="px-4 py-2 bg-orange text-white text-sm rounded-lg hover:bg-orange-hover transition-colors"
            >
              Purchase Credits
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-orange" />
              <span className="text-sm text-gray-warm">Total Reports</span>
            </div>
            <div className="text-3xl font-bold text-navy">{reports.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-orange" />
              <span className="text-sm text-gray-warm">Credits Remaining</span>
            </div>
            <div className="text-3xl font-bold text-navy">
              {credits?.creditsRemaining ?? 0}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-orange" />
              <span className="text-sm text-gray-warm">Member Since</span>
            </div>
            <div className="text-3xl font-bold text-navy">
              {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-navy">Your Assessments</h2>
            <Link
              href="/new-assessment"
              className="inline-flex items-center gap-2 text-orange hover:text-orange-hover transition-colors text-sm font-medium"
            >
              Create New
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-navy mb-2">No assessments yet</h3>
              <p className="text-gray-warm mb-4">
                Start your first building envelope assessment to get expert insights.
              </p>
              <Link
                href="/new-assessment"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                Start Assessment
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/reports/${report.id}`}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-medium text-navy">{report.propertyAddress}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-warm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.buildingUse}
                        </span>
                        <span>•</span>
                        <span>{report.roofType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
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
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
