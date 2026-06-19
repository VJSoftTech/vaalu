import { Shield, Eye, Database, Lock, Share2, Mail } from 'lucide-react'

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Personal details such as name, email address, phone number, and delivery address when you register or place an order.',
      'Payment information processed securely through our payment gateway (Razorpay). We do not store card details on our servers.',
      'Browsing data including pages visited, search queries, and products viewed to improve your experience.',
      'Device information such as IP address, browser type, and operating system for security and analytics purposes.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To process and fulfill your orders, including shipping and delivery notifications.',
      'To send order confirmations, invoices, and customer support responses.',
      'To personalise your browsing experience and recommend books relevant to your interests.',
      'To send newsletters and promotional offers — you can unsubscribe at any time.',
      'To detect and prevent fraudulent transactions and maintain security.',
    ],
  },
  {
    icon: Share2,
    title: 'Information Sharing',
    content: [
      'We do not sell or rent your personal information to third parties.',
      'We share data with trusted service providers (shipping partners, payment gateways) solely to fulfill your orders.',
      'We may disclose information when required by law or to protect the rights and safety of our users.',
      'Aggregated, non-identifiable data may be used for analytics and business improvement purposes.',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'We use industry-standard SSL/TLS encryption to protect data in transit.',
      'Access to personal data is restricted to authorised personnel only.',
      'We regularly review and update our security practices to guard against unauthorised access.',
      'In the event of a data breach, we will notify affected users as required by applicable law.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-vaalu-dark to-gray-800 text-white py-16">
        <div className="container text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-5">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            Your privacy matters to us. Learn how Vaalu Pathippagam collects, uses, and protects your information.
          </p>
          <p className="text-white/30 text-xs mt-4">Last updated: June 2025</p>
        </div>
      </div>

      <div className="container py-14 max-w-3xl space-y-8">
        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-600 leading-relaxed">
          This Privacy Policy explains how <strong>Vaalu Pathippagam</strong> ("we", "us", or "our") collects,
          uses, and safeguards your personal data when you use our website and services. By using our platform
          you agree to the practices described in this policy.
        </div>

        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            </div>
            <ul className="space-y-2">
              {content.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Cookies */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Cookies</h2>
          <p className="text-sm text-gray-600">
            We use cookies to maintain your session, remember preferences, and analyse traffic. You can disable
            cookies through your browser settings, though some features of the website may not function correctly
            without them.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Your Rights</h2>
          <p className="text-sm text-gray-600 mb-3">You have the right to:</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {[
              'Access the personal information we hold about you',
              'Request correction of inaccurate data',
              'Request deletion of your account and associated data',
              'Opt out of marketing communications at any time',
            ].map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-gray-600">
            Privacy questions? Email our Data Protection Officer at{' '}
            <a href="mailto:privacy@vaalupathippagam.com" className="text-primary font-medium hover:underline">
              privacy@vaalupathippagam.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
