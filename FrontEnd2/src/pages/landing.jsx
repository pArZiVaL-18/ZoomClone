import React from "react";
import { useNavigate } from "react-router";
import "./LandingPage.css";

export default function LandingPage() {
    const navigate = useNavigate();

    const services = [
        {
            icon: "video-conference",
            title: "Video Conferencing",
            description:
                "High-quality video meetings with advanced features, supporting up to 100 participants with crystal-clear audio and adaptive screen sharing.",
            features: [
                "HD Video Quality",
                "Group Meetings",
                "Screen Sharing",
                "Virtual Backgrounds",
            ],
        },
        {
            icon: "collaboration",
            title: "Team Collaboration",
            description:
                "Seamless collaboration tools that transform remote work, including real-time document editing and integrated project management.",
            features: [
                "Shared Workspaces",
                "Real-time Editing",
                "Task Management",
                "File Sharing",
            ],
        },
        {
            icon: "security",
            title: "Enterprise Security",
            description:
                "Advanced security protocols ensuring your communication remains private, secure, and compliant with global standards.",
            features: [
                "End-to-End Encryption",
                "Multi-Factor Authentication",
                "Compliance Reporting",
                "Secure Data Storage",
            ],
        },
        {
            icon: "analytics",
            title: "Meeting Intelligence",
            description:
                "Comprehensive analytics and insights to measure meeting effectiveness, participant engagement, and team productivity.",
            features: [
                "Participation Tracking",
                "Performance Metrics",
                "Engagement Scoring",
                "Customizable Reports",
            ],
        },
    ];

    return (
        <div className="landing-container">
            <div className="landing-inner">
                <header className="landing-header">
                    <div className="logo">
                        <img src="/image.png" alt="Logo" />
                        <h1>ROVAMS</h1>
                    </div>

                    <nav className="nav-menu">
                        <ul>
                            <li>
                                <a href="#home">Home</a>
                            </li>
                            <li>
                                <a href="#about">About us</a>
                            </li>
                            <li>
                                <a href="#services">Services</a>
                            </li>
                            {/* <li>
                                <a href="#blog">Blog</a>
                            </li> */}
                        </ul>
                    </nav>

                    <div className="authButtons">
                        <button
                            className="sign-up-btn"
                            onClick={() => navigate("/auth")}
                        >
                            Register
                        </button>
                        <button
                            className="sign-up-btn"
                            onClick={() => navigate("/auth")}
                        >
                            Login
                        </button>
                    </div>
                </header>

                <main className="landing-content" id="home">
                    <div className="content-left">
                        <h2>
                            VIRTUAL <span>MEETINGS</span>
                        </h2>
                        <p className="subtitle">
                            Connect with your team anytime, anywhere with our
                            secure video conferencing platform
                        </p>
                        <p className="description">
                            Experience crystal-clear video, screen sharing, and
                            collaborative tools that make remote meetings feel
                            like you're in the same room.
                        </p>

                        <button
                            className="cta-button"
                            onClick={() => navigate("/meeting")}
                        >
                            Join as guest
                        </button>
                    </div>

                    <div className="content-right">
                        <div className="illustration">
                            <img
                                src="/home.jpg"
                                alt="Virtual meeting illustration"
                            />
                        </div>
                    </div>
                </main>

                {/* About Us Section */}
                <section className="about-us-section" id="about">
                    <div className="section-container">
                        <h2 className="section-title">
                            About <span>ROVAMS</span>
                        </h2>
                        <div className="about-content">
                            <div className="about-image">
                                <img
                                    src="/back.jpg"
                                    alt="ROVAMS Team"
                                    className="team-image"
                                />
                            </div>
                            <div className="about-details">
                                <div className="about-description">
                                    <h3>Who We Are</h3>
                                    <p>
                                        ROVAMS is a pioneering virtual
                                        communication platform dedicated to
                                        transforming how teams connect and
                                        collaborate across distances. We believe
                                        that geographical boundaries should
                                        never limit professional interaction.
                                    </p>
                                </div>
                                <div className="about-core-values">
                                    <h3>Our Core Values</h3>
                                    <ul>
                                        <li>
                                            <strong>Innovation:</strong>{" "}
                                            Continuously pushing the boundaries
                                            of virtual communication technology
                                        </li>
                                        <li>
                                            <strong>Security:</strong> Ensuring
                                            top-tier protection for every
                                            interaction
                                        </li>
                                        <li>
                                            <strong>Accessibility:</strong>{" "}
                                            Making professional connections
                                            seamless and intuitive
                                        </li>
                                    </ul>
                                </div>
                                <div className="about-mission">
                                    <h3>Our Mission</h3>
                                    <p>
                                        To empower global teams with
                                        cutting-edge communication tools that
                                        bridge distances, foster collaboration,
                                        and enhance productivity.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="services-section" id="services">
                    <div className="section-container">
                        <h2 className="section-title">
                            Our <span>Services</span>
                        </h2>
                        <div className="services-grid">
                            {services.map((service, index) => (
                                <div key={index} className="service-card">
                                    <div className="service-icon">
                                        <div
                                            className={`icon ${service.icon}`}
                                        ></div>
                                    </div>
                                    <h3>{service.title}</h3>
                                    <p className="service-description">
                                        {service.description}
                                    </p>
                                    <div className="service-features">
                                        <h4>Key Features:</h4>
                                        <ul>
                                            {service.features.map(
                                                (feature, featureIndex) => (
                                                    <li key={featureIndex}>
                                                        {feature}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    {/* <a href="#" className="service-learn-more">
                                        Learn More
                                    </a> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
