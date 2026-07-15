import { motion } from 'framer-motion'
import { Copyright, Send, FileSignature, Languages, Repeat } from 'lucide-react'
import { useEffect, useState } from 'react'
import { copyrightService } from '@/services/copyrightService'
import { bookService } from '@/services/bookService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import WhatsAppIcon from '@/components/common/WhatsAppIcon'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import type { Book, CopyrightEnquiryType } from '@/types'

const ENQUIRY_TYPES: { value: CopyrightEnquiryType; en: string; ta: string }[] = [
  { value: 'Translation Rights', en: 'Translation Rights', ta: 'மொழிபெயர்ப்பு உரிமைகள்' },
  { value: 'Reprint Rights', en: 'Reprint Rights', ta: 'மறுபதிப்பு உரிமைகள்' },
  { value: 'Adaptation Rights', en: 'Adaptation Rights', ta: 'தழுவல் உரிமைகள்' },
  { value: 'Other', en: 'Other', ta: 'மற்றவை' },
]

const WHY_CARDS = [
  {
    icon: Languages,
    titleEn: 'Translation Rights',
    titleTa: 'மொழிபெயர்ப்பு உரிமைகள்',
    descEn: 'Bring our Tamil titles to new languages and audiences with proper licensing.',
    descTa: 'சரியான உரிமத்துடன் எங்கள் தமிழ் நூல்களை புதிய மொழிகளுக்கும் வாசகர்களுக்கும் கொண்டு செல்லுங்கள்.',
  },
  {
    icon: Repeat,
    titleEn: 'Reprint & Republishing',
    titleTa: 'மறுபதிப்பு',
    descEn: 'Request reprint or republishing rights for editions and special collections.',
    descTa: 'பதிப்புகள் மற்றும் சிறப்புத் தொகுப்புகளுக்கான மறுபதிப்பு உரிமைகளைக் கோருங்கள்.',
  },
  {
    icon: FileSignature,
    titleEn: 'Adaptation & Licensing',
    titleTa: 'தழுவல் & உரிமம்',
    descEn: 'Enquire about screen, stage, or audio adaptation rights for our published works.',
    descTa: 'எங்கள் வெளியீடுகளுக்கான திரை, மேடை அல்லது ஆடியோ தழுவல் உரிமைகள் குறித்து விசாரிக்கவும்.',
  },
]

