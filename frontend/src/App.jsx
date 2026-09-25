import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
import Landing       from './pages/Landing'
import Upload        from './pages/Upload'
import Predict       from './pages/Predict'
import Claim         from './pages/Claim'
import Bridge        from './pages/Bridge'
import PaytmMobile   from './pages/PaytmMobile'
import Chatbot       from './components/Chatbot'

function AppLayout() {
  const location = useLocation()
  const isMobile = location.pathname === '/mobile'

  return (
    <>
      {!isMobile && <Navbar />}
      <Routes>
        <Route path="/"                element={<Landing />} />
        <Route path="/upload"          element={<Upload />} />
        <Route path="/check-insurance" element={<Upload />} />
        <Route path="/predict"         element={<Predict />} />
        <Route path="/claim"           element={<Claim />} />
        <Route path="/check-claim"     element={<Claim />} />
        <Route path="/bridge"          element={<Bridge />} />
        <Route path="/mobile"          element={<PaytmMobile />} />
      </Routes>
      {!isMobile && <Footer />}
      {!isMobile && <Chatbot />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
