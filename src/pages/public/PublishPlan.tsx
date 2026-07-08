import { useState } from 'react'
import {
  ClipboardCheck, SpellCheck, Image, Printer, Tv, PackageCheck, Sparkles,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import publishPlanBanner from '@/assets/publish-plan-banner.jpg'
import ImageLightbox from '@/components/common/ImageLightbox'

const timeline = [
  {
    icon: ClipboardCheck,
    days: '1 - 3',
    titleEn: 'Manuscript Review & Selection',
    titleTa: 'படைப்பு ஆய்வு & தேர்வு',
    descEn: 'Stories, poems, or articles received from the writer are reviewed by our editorial panel — under the supervision of Dr. Mo. Ganesan — and selected for publication.',
    descTa: 'எழுத்தாளரிடமிருந்து பெறப்படும் கதை, கவிதை அல்லது கட்டுரைகளை எமது ஆய்வுக்குழு (முனைவர் மோ. கணேசன் அவர்களின் மேற்பார்வையில்) பரிசீலித்து, வெளியீட்டிற்குத் தேர்வு செய்யும்.',
  },
  {
    icon: SpellCheck,
    days: '4 - 6',
    titleEn: 'Proof Reading & Design',
    titleTa: 'மெய்ப்பு திருத்தம் & வடிவமைப்பு',
    descEn: 'Selected works are corrected for errors, and the book\'s interior pages are elegantly designed (DTP & Interior Layout).',
    descTa: 'தேர்வு செய்யப்பட்ட படைப்புகள் எழுத்துப்பிழையின்றி திருத்தப்பட்டு, நூலின் உட்பக்கங்கள் நேர்த்தியாக வடிவமைக்கப்படும் (DTP & Interior Layout).',
  },
  {
    icon: Image,
    days: '7 - 9',
    titleEn: 'Cover Design & ISBN Registration',
    titleTa: 'அட்டைப் படம் & ISBN அங்கீகாரம்',
    descEn: 'An attractive cover is designed to match the book\'s content, and the ISBN is obtained from the Central Government for the title.',
    descTa: 'புத்தகத்தின் உள்ளடக்கத்திற்கு ஏற்றவாறு கவர்ச்சிகரமான அட்டைப் படம் வடிவமைக்கப்படும். அதே நேரத்தில், மத்திய அரசிடமிருந்து அந்த நூலுக்கான ISBN பெறப்படும்.',
  },
  {
    icon: Printer,
    days: '10 - 13',
    titleEn: 'Printing',
    titleTa: 'அச்சுப் பணி (Printing)',
    descEn: 'The book is printed on high-quality paper using modern machines, and bound with premium-quality finishing.',
    descTa: 'நவீன தொழில்நுட்ப இயந்திரங்கள் மூலம் உயர்தரத் தாள்களில் புத்தகம் அச்சிடப்பட்டு, தரமான முறையில் பைண்டிங் செய்யப்படும்.',
  },
  {
    icon: Tv,
    days: '14',
    titleEn: 'Vaalu TV Promotion',
    titleTa: 'வாலு டிவி விளம்பரம்',
    descEn: 'As the book goes to print, an introductory video and promotion is released through Vaalu TV — 2.28 lakh subscribers strong.',
    descTa: 'புத்தகம் அச்சாகி வெளிவரும் போதே, எமது வாலு டிவி (2.28 லட்சம் சந்தாதாரர்கள்) மூலம் அந்தப் புத்தகம் குறித்த அறிமுக வீடியோ மற்றும் விளம்பரம் வெளியிடப்படும்.',
  },
  {
    icon: PackageCheck,
    days: '15',
    titleEn: 'Launch — In Your Hands!',
    titleTa: 'வெளியீடு & உங்கள் கைகளில்!',
    descEn: 'Exactly on the 15th day, your creation reaches your hands as a treasured book.',
    descTa: 'சரியாக 15-வது நாளில் உங்களது படைப்பு ஒரு பொக்கிஷமாக உங்கள் கரங்களை வந்தடையும்.',
  },
]

export default function PublishPlan() {
  const { lang } = useLanguage()
  const ta = lang === 'ta'
  const [zoomOpen, setZoomOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-10 max-w-4xl">
        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className={`text-xl md:text-2xl font-bold text-gray-900 ${ta ? 'font-tamil' : ''}`}>
            {ta
              ? '15 நாட்களில் உங்களது கனவுப் புத்தகம்: வாலு பதிப்பகத்தின் அதிரடித் திட்டம்!'
              : '15-Day Publishing Plan: Vaalu Pathippagam\'s Power-Packed Promise!'}
          </h1>
        </div>

        {/* Banner Image */}
        <img
          src={publishPlanBanner}
          alt={ta ? '15 நாள் வெளியீட்டுத் திட்டம்' : '15-Day Publishing Plan'}
          onClick={() => setZoomOpen(true)}
          className="w-full object-contain rounded-lg mt-6 mb-8 cursor-zoom-in"
        />

        <ImageLightbox
          src={publishPlanBanner}
          alt={ta ? '15 நாள் வெளியீட்டுத் திட்டம்' : '15-Day Publishing Plan'}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />

        {/* Timeline */}
        <h2 className={`text-sm font-semibold uppercase tracking-widest text-primary mb-4 ${ta ? 'font-tamil' : ''}`}>
          {ta ? 'எமது 15 நாள் கால அட்டவணை' : 'Our 15-Day Timeline'}
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 mb-8">
          {timeline.map(({ icon: Icon, days, titleEn, titleTa, descEn, descTa }) => (
            <div key={titleEn} className="flex gap-4 p-5">
              <div className="flex flex-col items-center shrink-0 w-14">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-gray-400 mt-1">
                  {ta ? `நாள் ${days}` : `Day ${days}`}
                </span>
              </div>
              <div>
                <h3 className={`text-sm font-semibold text-gray-900 mb-1 ${ta ? 'font-tamil' : ''}`}>
                  {ta ? titleTa : titleEn}
                </h3>
                <p className={`text-sm text-gray-500 leading-relaxed ${ta ? 'font-tamil' : ''}`}>
                  {ta ? descTa : descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
