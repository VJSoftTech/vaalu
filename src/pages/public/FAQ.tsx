import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'

const faqs = [
  {
    category: 'Orders',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse our catalogue, add your favourite books to the cart, and proceed to checkout. You can pay via UPI, Net Banking, Debit/Credit Card, or Cash on Delivery.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can cancel or modify an order before it is dispatched. Once dispatched, modifications are not possible. Contact us immediately at vaalupathippagam@gmail.com to request a change.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you will receive an SMS and email with a tracking link. You can also check the status in the "My Orders" section after logging in.',
      },
      {
        q: 'Is COD available?',
        a: 'Yes, Cash on Delivery is available for orders up to ₹1,500. A COD handling fee of ₹30 applies. COD is not available for orders outside India.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI (GPay, PhonePe, Paytm), Net Banking, Debit/Credit Cards (Visa, Mastercard, RuPay), and Cash on Delivery.',
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Absolutely. All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We never store your card or bank details.',
      },
      {
        q: 'What if my payment fails?',
        a: 'If your payment fails, check with your bank first. If the amount was debited but the order was not placed, it will be automatically refunded within 5–7 business days.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available for an additional ₹99. Delivery to remote areas may take up to 10 days.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! Orders above ₹499 qualify for free standard shipping across India.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently we ship only within India. We are working on enabling international shipping — stay tuned!',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for damaged, defective, or incorrectly delivered books. Items must be in their original condition.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Refunds are processed within 5–7 business days after we receive and verify the returned item. Refunds go to the original payment method.',
      },
      {
        q: 'I received a wrong book. What do I do?',
        a: 'We apologise for the inconvenience! Email us at vaalupathippagam@gmail.com with your order number and a photo of the received book. We will arrange a replacement or refund promptly.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    questions: [
      {
        q: 'Do I need an account to shop?',
        a: 'You can browse the catalogue without an account, but you need to register to place orders, track purchases, and manage your wishlist.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and enter your registered email. You will receive a reset link within a few minutes.',
      },
      {
        q: 'How do I delete my account?',
        a: 'To delete your account, email us at privacy@vaalupathippagam.com. We will process your request within 7 business days.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-gray-800">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-500 pb-4 leading-relaxed">{a}</p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-vaalu-dark to-gray-800 text-white py-16">
        <div className="container text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-5">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            Find quick answers to the most common questions about ordering, payments, shipping, and more.
          </p>
        </div>
      </div>

      <div className="container py-14 max-w-3xl space-y-8">
        {faqs.map(({ category, questions }) => (
          <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">{category}</h2>
            <div>
              {questions.map(({ q, a }) => (
                <FAQItem key={q} q={q} a={a} />
              ))}
            </div>
          </div>
        ))}

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-1 font-medium">Still have questions?</p>
          <p className="text-sm text-gray-500">
            Email us at{' '}
            <a href="mailto:vaalupathippagam@gmail.com" className="text-primary font-medium hover:underline">
              vaalupathippagam@gmail.com
            </a>{' '}
            or call{' '}
            <a href="tel:+919444296929" className="text-primary font-medium hover:underline">
              +91 94442 96929
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
