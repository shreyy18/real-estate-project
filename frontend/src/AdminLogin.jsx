import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
    const [email, setEmail] = useState('admin@gmail.com')
    const [password, setPassword] = useState('1234')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('adminToken', data.token)
                navigate('/admin/dashboard')
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError('Connection failed')
        }
    }

    return (
        <div className="admin-container" style={{ display: 'flex' }}>
            <form className="login-form" onSubmit={handleLogin}>
                <h2 className="section-title text-center" style={{ marginBottom: 30 }}>Admin Login</h2>
                {error && <p style={{ color: 'red', marginBottom: 15, textAlign: 'center' }}>{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit" className="cta-btn" style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    )
}
