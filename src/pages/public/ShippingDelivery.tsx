import { Truck, Clock, MapPin, Package, AlertCircle, CheckCircle } from 'lucide-react'

const sections = [
  {
    icon: Truck,
    title: 'Delivery Methods',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    items: [
      { label: 'Standard Delivery', detail: '5–7 business days — ₹49' },
      { label: 'Express Delivery', detail: '2–3 business days — ₹99' },
      { label: 'Free Shipping', detail: 'On orders above ₹499' },
    ],
  },
  {
    icon: MapPin,
    title: 'Delivery Coverage',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    items: [
      { label: 'Pan India', detail: 'We deliver to all states and union territories' },
      { label: 'Tamil Nadu', detail: 'Faster delivery within 2–4 days' },
      { label: 'Remote Areas', detail: 'May take up to 10 business days' },
    ],
  },
  {
    icon: Clock,
    title: 'Processing Time',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    items: [
      { label: 'Order Confirmation', detail: 'Within 1 hour of placing the order' },
      { label: 'Dispatch', detail: 'Within 1–2 business days' },
      { label: 'Tracking Updates', detail: 'SMS & email once dispatched' },
    ],
  },
  {
    icon: Package,
    title: 'Packaging',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    items: [
      { label: 'Secure Packaging', detail: 'Books are bubble-wrapped to prevent damage' },
      { label: 'Eco-Friendly', detail: 'We use recyclable packaging materials' },
      { label: 'Gift Wrapping', detail: 'Available at ₹30 per order on request' },
    ],
  },
]

const notes = [
  'Delivery timelines are estimates and may vary during peak seasons or public holidays.',
  'Orders placed after 5 PM will be processed the next business day.',
  'COD (Cash on Delivery) is available for orders up to ₹1,500.',
  'We are not responsible for delays caused by incorrect or incomplete addresses.',
]

export default function ShippingDelivery() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-vaalu-dark to-gray-800 text-white py-16">
        <div className="container text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-5">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Shipping & Delivery</h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            Everything you need to know about how we deliver your favourite Tamil books right to your door.
          </p>
        </div>
      </div>

      <div className="container py-14">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {sections.map(({ icon: Icon, title, color, bg, items }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
              <ul className="space-y-3">
                {items.map(({ label, detail }) => (
                  <li key={label} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-800">{label}</span>
                      <span className="text-sm text-gray-500"> — {detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-semibold text-amber-800">Important Notes</h2>
          </div>
          <ul className="space-y-2">
            {notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          Questions? Reach us at{' '}
          <a href="mailto:vaalupathippagam@gmail.com" className="text-primary hover:underline">
            vaalupathippagam@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
