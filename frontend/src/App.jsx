import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing  from './pages/Landing'
import Upload   from './pages/Upload'
import Predict  from './pages/Predict'
import Claim    from './pages/Claim'
import Bridge   from './pages/Bridge'
import Chatbot  from './components/Chatbot'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                 element={<Landing />} />
        <Route path="/upload"           element={<Upload />} />
        <Route path="/check-insurance"  element={<Upload />} />
        <Route path="/predict"          element={<Predict />} />
        <Route path="/claim"            element={<Claim />} />
        <Route path="/check-claim"      element={<Claim />} />
        <Route path="/bridge"           element={<Bridge />} />
      </Routes>
      <Footer />
      {/* Dynamic Context-Aware Sarvam AI Chatbot */}
      <Chatbot />
    </BrowserRouter>
  )
}
