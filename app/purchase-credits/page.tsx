"use client";

import Link from "next/link";
import { Shield, ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

const creditPackages = [
  {
    id: "starter",
    name: "Starter",
    credits: 5,
    price: 49,
    pricePerCredit: 9.80,
    description: "Perfect for small property managers",
  },
  {
    id: "professional",
    name: "Professional",
    credits: 15,
    price: 129,
    pricePerCredit: 8.60,
    description: "Best value for consultants",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 50,
    price: 399,
    pricePerCredit: 7.98,
    description: "For large organizations",
  },
];

export default function PurchaseCredits() {
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
      <main className="px-6 py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-navy mb-4">Purchase Credits</h1>
          <p className="text-gray-warm max-w-2xl mx-auto">
            Buy assessment credits to generate more building envelope reports. 
            Each credit allows you to create one comprehensive assessment.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="mb-12 p-6 bg-orange/10 border border-orange/20 rounded-xl flex items-start gap-4 max-w-2xl mx-auto">
          <AlertCircle className="w-6 h-6 text-orange mt-0.5" />
          <div>
            <h3 className="font-semibold text-navy mb-1">Coming Soon</h3>
            <p className="text-gray-warm text-sm">
              Online payment processing is being set up. For now, please contact us 
              at <a href="mailto:solutions@buildingenvelope.ca" className="text-orange hover:underline">solutions@buildingenvelope.ca</a> to purchase credits.
            </p>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl p-6 shadow-sm border-2 ${
                pkg.popular
                  ? "border-orange shadow-lg"
                  : "border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-orange text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-navy mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-warm">{pkg.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-navy mb-1">
                  ${pkg.price}
                </div>
                <div className="text-sm text-gray-warm">
                  ${pkg.pricePerCredit.toFixed(2)} per credit
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-navy">{pkg.credits} Assessment Credits</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-navy">Full Weather Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-navy">PDF Report Generation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-navy">Expert AI Assessment</span>
                </div>
              </div>

              <button
                disabled
                className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  pkg.popular
                    ? "bg-orange text-white hover:bg-orange-hover"
                    : "bg-navy text-white hover:bg-navy-light"
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Coming Soon
              </button>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-navy rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Custom Pricing?</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            For enterprise pricing, bulk purchases, or custom integration needs, 
            contact our sales team.
          </p>
          <a
            href="mailto:solutions@buildingenvelope.ca"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-lg hover:bg-orange-hover transition-colors"
          >
            Contact Sales
          </a>
        </div>
      </main>
    </div>
  );
}