export default function CopyrightEnquiries() {
  const { lang } = useLanguage()
  const ta = lang === 'ta'

  const [books, setBooks] = useState<Book[]>([])
  const [form, setForm] = useState({
    applicant_name: '',
    email: '',
    phone_number: '',
    book_id: '' as number | '',
    enquiry_type: '' as CopyrightEnquiryType | '',
    comments: '',
  })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    bookService.getAll({ sort_by: 'title', sort_order: 'asc' })
      .then((r) => setBooks(r.data))
      .catch(() => setBooks([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.book_id) {
      setError(ta ? 'தயவுசெய்து ஒரு புத்தகத்தைத் தேர்ந்தெடுக்கவும்.' : 'Please select a book.')
      return
    }
    if (!form.enquiry_type) {
      setError(ta ? 'தயவுசெய்து விசாரணை வகையைத் தேர்ந்தெடுக்கவும்.' : 'Please select an enquiry type.')
      return
    }
    setSubmitting(true)
    try {
      await copyrightService.submit({ ...form, enquiry_type: form.enquiry_type })
      setSent(true)
      setForm({ applicant_name: '', email: '', phone_number: '', book_id: '', enquiry_type: '', comments: '' })
    } catch {
      setError(ta ? 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும் அல்லது WhatsApp மூலம் தொடர்பு கொள்ளவும்.' : 'Something went wrong. Please try again or reach us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-0">
      <section className="container pt-12 pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Copyright Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Copyright className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className={cn('font-bold text-lg', ta && 'font-tamil')}>
                  {ta ? 'பதிப்புரிமை விசாரணைகள்' : 'Copyright Enquiries'}
                </h2>
                <p className={cn('text-sm text-muted-foreground', ta && 'font-tamil')}>
                  {ta ? 'மொழிபெயர்ப்பு, மறுபதிப்பு மற்றும் தழுவல் உரிமைகள்' : 'Translation, reprint, and adaptation rights.'}
                </p>
              </div>
            </div>
            <p className="text-xs text-destructive mb-6">
              {ta ? '* அவசியமான கேள்வியைக் குறிக்கிறது' : '* Indicates required question'}
            </p>

            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className={cn('font-bold text-lg mb-1', ta && 'font-tamil')}>
                  {ta ? 'நன்றி!' : 'Thank You!'}
                </h3>
                <p className={cn('text-sm text-muted-foreground', ta && 'font-tamil')}>
                  {ta
                    ? 'உங்கள் விசாரணையை நாங்கள் பெற்றுள்ளோம். எங்கள் குழு விரைவில் உங்களை தொடர்பு கொள்ளும்.'
                    : "We've received your enquiry. Our team will get back to you shortly."}
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  <span className={cn(ta && 'font-tamil')}>{ta ? 'மீண்டும் சமர்ப்பிக்க' : 'Submit Another'}</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'விண்ணப்பதாரர் பெயர் *' : 'Applicant Name *'}
                  </label>
                  <Input
                    placeholder={ta ? 'எ.கா. அர்ஜுன் குமார்' : 'e.g. Arjun Kumar'}
                    value={form.applicant_name}
                    onChange={(e) => setForm({ ...form, applicant_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'தொலைபேசி எண் (நாட்டுக் குறியீடுடன், +91-XXXXXXXXXX) *' : 'Phone number with Country Code (+91-XXXXXXXXXX) *'}
                  </label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'புத்தகத்தைத் தேர்ந்தெடுக்கவும் *' : 'Select Book *'}
                  </label>
                  <Select
                    value={form.book_id ? String(form.book_id) : undefined}
                    onValueChange={(v) => setForm({ ...form, book_id: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={ta ? 'புத்தகத்தைத் தேர்ந்தெடுக்கவும்' : 'Choose a book'} />
                    </SelectTrigger>
                    <SelectContent>
                      {books.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>{b.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'விசாரணை வகையைத் தேர்ந்தெடுக்கவும் *' : 'Select Enquiry Type *'}
                  </label>
                  <div className="space-y-2">
                    {ENQUIRY_TYPES.map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          'flex items-center gap-2.5 text-sm cursor-pointer rounded-md border px-3 py-2 transition-colors',
                          form.enquiry_type === opt.value ? 'border-primary bg-primary/5' : 'border-input hover:bg-muted',
                        )}
                      >
                        <input
                          type="radio"
                          name="enquiry_type"
                          value={opt.value}
                          checked={form.enquiry_type === opt.value}
                          onChange={() => setForm({ ...form, enquiry_type: opt.value })}
                          className="h-4 w-4 accent-primary"
                          required
                        />
                        <span className={cn(ta && 'font-tamil')}>{ta ? opt.ta : opt.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'குறிப்புகள்' : 'Comments'}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={ta ? 'உங்கள் திட்டம், இலக்கு மொழி/வடிவம், காலக்கெடு...' : 'Your project, target language/format, timeline...'}
                    value={form.comments}
                    onChange={(e) => setForm({ ...form, comments: e.target.value })}
                    className={cn(
                      'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none',
                      ta && 'font-tamil',
                    )}
                  />
                </div>
                {error && <p className={cn('text-sm text-destructive', ta && 'font-tamil')}>{error}</p>}
                <Button type="submit" className="w-full gap-2" disabled={submitting}>
                  <Send className="h-4 w-4" />
                  <span className={cn(ta && 'font-tamil')}>
                    {submitting ? (ta ? 'சமர்ப்பிக்கிறது…' : 'Submitting…') : (ta ? 'சமர்ப்பிக்க' : 'Submit')}
                  </span>
                </Button>
              </form>
            )}
          </motion.div>

          {/* Right side: WhatsApp CTA + Why */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-5"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 text-white p-7 shadow-xl">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="text-4xl mb-3"><WhatsAppIcon className="h-10 w-10" /></div>
                <h3 className={cn('font-bold text-xl mb-1', ta && 'font-tamil')}>
                  {ta ? 'WhatsApp விரும்புகிறீர்களா?' : 'Prefer WhatsApp?'}
                </h3>
                <p className={cn('text-white/80 text-sm mb-5 leading-relaxed', ta && 'font-tamil')}>
                  {ta
                    ? 'உங்கள் பதிப்புரிமை தேவைகளைப் பற்றி எங்களுக்கு செய்தி அனுப்புங்கள், எங்கள் குழு உடனடியாக உதவும்.'
                    : "Send us a message about your copyright or licensing needs and our team will assist you right away."}
                </p>
                <a
                  href="https://wa.me/919444296929?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20copyright%20%2F%20licensing%20with%20Vaalu%20Pathippagam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold gap-2 shadow">
                    <WhatsAppIcon className="h-4 w-4" /> +91 94442 96929
                  </Button>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <Copyright className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-primary font-tamil">வாலு பதிப்பகம்</div>
                  <div className="text-xs text-muted-foreground">Vaalu Pathippagam</div>
                </div>
              </div>
              <p className={cn('text-sm text-muted-foreground leading-relaxed', ta && 'font-tamil')}>
                {ta
                  ? 'மொழிபெயர்ப்பாளர்கள், பதிப்பகங்கள் மற்றும் தயாரிப்பாளர்களுடன் இணைந்து பணிபுரிகிறோம் — எங்கள் நூல்களை புதிய வடிவங்களிலும் மொழிகளிலும் கொண்டு செல்ல.'
                  : 'We partner with translators, publishers, and producers to bring our titles to new formats and languages.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why enquire with us */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {WHY_CARDS.map(({ icon: Icon, titleEn, titleTa, descEn, descTa }, i) => (
            <motion.div
              key={titleEn}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-red-100 bg-red-50 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center mb-4 shadow">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={cn('font-semibold text-foreground mb-2', ta && 'font-tamil')}>
                {ta ? titleTa : titleEn}
              </h3>
              <p className={cn('text-sm text-muted-foreground leading-relaxed', ta && 'font-tamil')}>
                {ta ? descTa : descEn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
