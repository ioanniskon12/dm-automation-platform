"use client";

import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function About() {
  const team = [
    {
      name: "Alex Morgan",
      role: "CEO & Co-Founder",
      bio: "Former Head of Product at a leading social media management platform. 10+ years in SaaS.",
      initials: "AM",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer with expertise in AI/ML and distributed systems.",
      initials: "SC",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Michael Torres",
      role: "Head of Engineering",
      bio: "15 years building scalable systems. Previously at Stripe and Meta.",
      initials: "MT",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Emily Watson",
      role: "Head of Customer Success",
      bio: "Passionate about helping businesses grow. 8 years in customer success roles.",
      initials: "EW",
      gradient: "from-orange-500 to-amber-500"
    }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Innovation First",
      description: "We're constantly pushing the boundaries of what's possible with AI and automation technology."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Customer Obsessed",
      description: "Every decision we make starts with asking: How does this help our customers succeed?"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Trust & Security",
      description: "Your data security is our top priority. We maintain enterprise-grade security standards."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Transparency",
      description: "We believe in honest, open communication with our customers, partners, and team."
    }
  ];

  const milestones = [
    { year: "2022", title: "Founded", description: "Started with a vision to simplify social media automation" },
    { year: "2023", title: "1,000 Customers", description: "Reached our first thousand paying customers" },
    { year: "2024", title: "AI Launch", description: "Released our AI-powered response engine" },
    { year: "2025", title: "2,500+ Businesses", description: "Growing to serve businesses worldwide" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-6">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            We&apos;re on a mission to help businesses
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> connect better</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            DM Automation was founded with a simple belief: businesses shouldn&apos;t have to choose between personal connections and scalability. Our AI-powered platform helps you do both.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In 2022, our founders noticed a growing problem: businesses were drowning in social media messages.
                  They were either ignoring customers (losing sales) or spending countless hours on repetitive responses (wasting time).
                </p>
                <p>
                  We knew there had to be a better way. What if AI could handle the routine conversations while keeping the human touch?
                  What if businesses could respond instantly, 24/7, without sacrificing quality?
                </p>
                <p>
                  That vision became DM Automation. Today, we help over 2,500 businesses automate their social media conversations,
                  saving an average of 10+ hours per week while increasing their response rates by 300%.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="font-semibold text-black mb-1">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people building the future of social media automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-blue-100 text-lg">Numbers that show our growth</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2,500+</div>
              <div className="text-blue-100">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">15M+</div>
              <div className="text-blue-100">Messages Automated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">Ready to join us?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start automating your social media conversations today and see why thousands of businesses trust DM Automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
