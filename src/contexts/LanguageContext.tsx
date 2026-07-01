import { createContext, useContext, useState, type ReactNode } from 'react'
import translations, { type Language } from '@/i18n/translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: typeof translations[Language]
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('vp_lang')
    return (stored === 'ta' || stored === 'en') ? stored : 'en'
  })

  const setLang = (newLang: Language) => {
    localStorage.setItem('vp_lang', newLang)
    setLangState(newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
