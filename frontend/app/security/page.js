"use client";

import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function Security() {
  const securityFeatures = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "SOC 2 Type II Compliant",
      description: "Our infrastructure and processes are audited annually for security, availability, and confidentiality."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      title: "Multi-Factor Authentication",
      description: "Protect your account with MFA options including authenticator apps and security keys."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      title: "Secure Cloud Infrastructure",
      description: "Hosted on AWS with enterprise-grade security, redundancy, and 99.9% uptime guarantee."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "Regular Security Audits",
      description: "Third-party penetration testing and security assessments conducted quarterly."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "24/7 Security Monitoring",
      description: "Continuous monitoring for threats, anomalies, and suspicious activities."
    }
  ];

  const certifications = [
    { name: "SOC 2 Type II", description: "Security, availability, and confidentiality" },
    { name: "GDPR Compliant", description: "European data protection standards" },
    { name: "CCPA Compliant", description: "California consumer privacy" },
    { name: "ISO 27001", description: "Information security management" }
  ];

  const practices = [
    {
      title: "Data Protection",
      items: [
        "All customer data is encrypted at rest using AES-256",
        "Data in transit is protected with TLS 1.3",
        "Encryption keys are managed using AWS KMS",
        "Regular key rotation and access auditing",
        "Data is replicated across multiple availability zones"
      ]
    },
    {
      title: "Access Control",
      items: [
        "Role-based access control (RBAC) for all systems",
        "Principle of least privilege enforced",
        "Multi-factor authentication required for all employees",
        "Access reviews conducted quarterly",
        "Privileged access monitoring and logging"
      ]
    },
    {
      title: "Application Security",
      items: [
        "Secure development lifecycle (SDL) practices",
        "Regular code reviews and security testing",
        "Automated vulnerability scanning",
        "Dependency monitoring and updates",
        "Web application firewall (WAF) protection"
      ]
    },
    {
      title: "Incident Response",
      items: [
        "Documented incident response procedures",
        "24/7 security operations center",
        "Breach notification within 72 hours",
        "Regular incident response drills",
        "Post-incident review and remediation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Security at DM Automation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your data security is our top priority. We employ industry-leading security measures to protect your information and maintain your trust.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Enterprise-Grade Security</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We implement comprehensive security measures to protect your data at every level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Compliance & Certifications</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We maintain rigorous compliance standards and third-party certifications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 text-center hover:border-green-300 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-1">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Our Security Practices</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Detailed overview of how we protect your data and systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {practices.map((practice, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-black mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </span>
                  {practice.title}
                </h3>
                <ul className="space-y-3">
                  {practice.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Infrastructure Security</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built on world-class cloud infrastructure with multiple layers of protection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">3</div>
              <div className="text-gray-400">Availability Zones</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Security Monitoring</div>
            </div>
          </div>

          <div className="mt-16 bg-gray-800/50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6">Infrastructure Highlights</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">AWS Cloud Hosting</h4>
                  <p className="text-sm text-gray-400">Enterprise-grade cloud infrastructure with global availability</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">DDoS Protection</h4>
                  <p className="text-sm text-gray-400">Advanced protection against distributed denial-of-service attacks</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Automated Backups</h4>
                  <p className="text-sm text-gray-400">Daily encrypted backups with point-in-time recovery</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Network Isolation</h4>
                  <p className="text-sm text-gray-400">VPC with private subnets and strict firewall rules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">Report a Vulnerability</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              We take security seriously. If you discover a vulnerability, please report it responsibly and we&apos;ll work quickly to address it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:security@dmautomation.com"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
              >
                security@dmautomation.com
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-400 hover:text-green-600 transition-all"
              >
                Contact Security Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Security FAQ</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Where is my data stored?",
                a: "Your data is stored in AWS data centers in the United States. Enterprise customers can request specific regional data residency."
              },
              {
                q: "Do you share my data with third parties?",
                a: "No. We never sell or share your data with third parties for marketing purposes. Data is only shared with service providers necessary to operate our platform, and they are bound by strict confidentiality agreements."
              },
              {
                q: "How long do you retain my data?",
                a: "We retain your data for the duration of your subscription plus 30 days after account closure. You can request immediate deletion at any time."
              },
              {
                q: "What happens if there's a security breach?",
                a: "We have a documented incident response plan. In the event of a breach affecting your data, we will notify you within 72 hours as required by GDPR."
              },
              {
                q: "Can I get a copy of your security documentation?",
                a: "Yes. Enterprise customers can request our SOC 2 report, security questionnaire responses, and other documentation. Contact our sales team for access."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-black mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
