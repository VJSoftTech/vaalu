import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes'
import { Toaster } from '@/components/ui/toaster'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  )
}
