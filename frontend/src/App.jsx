import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import LandingPage from './LandingPage'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import './index.css'

function App() {
  const [content, setContent] = useState(null)

  const fetchContent = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/content`)
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error("Could not load content", err))
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage content={content} />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard content={content} refreshContent={fetchContent} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
