import { motion } from 'framer-motion'
import { Building2, Send, Package, BookOpenCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { corporateService } from '@/services/corporateService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import WhatsAppIcon from '@/components/common/WhatsAppIcon'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import type { CorporateEnquiryType } from '@/types'

const ENQUIRY_TYPES: { value: CorporateEnquiryType; en: string; ta: string }[] = [
  { value: 'Bulk Order', en: 'Bulk Order', ta: 'மொத்த ஆர்டர்' },
  { value: 'Book Fair', en: 'Book Fair', ta: 'புத்தகக் காட்சி' },
  { value: 'Both', en: 'Both', ta: 'இரண்டும்' },
]

const WHY_CARDS = [
  {
    icon: Package,
    titleEn: 'Bulk Order Discounts',
    titleTa: 'மொத்த ஆர்டர் தள்ளுபடி',
    descEn: 'Special pricing for schools, libraries, and corporates ordering in volume.',
    descTa: 'அளவில் ஆர்டர் செய்யும் பள்ளிகள், நூலகங்கள், நிறுவனங்களுக்கு சிறப்பு விலை.',
  },
  {
    icon: BookOpenCheck,
    titleEn: 'Book Fair Participation',
    titleTa: 'புத்தகக் காட்சி பங்கேற்பு',
    descEn: 'We set up stalls and curated collections for campus and community book fairs.',
    descTa: 'வளாகம் மற்றும் சமூக புத்தகக் காட்சிகளுக்கு அரங்குகள் மற்றும் தொகுப்புகளை ஏற்பாடு செய்கிறோம்.',
  },
  {
    icon: Sparkles,
    titleEn: 'Custom Collections',
    titleTa: 'தனிப்பயன் தொகுப்புகள்',
    descEn: 'Curated Tamil literature sets tailored to your audience and occasion.',
    descTa: 'உங்கள் பார்வையாளர்களுக்கும் நிகழ்வுக்கும் ஏற்ப தமிழ் இலக்கியத் தொகுப்புகள்.',
  },
]

export default function CorporateEnquiries() {
  const { lang } = useLanguage()
  const ta = lang === 'ta'

  const [form, setForm] = useState({
    company_name: '',
    contact_person_name: '',
    email: '',
    phone_number: '',
    best_time_to_call: '',
    enquiry_type: '' as CorporateEnquiryType | '',
    comments: '',
  })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.enquiry_type) {
      setError(ta ? 'தயவுசெய்து விசாரணை வகையைத் தேர்ந்தெடுக்கவும்.' : 'Please select an enquiry type.')
      return
    }
    setSubmitting(true)
    try {
      await corporateService.submit({ ...form, enquiry_type: form.enquiry_type })
      setSent(true)
      setForm({
        company_name: '', contact_person_name: '', email: '', phone_number: '',
        best_time_to_call: '', enquiry_type: '', comments: '',
      })
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
          {/* Corporate Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border shadow-sm p-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className={cn('font-bold text-lg', ta && 'font-tamil')}>
                  {ta ? 'நிறுவன விசாரணைகள்' : 'Corporate Enquiries'}
                </h2>
                <p className={cn('text-sm text-muted-foreground', ta && 'font-tamil')}>
                  {ta ? 'நிறுவன ஆர்டர்கள் எளிது, புத்தகக் காட்சிகள் விரிவு' : 'Corporate orders simplified, campus fairs amplified.'}
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
                    {ta ? 'நிறுவனம் / நிறுவன பெயர் *' : 'Company / Institution Name *'}
                  </label>
                  <Input
                    placeholder={ta ? 'எ.கா. ஏபிசி பள்ளி' : 'e.g. ABC School'}
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'தொடர்பு நபர் பெயர் *' : 'Contact Person Name *'}
                  </label>
                  <Input
                    placeholder={ta ? 'எ.கா. அர்ஜுன் குமார்' : 'e.g. Arjun Kumar'}
                    value={form.contact_person_name}
                    onChange={(e) => setForm({ ...form, contact_person_name: e.target.value })}
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
                    {ta ? 'அழைக்க ஏற்ற நேரம்' : 'Best Time to Call'}
                  </label>
                  <Input
                    type="time"
                    value={form.best_time_to_call}
                    onChange={(e) => setForm({ ...form, best_time_to_call: e.target.value })}
                  />
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
                    placeholder={ta ? 'ஆர்டர் அளவு, தேவையான தலைப்புகள், காட்சி தேதிகள்...' : 'Order quantity, titles needed, fair dates...'}
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
                    ? 'உங்கள் நிறுவன தேவைகளைப் பற்றி எங்களுக்கு செய்தி அனுப்புங்கள், எங்கள் குழு உடனடியாக உதவும்.'
                    : "Send us a message about your corporate or book fair needs and our team will assist you right away."}
                </p>
                <a
                  href="https://wa.me/919444296929?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20corporate%20orders%20with%20Vaalu%20Pathippagam"
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
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-primary font-tamil">வாலு பதிப்பகம்</div>
                  <div className="text-xs text-muted-foreground">Vaalu Pathippagam</div>
                </div>
              </div>
              <p className={cn('text-sm text-muted-foreground leading-relaxed', ta && 'font-tamil')}>
                {ta
                  ? 'பள்ளிகள், நூலகங்கள், நிறுவனங்கள் மற்றும் வளாக புத்தகக் காட்சி அமைப்பாளர்களுடன் இணைந்து பணிபுரிகிறோம் — மொத்த ஆர்டர்கள் முதல் முழு அரங்க அமைப்பு வரை.'
                  : 'We partner with schools, libraries, corporates, and campus fair organisers — from bulk orders to full stall setups.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why partner with us */}
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
