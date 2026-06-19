import { FileText, ShoppingCart, CreditCard, BookOpen, Scale, Mail } from 'lucide-react'

const sections = [
  {
    icon: ShoppingCart,
    title: 'Orders & Purchases',
    items: [
      'All orders are subject to availability. We reserve the right to cancel any order due to stock unavailability.',
      'Prices displayed on the website are inclusive of applicable taxes unless otherwise stated.',
      'We reserve the right to change prices without prior notice. The price at the time of order confirmation is binding.',
      'Order cancellations by the customer are accepted before dispatch. Post-dispatch, the Returns Policy applies.',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments',
    items: [
      'We accept UPI, Net Banking, Debit/Credit Cards, and Cash on Delivery (COD) for eligible orders.',
      'Payments are processed securely through Razorpay. We do not store your payment credentials.',
      'In case of a payment failure, please verify your bank before attempting again to avoid duplicate charges.',
      'COD is available on orders up to ₹1,500. Additional COD charges of ₹30 may apply.',
    ],
  },
  {
    icon: BookOpen,
    title: 'Intellectual Property',
    items: [
      'All content on this website — text, images, logos, and book descriptions — is the property of Vaalu Pathippagam.',
      'Book content is the intellectual property of the respective authors and publishers.',
      'You may not reproduce, distribute, or use any content without prior written permission.',
      'Review and comment content submitted by users remains their own, but you grant us a licence to display it.',
    ],
  },
  {
    icon: Scale,
    title: 'Limitation of Liability',
    items: [
      'Vaalu Pathippagam is not liable for indirect, incidental, or consequential damages arising from use of the platform.',
      'We are not responsible for delays caused by courier partners, natural events, or government restrictions.',
      'Product images are for representation purposes only. Minor variations in cover design may occur.',
      'Our maximum liability shall not exceed the amount paid for the specific order in dispute.',
    ],
  },
]

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-vaalu-dark to-gray-800 text-white py-16">
        <div className="container text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-5">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            Please read these terms carefully before using the Vaalu Pathippagam website and services.
          </p>
          <p className="text-white/30 text-xs mt-4">Last updated: June 2025</p>
        </div>
      </div>

      <div className="container py-14 max-w-3xl space-y-8">
        {/* Acceptance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-sm text-gray-600 leading-relaxed">
          By accessing or using the Vaalu Pathippagam website, you agree to be bound by these Terms & Conditions.
          If you do not agree with any part of these terms, please do not use our services. These terms apply to
          all visitors, registered users, and customers.
        </div>

        {sections.map(({ icon: Icon, title, items }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            </div>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* User Conduct */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">User Conduct</h2>
          <p className="text-sm text-gray-600 mb-3">You agree not to:</p>
          <ul className="space-y-1.5 text-sm text-gray-600">
            {[
              'Use the platform for any unlawful purpose',
              'Post false reviews or fraudulent orders',
              'Attempt to gain unauthorised access to our systems',
              "Interfere with the website's normal functioning",
            ].map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Governing Law</h2>
          <p className="text-sm text-gray-600">
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of courts in Chennai, Tamil Nadu.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-gray-600">
            Questions about these terms? Email us at{' '}
            <a href="mailto:vaalupathippagam@gmail.com" className="text-primary font-medium hover:underline">
              vaalupathippagam@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
