import { Link } from 'react-router-dom'
import { BookOpen, Library, Tv, Globe, Newspaper } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import founderImg from '@/assets/images/founder.jpeg'

const W = 'max-w-6xl mx-auto px-6'

function SecHeader({ title, tamil }: { title: string; tamil: string }) {
  return (
    <div className="flex items-start gap-4 mb-10">
      <div className="w-1 self-stretch bg-primary rounded-full" />
      <div>
        <h2 className="text-3xl font-bold leading-tight">{title}</h2>
        <p className="text-amber-600 text-sm font-medium mt-1">{tamil}</p>
      </div>
    </div>
  )
}

export default function AboutUs() {
  const { t } = useLanguage()
  const a = t.aboutUs

  const offers = [
    { icon: BookOpen,  color: 'text-red-600',    bar: 'bg-red-600',    title: a.off0Title, tamil: a.off0Tamil, desc: a.off0Desc },
    { icon: Library,   color: 'text-blue-600',   bar: 'bg-blue-600',   title: a.off1Title, tamil: a.off1Tamil, desc: a.off1Desc },
    { icon: Tv,        color: 'text-amber-600',  bar: 'bg-amber-500',  title: a.off2Title, tamil: a.off2Tamil, desc: a.off2Desc },
    { icon: Globe,     color: 'text-green-600',  bar: 'bg-green-600',  title: a.off3Title, tamil: a.off3Tamil, desc: a.off3Desc },
    { icon: Newspaper, color: 'text-purple-600', bar: 'bg-purple-600', title: a.off4Title, tamil: a.off4Tamil, desc: a.off4Desc },
  ]

  const diffPoints = [a.dp0, a.dp1, a.dp2, a.dp3, a.dp4]

  const founderRows = [
    { label: a.fr0L, value: a.fr0V },
    { label: a.fr1L, value: a.fr1V },
    { label: a.fr2L, value: a.fr2V },
    { label: a.fr3L, value: a.fr3V },
    { label: a.fr4L, value: a.fr4V },
    { label: a.fr5L, value: a.fr5V },
    { label: a.fr6L, value: a.fr6V },
    { label: a.fr7L, value: a.fr7V },
  ]

  const awards = [
    { org: a.aw0Org, color: 'text-red-600',   titleTa: a.aw0TitleTa, titleEn: a.aw0TitleEn, desc: a.aw0Desc },
    { org: a.aw1Org, color: 'text-amber-600',  titleTa: a.aw1TitleTa, titleEn: a.aw1TitleEn, desc: a.aw1Desc },
    { org: a.aw2Org, color: 'text-blue-600',   titleTa: a.aw2TitleTa, titleEn: a.aw2TitleEn, desc: a.aw2Desc },
    { org: a.aw3Org, color: 'text-red-600',    titleTa: a.aw3TitleTa, titleEn: a.aw3TitleEn, desc: a.aw3Desc },
    { org: a.aw4Org, color: 'text-amber-600',  titleTa: a.aw4TitleTa, titleEn: a.aw4TitleEn, desc: a.aw4Desc },
    { org: a.aw5Org, color: 'text-green-600',  titleTa: a.aw5TitleTa, titleEn: a.aw5TitleEn, desc: a.aw5Desc },
  ]

  return (
    <div>

      {/* Page title */}
      <div className="text-center py-10 border-b">
        <h1 className="text-4xl font-bold text-primary">{a.pageTitle}</h1>
      </div>

      {/* ── 01 HISTORY ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className={W}>
          <SecHeader title={a.sec1Title} tamil={a.sec1Sub} />
          <p
            className="text-muted-foreground leading-relaxed text-sm max-w-2xl"
            dangerouslySetInnerHTML={{ __html: a.sec1Desc }}
          />

          {/* What we offer */}
          <div className="mt-14">
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-5">{a.whatWeOffer}</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {offers.map((o) => (
                <div key={o.title} className="border rounded-xl overflow-hidden bg-card shadow-sm">
                  <div className={`h-1 ${o.bar}`} />
                  <div className="p-5">
                    <o.icon className={`h-5 w-5 ${o.color} mb-2`} />
                    <div className={`text-[10px] font-semibold ${o.color} mb-0.5`}>{o.tamil}</div>
                    <div className="font-bold text-sm mb-2">{o.title}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{o.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 MISSION & VISION ────────────────────────────────────────────── */}
      <section className="py-16 bg-amber-50">
        <div className={W}>
          <SecHeader title={a.sec2Title} tamil={a.sec2Sub} />

          <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
            <strong className="text-foreground">{a.missionInlineLabel}:</strong>{' '}
            {a.missionDesc}
          </p>

          <p className="text-sm leading-relaxed mb-10 text-muted-foreground">
            <strong className="text-foreground">{a.visionInlineLabel}:</strong>{' '}
            {a.visionDesc}
          </p>

          <h4 className="font-bold text-base mb-5">{a.diffLabel}</h4>
          <ul className="space-y-4">
            {diffPoints.map((p) => {
              const idx = p.indexOf(':')
              const title = idx > -1 ? p.slice(0, idx) : p
              const desc = idx > -1 ? p.slice(idx + 1).trim() : ''
              return (
                <li key={p} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>
                    {desc
                      ? <><strong className="text-foreground underline">{title}:</strong>{' '}{desc}</>
                      : p
                    }
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── 03 FOUNDER PROFILE ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className={W}>
          <SecHeader title={a.sec3Title} tamil={a.sec3Sub} />

          <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
            <div>
              <div className="relative rounded-xl overflow-hidden border bg-muted aspect-[4/5] mb-4">
                <img
                  src={founderImg}
                  alt="Dr. Mo. Ganesan"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                  25+<br /><span className="font-normal text-[10px]">{a.yearsLabel}</span>
                </div>
              </div>
              <div className="font-bold text-base">{a.founderNameTa}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.founderNameSub}</div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1">{a.founderRole}</div>
              <a
                href="https://thamizhbooks.com/book-author/m-ganesan-writer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs text-primary border-b border-primary pb-0.5 hover:opacity-75 transition-opacity"
              >
                {a.browseFounderBooks}
              </a>
            </div>

            <div>
              <blockquote className="text-primary font-semibold text-sm leading-relaxed mb-1">
                {a.founderQuote}
              </blockquote>
              <p className="text-xs text-muted-foreground italic mb-6">{a.founderQuoteEn}</p>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{a.founderBio1}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.founderBio2}</p>
              </div>

              <div className="rounded-xl border overflow-hidden text-xs">
                {founderRows.map(({ label, value }, i) => (
                  <div key={label} className={`grid grid-cols-[130px_1fr] gap-4 px-4 py-2.5 ${i % 2 === 0 ? 'bg-muted/30' : ''}`}>
                    <span className="font-bold text-muted-foreground tracking-wide">{label}</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 AWARDS & HONOURS ────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className={W}>
          <SecHeader title={a.sec4Title} tamil={a.sec4Sub} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((award) => (
              <div key={award.titleEn} className="bg-card border rounded-xl p-5 shadow-sm">
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${award.color}`}>{award.org}</p>
                <div className="font-bold text-sm mb-0.5">{award.titleTa}</div>
                <div className="text-xs text-muted-foreground mb-2">{award.titleEn}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{award.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM RED SECTION ─────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-20 text-center">
        <div className={W}>
          <p className="text-3xl md:text-4xl font-bold leading-relaxed mb-2">{a.bottomTitle}</p>
          <p className="text-sm text-white/60 mb-8">{a.bottomSub}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/books">
              <button className="flex items-center gap-2 border border-white text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-white hover:text-primary transition-colors">
                <BookOpen className="h-4 w-4" /> {a.browseBooks}
              </button>
            </Link>
            <Link to="/contact">
              <button className="flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">
                {a.contactUs}
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
