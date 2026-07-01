import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  )
}
