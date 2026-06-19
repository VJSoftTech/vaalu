import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, Phone } from 'lucide-react'

const eligibleReasons = [
  'Damaged or defective book received',
  'Wrong book delivered',
  'Book significantly different from description',
  'Missing pages or printing defects',
  'Sealed package tampered upon delivery',
]

const ineligibleReasons = [
  'Change of mind after delivery',
  'Book opened and read',
  'Return requested after 7 days of delivery',
  'Items purchased on clearance sale',
  'Damage caused by improper handling by the customer',
]

const steps = [
  { step: '1', title: 'Raise a Request', desc: 'Email us at vaalupathippagam@gmail.com or call within 7 days of delivery.' },
  { step: '2', title: 'Share Photos', desc: 'Attach clear photos of the damaged/wrong item and the original packaging.' },
  { step: '3', title: 'Review', desc: 'Our team reviews the request within 2 business days and approves or clarifies.' },
  { step: '4', title: 'Pickup', desc: 'A reverse pickup is scheduled at no extra cost for eligible returns.' },
  { step: '5', title: 'Refund', desc: 'Refund is processed within 5–7 business days after we receive the returned item.' },
]

export default function ReturnsRefunds() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-vaalu-dark to-gray-800 text-white py-16">
        <div className="container text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-5">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Returns & Refunds</h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            We want you to be happy with every purchase. Here's our straightforward return and refund policy.
          </p>
        </div>
      </div>

      <div className="container py-14 space-y-10">
        {/* Return Window */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 shrink-0">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">7-Day Return Window</h2>
            <p className="text-sm text-gray-500 mt-1">
              You can initiate a return within <strong>7 days</strong> of receiving your order. Beyond this window, we are unable to process returns.
            </p>
          </div>
        </div>

        {/* Eligible vs Ineligible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" /> Eligible for Return
            </h2>
            <ul className="space-y-2">
              {eligibleReasons.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" /> Not Eligible for Return
            </h2>
            <ul className="space-y-2">
              {ineligibleReasons.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Process */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Return Process</h2>
          <div className="space-y-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold shrink-0">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Methods */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-blue-900 mb-3">Refund Methods</h2>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> Original payment method (UPI, Net Banking, Card) — 5–7 business days</li>
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> Vaalu store credit — credited within 24 hours</li>
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 shrink-0" /> COD orders refunded via bank transfer after account verification</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700">
            Need help? Call us at{' '}
            <a href="tel:+919444296929" className="font-semibold hover:underline">+91 94442 96929</a> or
            email{' '}
            <a href="mailto:vaalupathippagam@gmail.com" className="font-semibold hover:underline">vaalupathippagam@gmail.com</a>
          </p>
          <Phone className="h-4 w-4 text-amber-600 shrink-0 ml-auto" />
        </div>
      </div>
    </div>
  )
}
