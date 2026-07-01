import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, BookOpen } from 'lucide-react'
import WhatsAppIcon from '@/components/common/WhatsAppIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+91 94442 96929'],
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['vaalupathippagam@gmail.com',],
    color: 'from-primary to-red-700',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['Chennai, Tamil Nadu'],
    color: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon – Sat : 9AM – 7PM', 'Sunday : Closed'],
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
]

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 py-16 md:py-20">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02eiIvPjwvZz48L2c+PC9zdmc+')]" />
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4"
          >
            <Mail className="h-4 w-4" />
            We'd love to hear from you
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-3"
          >
            Contact <span className="text-primary">Vaalu Pathippagam</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-2"
          >
            Have a question about a book, order, or collaboration? Reach out — we respond within 24 hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-bold text-primary font-tamil"
          >
            தொடர்பு கொள்ளுங்கள்
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONTACT_CARDS.map(({ icon: Icon, title, lines, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border ${border} ${bg} p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              {lines.map((line, j) => (
                <p key={j} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + WhatsApp */}
      <section className="container pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Send us a Message</h2>
                <p className="text-sm text-muted-foreground">We'll get back to you shortly</p>
              </div>
            </div>

            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-lg mb-1">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">Thank you for reaching out. We'll respond within 24 hours.</p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Your Name</label>
                    <Input
                      placeholder="e.g. Arjun Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your inquiry, book request, or feedback..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            )}
          </motion.div>

          {/* Right side: WhatsApp CTA + Info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-5"
          >
            {/* WhatsApp Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 text-white p-7 shadow-xl">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="text-4xl mb-3"><WhatsAppIcon className="h-10 w-10" /></div>
                <h3 className="font-bold text-xl mb-1">Chat on WhatsApp</h3>
                <p className="text-white/80 text-sm mb-5 leading-relaxed">
                  Get instant replies for book enquiries, gift currency orders, and custom requests.
                </p>
                <a
                  href="https://wa.me/919444296929?text=Hi%2C%20I%20have%20an%20enquiry%20about%20Vaalu%20Pathippagam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold gap-2 shadow">
                    <WhatsAppIcon className="h-4 w-4" /> +91 94442 96929
                  </Button>
                </a>
              </div>
            </div>

            {/* Publisher info */}
            <div className="rounded-2xl border bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-primary font-tamil">வாலு பதிப்பகம்</div>
                  <div className="text-xs text-muted-foreground">Vaalu Pathippagam</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vaalu Pathippagam has been preserving and promoting Tamil literature for over a decade.
                Whether you're a reader, author, or business looking to collaborate — we welcome you.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Tamil Books', 'Gift Currency', 'Custom Calendars', 'Publishing'].map(tag => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium">{tag}</span>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl border overflow-hidden shadow-sm">
              <div className="bg-muted h-40 flex items-center justify-center gap-3 text-muted-foreground">
                <MapPin className="h-6 w-6" />
                <div className="text-sm">
                  <div className="font-medium text-foreground">Chennai, Tamil Nadu</div>
                </div>
              </div>
              <div className="p-4 bg-white flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mon – Sat · 9AM – 7PM</span>
                <a
                  href="https://maps.google.com/?q=Chennai,Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <MapPin className="h-3.5 w-3.5" /> Get Directions
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
