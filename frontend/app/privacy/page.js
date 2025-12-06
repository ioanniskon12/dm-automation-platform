"use client";

import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MarketingNavbar />

      {/* Main Content */}
      <div className="flex-1 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-12">Last updated: January 1, 2025</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-black mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                <li>Account information (name, email, password)</li>
                <li>Profile information</li>
                <li>Messages and conversations you create through our service</li>
                <li>Payment information</li>
                <li>Communications with us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">3. Information Sharing</h2>
              <p className="text-gray-600">
                We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, when required by law, or with your consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">4. Data Security</h2>
              <p className="text-gray-600">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">5. Your Rights</h2>
              <p className="text-gray-600 mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">6. Cookies</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">7. Data Retention</h2>
              <p className="text-gray-600">
                We retain your personal information for as long as necessary to provide you with our services and as described in this Privacy Policy. We also retain and use your information as necessary to comply with our legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">8. Children's Privacy</h2>
              <p className="text-gray-600">
                Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">9. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black mb-3">10. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at privacy@dmautomation.com
              </p>
            </section>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
