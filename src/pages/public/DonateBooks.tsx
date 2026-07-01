import { motion } from 'framer-motion'
import { BookOpen, Send, Users, Sparkles, School } from 'lucide-react'
import { useState } from 'react'
import { donationService } from '@/services/donationService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import WhatsAppIcon from '@/components/common/WhatsAppIcon'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

const IMPACT_CARDS = [
  {
    icon: School,
    titleEn: 'Reach Schools & Libraries',
    titleTa: 'பள்ளிகள் & நூலகங்களை சென்றடையும்',
    descEn: 'Your donated books find new homes in rural schools and public libraries across Tamil Nadu.',
    descTa: 'நீங்கள் நன்கொடையாக அளிக்கும் புத்தகங்கள் தமிழ்நாடு முழுவதும் உள்ள கிராமப்புற பள்ளிகள் மற்றும் பொது நூலகங்களுக்குச் செல்கின்றன.',
  },
  {
    icon: Users,
    titleEn: 'Support New Readers',
    titleTa: 'புதிய வாசகர்களுக்கு உதவுங்கள்',
    descEn: 'Help students and first-time readers discover the joy of Tamil literature.',
    descTa: 'மாணவர்கள் மற்றும் முதல் முறை வாசிப்பவர்கள் தமிழ் இலக்கியத்தின் மகிழ்ச்சியை கண்டறிய உதவுங்கள்.',
  },
  {
    icon: Sparkles,
    titleEn: 'Give Books a Second Life',
    titleTa: 'புத்தகங்களுக்கு இரண்டாம் வாழ்வு',
    descEn: 'Pre-loved books are sorted, cleaned, and gifted with care to those who need them most.',
    descTa: 'பயன்படுத்தப்பட்ட புத்தகங்கள் வரிசைப்படுத்தப்பட்டு, சுத்தம் செய்யப்பட்டு, மிகவும் தேவைப்படுபவர்களுக்கு அக்கறையுடன் வழங்கப்படுகின்றன.',
  },
]

export default function DonateBooks() {
  const { lang } = useLanguage()
  const ta = lang === 'ta'

  const [form, setForm] = useState({ name: '', email: '', phone_number: '', best_time_to_call: '', comments: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await donationService.submit(form)
      setSent(true)
      setForm({ name: '', email: '', phone_number: '', best_time_to_call: '', comments: '' })
    } catch {
      setError(ta ? 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும் அல்லது WhatsApp மூலம் தொடர்பு கொள்ளவும்.' : 'Something went wrong. Please try again or reach us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-0">
      {/* Form + WhatsApp */}
      <section className="container pt-12 pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Donation Form */}
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
                <h2 className={cn('font-bold text-lg', ta && 'font-tamil')}>
                  {ta ? 'புத்தகங்களை நன்கொடை செய்யுங்கள்!' : 'Donate Books!'}
                </h2>
                <p className={cn('text-sm text-muted-foreground', ta && 'font-tamil')}>
                  {ta
                    ? 'உங்கள் நன்கொடை குறித்து எங்களிடம் கூறுங்கள், நாங்கள் பிக்அப் அல்லது டிராப்-ஆஃப் ஏற்பாடு செய்வோம்'
                    : "Tell us a bit about your donation and we'll arrange a pickup or drop-off"}
                </p>
              </div>
            </div>

            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className={cn('font-bold text-lg mb-1', ta && 'font-tamil')}>
                  {ta ? 'நன்றி!' : 'Thank You!'}
                </h3>
                <p className={cn('text-sm text-muted-foreground', ta && 'font-tamil')}>
                  {ta
                    ? 'உங்கள் நன்கொடை கோரிக்கையை நாங்கள் பெற்றுள்ளோம். நீங்கள் கூறிய நேரத்தில் எங்கள் குழு உங்களை அழைக்கும்.'
                    : "We've received your donation request. Our team will call you at the time you've shared."}
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  <span className={cn(ta && 'font-tamil')}>{ta ? 'மீண்டும் சமர்ப்பிக்க' : 'Submit Another'}</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                      {ta ? 'பெயர் *' : 'Name *'}
                    </label>
                    <Input
                      placeholder={ta ? 'எ.கா. அர்ஜுன் குமார்' : 'e.g. Arjun Kumar'}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                      {ta ? 'மின்னஞ்சல்' : 'E-mail'}
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'தொலைபேசி எண் (நாட்டுக் குறியீடுடன்) *' : 'Phone Number (with country code) *'}
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
                    {ta ? 'அழைக்க ஏற்ற நேரம் *' : 'Best Time to Call *'}
                  </label>
                  <Input
                    type="time"
                    value={form.best_time_to_call}
                    onChange={(e) => setForm({ ...form, best_time_to_call: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', ta && 'font-tamil')}>
                    {ta ? 'குறிப்புகள்' : 'Comments'}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={ta ? 'புத்தகங்களின் எண்ணிக்கை, நிலை, வகை, பிக்அப் முகவரி...' : 'Number of books, condition, genre, pickup address...'}
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
                <h3 className={cn('font-bold text-xl mb-1', ta && 'font-tamil')}>
                  {ta ? 'WhatsApp விரும்புகிறீர்களா?' : 'Prefer WhatsApp?'}
                </h3>
                <p className={cn('text-white/80 text-sm mb-5 leading-relaxed', ta && 'font-tamil')}>
                  {ta
                    ? 'நீங்கள் நன்கொடை அளிக்க விரும்பும் புத்தகங்களின் புகைப்படங்களுடன் எங்களுக்கு செய்தி அனுப்புங்கள், பிக்அப் செயல்முறையில் நாங்கள் வழிகாட்டுவோம்.'
                    : "Send us a message with photos of the books you'd like to donate and we'll guide you through pickup."}
                </p>
                <a
                  href="https://wa.me/919444296929?text=Hi%2C%20I%27d%20like%20to%20donate%20books%20to%20Vaalu%20Pathippagam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-green-700 hover:bg-green-50 font-semibold gap-2 shadow">
                    <WhatsAppIcon className="h-4 w-4" /> +91 94442 96929
                  </Button>
                </a>
              </div>
            </div>

            {/* Why donate info */}
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
              <p className={cn('text-sm text-muted-foreground leading-relaxed', ta && 'font-tamil')}>
                {ta
                  ? 'நன்கொடையாக அளிக்கப்படும் ஒவ்வொரு புத்தகமும் ஒரு பள்ளி நூலகம், ஒரு கிராமப்புற வாசிப்பு அறை, அல்லது அதை வாங்க முடியாத ஒரு வாசகரை சென்றடைகிறது. உங்கள் பயன்படுத்தப்பட்ட தமிழ் புத்தகங்கள் அடுத்த வாசகருக்காக கதைகளை உயிருடன் வைத்திருக்கின்றன.'
                  : "Every donated book finds its way to a school library, a rural reading room, or a fellow reader who couldn't otherwise afford it. Your gently-used Tamil books keep stories alive for the next reader."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(ta
                  ? ['தமிழ் நாவல்கள்', 'கதை புத்தகங்கள்', 'பள்ளி குறிப்பு நூல்கள்', 'கவிதை', 'குழந்தை புத்தகங்கள்']
                  : ['Tamil Novels', 'Story Books', 'School Reference', 'Poetry', 'Children Books']
                ).map(tag => (
                  <span key={tag} className={cn('text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium', ta && 'font-tamil')}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Cards */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {IMPACT_CARDS.map(({ icon: Icon, titleEn, titleTa, descEn, descTa }, i) => (
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
