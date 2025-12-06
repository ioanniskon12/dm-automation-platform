"use client";

import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MarketingNavbar />

      {/* Main Content */}
      <div className="flex-1 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-4">Terms and Conditions</h1>
          <p className="text-sm text-gray-600 mb-12">Last updated: January 1, 2025</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-black mb-3">1. Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing or using DM Automation, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">2. Use License</h2>
              <p className="text-gray-600 mb-3">
                Permission is granted to temporarily access DM Automation for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person or mirror the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">3. Account Terms</h2>
              <p className="text-gray-600 mb-3">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="text-gray-600">
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">4. Service Description</h2>
              <p className="text-gray-600">
                DM Automation provides tools for automating social media direct message conversations through AI-powered workflows. The service allows users to connect multiple messaging platforms and create automated response systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">5. Payment Terms</h2>
              <p className="text-gray-600 mb-3">
                Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set on a monthly or annual basis, depending on the type of subscription plan you select.
              </p>
              <p className="text-gray-600">
                At the end of each billing cycle, your subscription will automatically renew unless you cancel it or DM Automation cancels it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">6. Acceptable Use</h2>
              <p className="text-gray-600 mb-3">
                You agree not to use DM Automation to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                <li>Send spam or unsolicited messages</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Impersonate any person or entity</li>
                <li>Violate any laws or regulations</li>
                <li>Interfere with or disrupt the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">7. Intellectual Property</h2>
              <p className="text-gray-600">
                The service and its original content, features, and functionality are and will remain the exclusive property of DM Automation. The service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">8. Termination</h2>
              <p className="text-gray-600">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-600">
                In no event shall DM Automation, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">10. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">11. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at terms@dmautomation.com
              </p>
            </section>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
