"use client";

import { useState } from 'react';
import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function Security() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'overview',
      title: 'Security Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            At DM Automation, security is foundational to everything we build. We implement industry-leading security measures to protect your data and maintain your trust. Our comprehensive security program is designed to safeguard your information at every level.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'End-to-End Encryption', desc: 'All data encrypted in transit (TLS 1.3) and at rest (AES-256)' },
              { title: 'SOC 2 Type II Compliant', desc: 'Annual audits for security, availability, and confidentiality' },
              { title: 'Multi-Factor Authentication', desc: 'Protect accounts with authenticator apps and security keys' },
              { title: 'Secure Cloud Infrastructure', desc: 'Hosted on AWS with enterprise-grade security' },
              { title: 'Regular Security Audits', desc: 'Quarterly third-party penetration testing' },
              { title: '24/7 Security Monitoring', desc: 'Continuous monitoring for threats and anomalies' }
            ].map((feature, index) => (
              <div key={index} className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h4 className="font-semibold text-black mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'encryption',
      title: 'Data Encryption',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We employ multiple layers of encryption to ensure your data remains secure at all times, whether it&apos;s being transmitted or stored.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h4 className="font-semibold text-black mb-4">Encryption Standards</h4>
            <ul className="space-y-3">
              {[
                'All customer data is encrypted at rest using AES-256 encryption',
                'Data in transit is protected with TLS 1.3 protocol',
                'Encryption keys are managed using AWS Key Management Service (KMS)',
                'Regular key rotation and access auditing',
                'Data is replicated across multiple availability zones',
                'Database connections use encrypted SSL/TLS tunnels',
                'API communications are secured with HTTPS only'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'access',
      title: 'Access Control',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We implement strict access controls to ensure only authorized personnel can access systems and data, following the principle of least privilege.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-3">Employee Access</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Role-based access control (RBAC)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Multi-factor authentication required
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Quarterly access reviews
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Privileged access monitoring
                </li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-3">System Access</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Principle of least privilege
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Session timeout policies
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Audit logging enabled
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  SSH key-based authentication
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      title: 'Compliance & Certifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We maintain rigorous compliance standards and third-party certifications to demonstrate our commitment to security best practices.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'SOC 2 Type II', desc: 'Security, availability, and confidentiality controls', color: 'bg-green-100 text-green-700' },
              { name: 'GDPR Compliant', desc: 'European data protection standards', color: 'bg-blue-100 text-blue-700' },
              { name: 'CCPA Compliant', desc: 'California consumer privacy protections', color: 'bg-purple-100 text-purple-700' },
              { name: 'ISO 27001', desc: 'Information security management system', color: 'bg-orange-100 text-orange-700' }
            ].map((cert, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 flex items-start gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${cert.color}`}>
                  {cert.name}
                </div>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Enterprise customers can request our SOC 2 report, security questionnaire responses, and other compliance documentation by contacting our sales team.
          </p>
        </div>
      )
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Security',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Built on world-class cloud infrastructure with multiple layers of protection, ensuring high availability and resilience.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-xl text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm opacity-90">Uptime SLA</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-xl text-center">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm opacity-90">Availability Zones</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-xl text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Monitoring</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'AWS Cloud Hosting', desc: 'Enterprise-grade infrastructure with global availability' },
              { title: 'DDoS Protection', desc: 'Advanced protection against distributed denial-of-service attacks' },
              { title: 'Automated Backups', desc: 'Daily encrypted backups with point-in-time recovery' },
              { title: 'Network Isolation', desc: 'VPC with private subnets and strict firewall rules' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-black mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'application',
      title: 'Application Security',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Security is integrated throughout our software development lifecycle, from design to deployment.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h4 className="font-semibold text-black mb-4">Development Practices</h4>
            <ul className="space-y-3">
              {[
                'Secure development lifecycle (SDL) practices',
                'Regular code reviews with security focus',
                'Automated vulnerability scanning in CI/CD pipeline',
                'Dependency monitoring and timely updates',
                'Web application firewall (WAF) protection',
                'Input validation and output encoding',
                'Protection against OWASP Top 10 vulnerabilities'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'incident',
      title: 'Incident Response',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We maintain a comprehensive incident response program to quickly identify, contain, and remediate security incidents.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-3">Response Process</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Detection & Identification
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Containment & Isolation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Eradication & Recovery
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  Post-Incident Review
                </li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-3">Commitments</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  24/7 security operations center
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Breach notification within 72 hours
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Regular incident response drills
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Documented response procedures
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Security FAQ',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          {[
            {
              q: 'Where is my data stored?',
              a: 'Your data is stored in AWS data centers in the United States. Enterprise customers can request specific regional data residency.'
            },
            {
              q: 'Do you share my data with third parties?',
              a: 'No. We never sell or share your data with third parties for marketing purposes. Data is only shared with service providers necessary to operate our platform, and they are bound by strict confidentiality agreements.'
            },
            {
              q: 'How long do you retain my data?',
              a: 'We retain your data for the duration of your subscription plus 30 days after account closure. You can request immediate deletion at any time.'
            },
            {
              q: 'What happens if there\'s a security breach?',
              a: 'We have a documented incident response plan. In the event of a breach affecting your data, we will notify you within 72 hours as required by GDPR.'
            },
            {
              q: 'Can I get a copy of your security documentation?',
              a: 'Yes. Enterprise customers can request our SOC 2 report, security questionnaire responses, and other documentation. Contact our sales team for access.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 p-5 rounded-xl">
              <h4 className="font-semibold text-black mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'report',
      title: 'Report a Vulnerability',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We take security seriously and appreciate responsible disclosure of vulnerabilities. If you discover a security issue, please report it to us.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h4 className="font-semibold text-black mb-4">Responsible Disclosure Guidelines</h4>
            <ul className="space-y-3 mb-6">
              {[
                'Provide detailed information about the vulnerability',
                'Allow reasonable time for us to address the issue',
                'Do not access or modify other users\' data',
                'Do not perform actions that could harm our users or systems'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:security@dmautomation.com"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all text-center"
              >
                security@dmautomation.com
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-green-400 hover:text-green-600 transition-all text-center"
              >
                Contact Security Team
              </Link>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Security at DM Automation
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Your data security is our top priority. We employ industry-leading security measures to protect your information and maintain your trust.
          </p>
          <p className="text-sm text-green-200 mt-6">Last updated: December 2024</p>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-gray-50 rounded-2xl p-4 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                  Security Topics
                </h3>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        activeSection === index
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={activeSection === index ? 'text-white' : 'text-gray-400'}>
                        {section.icon}
                      </span>
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    {sections[activeSection].icon}
                  </div>
                  <h2 className="text-2xl font-bold text-black">
                    {sections[activeSection].title}
                  </h2>
                </div>

                {sections[activeSection].content}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeSection === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                    disabled={activeSection === sections.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeSection === sections.length - 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Related Links */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <h3 className="font-semibold text-black mb-4">Related Legal Documents</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/privacy"
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:shadow-md transition-all"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:shadow-md transition-all"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/faq"
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:shadow-md transition-all"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 hover:shadow-md transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
