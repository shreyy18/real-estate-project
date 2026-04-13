import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Droplets, Move, Users, CheckCircle, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react'

// Icon mapping helper
const IconComponents = {
    Gym: Dumbbell,
    Pool: Droplets,
    Jogging: Move,
    Yoga: Users,
    Park: CheckCircle,
    Default: CheckCircle
}

export default function LandingPage({ content }) {
    const [faqOpen, setFaqOpen] = useState(null)

    if (!content) return <div className="loading">Loading amazing properties...</div>

    return (
        <div className="landing-page">
            {/* HEADER */}
            <header className="header">
                <div className="logo-container">
                    <div className="logo-icon"></div>
                </div>
                <nav className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About us</a>
                    <a href="#amenities">Amenities</a>
                    <a href="#floor-plans">Floor Plans</a>
                    <a href="#contact">Developer</a>
                    <a href="#location">Location</a>
                </nav>
                <button className="enquiry-btn">Enquiry Now</button>
            </header>

            {/* HERO SECTION */}
            <section id="home" className="hero-section">
                <div className="hero-left">
                    <div className="hero-buildings-img"></div>
                </div>
                <div className="hero-right">
                    <h3 className="hero-subtitle">{content.hero.subtitle}</h3>
                    <h1 className="hero-title">{content.hero.title}</h1>
                    <div className="hero-divider"></div>
                    <div className="price-tags">
                        {content.hero.priceTags?.map((tag, i) => (
                            <div key={i} className="price-tag-card">
                                <div className="tag-type">{tag.type}</div>
                                <div className="tag-price-strike">₹ 84.99 Lacs*</div>
                                <div className="tag-price">{tag.price}</div>
                                <div className="tag-desc">All Inclusive</div>
                            </div>
                        ))}
                    </div>
                    <p className="location-pin">📍 {content.hero.location}</p>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="about-section">
                <div className="about-images">
                    <div className="circle-img img1"></div>
                    <div className="circle-img img2"></div>
                    <div className="circle-img img3"></div>
                </div>
                <div className="about-text">
                    <h2 className="section-title">{content.about.title}</h2>
                    {content.about.paragraphs?.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                    <button className="btn-primary">Download Brochure</button>
                </div>
            </section>

            {/* AMENITIES SECTION */}
            <section id="amenities" className="amenities-section">
                <h2 className="section-title text-center">Amenities</h2>
                <div className="amenities-grid">
                    {content.amenities?.map((am, i) => {
                        const Icon = IconComponents[am.icon] || IconComponents.Default
                        return (
                            <div key={i} className="amenity-card">
                                <div className="icon-wrapper">
                                    <Icon size={32} strokeWidth={1.5} className="amenity-icon" />
                                </div>
                                <h3>{am.title}</h3>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* EXPLORE BUILDINGS SECTION */}
            <section className="buildings-section">
                <h2 className="section-title text-center" style={{ color: 'white' }}>Explore More Buildings in the Township</h2>
                <div className="buildings-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="building-card">
                            <div className="b-img-rect"></div>
                            <div className="b-info-strip">Newly Launched - Signature Enclave</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FLOOR PLAN SECTION */}
            <section id="floor-plans" className="floor-plan-section">
                <div className="floor-plan-container">
                    <div className="fp-left">
                        <div className="fp-image"></div>
                        <div className="city-view">
                            <PlayCircle size={48} className="play-icon" />
                        </div>
                    </div>
                    <div className="fp-right">
                        <div className="fp-tabs">
                            <button className="fp-tab active">1 BHK</button>
                            <button className="fp-tab">2 BHK</button>
                            <button className="fp-tab">3 BHK</button>
                        </div>
                        <div className="fp-details">
                            <p>Type: <strong>1BHK</strong></p>
                            <p>Area: <strong>268 Sq. Ft. /24.9 Sq. Mtr.</strong></p>
                            <button className="btn-primary mt-4">Download Floor Plan</button>
                        </div>
                        <div className="fp-mini-grid">
                            <div className="fp-mini"></div>
                            <div className="fp-mini"></div>
                            <div className="fp-mini"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT DEVELOPER & CONSTRUCTION UPDATES & FAQ */}
            <section id="contact" className="bottom-section">
                <div className="developer-stats">
                    <h2 className="section-title text-center">About Developer</h2>
                    <p className="text-center dev-desc">A legacy of excellence since years, delivering dream homes with perfection.</p>
                    <div className="stats-grid">
                        <div className="stat-item"><h2>8</h2><p>CR+ SQ. FT. DELIVERED</p></div>
                        <div className="stat-item"><h2>1 LAKH+</h2><p>HAPPY FAMILIES</p></div>
                        <div className="stat-item"><h2>240+</h2><p>PROJECTS COMPLETED</p></div>
                        <div className="stat-item"><h2>3 DECADES</h2><p>OF EXPERTISE</p></div>
                    </div>
                    <div className="dev-buildings">
                        <div className="dev-b-img"></div>
                        <div className="dev-b-img"></div>
                        <div className="dev-b-img"></div>
                    </div>
                </div>

                <div className="construction-updates">
                    <h2 className="section-title text-center">Construction Updates</h2>
                    <div className="cu-grid">
                        {content.constructionUpdates?.map((cu, i) => {
                            const fallbackImages = [
                                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", // working building photo
                                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400"  // working construction photo
                            ];
                            return (
                                <div key={i} className="cu-card">
                                    <div className="cu-img" style={{ backgroundImage: `url(${cu.image || fallbackImages[i % 2]})` }}></div>
                                    <div className="cu-label">{cu.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="faq-section">
                    <h2 className="section-title text-center">Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {content.faq?.map((item, i) => (
                            <div key={i} className="faq-item">
                                <button className="faq-question" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                                    {item.question}
                                    {faqOpen === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {faqOpen === i && <div className="faq-answer">{item.answer}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer-bar">
                <p>© 2026 Infinity Realtors. All rights reserved.</p>
                <Link to="/admin" className="admin-link">Admin Login</Link>
            </footer>
        </div>
    )
}
