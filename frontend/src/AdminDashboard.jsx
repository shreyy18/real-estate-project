import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard({ content, refreshContent }) {
    const [activeTab, setActiveTab] = useState('hero')
    const [formData, setFormData] = useState({})
    const [statusMsg, setStatusMsg] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/admin')
            return
        }
        if (content && content[activeTab]) {
            setFormData(content[activeTab])
        }
    }, [content, activeTab, navigate])

    const handleSave = async () => {
        setStatusMsg('Saving...')
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('adminToken'),
                    section_key: activeTab,
                    content_value: formData
                })
            })
            if (res.ok) {
                setStatusMsg('Saved successfully!')
                refreshContent()
                setTimeout(() => setStatusMsg(''), 3000)
            } else {
                setStatusMsg('Failed to save')
            }
        } catch (err) {
            setStatusMsg('Error connecting to server')
        }
    }

    const handleNestedChange = (index, field, value, arrayName = 'paragraphs') => {
        const newArr = [...formData[arrayName]]
        if (typeof newArr[index] === 'object') {
            newArr[index] = { ...newArr[index], [field]: value }
        } else {
            newArr[index] = value
        }
        setFormData({ ...formData, [arrayName]: newArr })
    }

    if (!content) return <div>Loading Admin...</div>

    return (
        <div className="admin-container">
            <div className="header" style={{ borderRadius: 20, marginBottom: 30 }}>
                <div className="logo">INFINITY - ADMIN PANEL</div>
                <button className="cta-btn" onClick={() => {
                    localStorage.removeItem('adminToken')
                    navigate('/admin')
                }}>Logout</button>
            </div>

            <div className="dashboard-grid">
                <div className="sidebar">
                    {['hero', 'about', 'amenities', 'constructionUpdates', 'faq'].map(tab => (
                        <button
                            key={tab}
                            className={activeTab === tab ? 'active' : ''}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} Section
                        </button>
                    ))}
                    <button style={{ marginTop: 30 }} onClick={() => navigate('/')}>View Live Site</button>
                </div>

                <div className="editor-panel">
                    <h2 className="section-title">Edit {activeTab}</h2>
                    <div className="divider"></div>

                    {activeTab === 'hero' && formData.title && (
                        <>
                            <div className="form-group">
                                <label>Title</label>
                                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Subtitle</label>
                                <input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <label>Prices</label>
                            {formData.priceTags?.map((tag, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 15 }}>
                                    <input value={tag.type} onChange={e => handleNestedChange(i, 'type', e.target.value, 'priceTags')} placeholder="Type" />
                                    <input value={tag.price} onChange={e => handleNestedChange(i, 'price', e.target.value, 'priceTags')} placeholder="Price" />
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'about' && formData.title && (
                        <>
                            <div className="form-group">
                                <label>Title</label>
                                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Paragraphs</label>
                                {formData.paragraphs?.map((p, i) => (
                                    <textarea key={i} value={p} onChange={e => handleNestedChange(i, null, e.target.value, 'paragraphs')} style={{ marginBottom: 15 }} />
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'amenities' && formData.length > 0 && (
                        <>
                            <label>Amenities Items</label>
                            {formData.map((am, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, width: '100%', marginBottom: 15 }}>
                                    <input value={am.icon} onChange={e => handleNestedChange(i, 'icon', e.target.value, null)} placeholder="Icon Name" style={{ width: '30%' }} />
                                    <input value={am.title} onChange={e => handleNestedChange(i, 'title', e.target.value, null)} placeholder="Amenity Title" style={{ width: '70%' }} />
                                </div>
                            ))}
                            <small>Valid icons: Gym, Pool, Jogging, Yoga, Park</small>
                            <br /><br />
                        </>
                    )}

                    {(activeTab === 'constructionUpdates' || activeTab === 'faq') && formData.length >= 0 && (
                        <div>
                            <p>Arrays structured editing for these sections will be fully supported. Currently managing through direct basic texts based on image.</p>
                            {/* Simplified array editor for FAQ */}
                            {activeTab === 'faq' && formData.map((item, i) => (
                                <div key={i} style={{ marginBottom: 20 }}>
                                    <input value={item.question} onChange={e => handleNestedChange(i, 'question', e.target.value, null)} placeholder="Q" style={{ width: '100%', marginBottom: 10, padding: 10 }} />
                                    <input value={item.answer} onChange={e => handleNestedChange(i, 'answer', e.target.value, null)} placeholder="A" style={{ width: '100%', padding: 10 }} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 20 }}>
                        <button className="save-btn" onClick={handleSave}>Save Changes</button>
                        {statusMsg && <span style={{ color: statusMsg.includes('Error') || statusMsg.includes('Failed') ? 'red' : 'green', fontWeight: 'bold' }}>{statusMsg}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}
