import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import DownloadIcon from "@mui/icons-material/Download";
import "./LearnMorePage.css";

const LearnMorePage = () => {
    const navigate = useNavigate();

    return (
        <div className="learn-more-page">
            <div className="back-button-container">
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    className="back-button"
                    onClick={() => navigate("/home")}
                >
                    Back to Home
                </Button>
            </div>
            {/* 
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover ROVAMS Connect</h1>
          <p className="hero-subtitle">The next-generation video collaboration platform</p>
        </div>
      </section> */}

            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose ROVAMS Connect?</h2>
                    <p className="section-subtitle">
                        Premium features for seamless collaboration
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎥</div>
                        <h3>HD Video & Audio</h3>
                        <p>
                            Crystal clear quality with adaptive bandwidth
                            optimization for any connection speed.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>End-to-End Encryption</h3>
                        <p>
                            Military-grade security protecting your meetings
                            from unauthorized access.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Advanced Screen Sharing</h3>
                        <p>
                            Share your entire desktop, specific applications, or
                            just a browser tab.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Virtual Backgrounds</h3>
                        <p>
                            Professional backgrounds or blur effects to maintain
                            privacy.
                        </p>
                    </div>

                    {/* <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Breakout Rooms</h3>
            <p>Divide large meetings into smaller groups for focused discussions.</p>
          </div> */}

                    {/* <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Interactive Whiteboard</h3>
            <p>Real-time collaboration with drawing tools and sticky notes.</p>
          </div> */}
                </div>
            </section>

            <section className="how-it-works">
                <div className="section-header">
                    <h2>How ROVAMS Connect Works</h2>
                    <p className="section-subtitle">
                        Get started in just three simple steps
                    </p>
                </div>

                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Start or Join</h3>
                        <p>
                            Create a new meeting instantly or join with a
                            code/link in seconds.
                        </p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Invite Participants</h3>
                        <p>
                            Share the meeting link via email, chat, or calendar
                            invitation.
                        </p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Collaborate</h3>
                        <p>
                            Utilize video, audio, screen sharing, and other
                            powerful tools.
                        </p>
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <div className="section-header">
                    <h2>Trusted by Teams Worldwide</h2>
                    <p className="section-subtitle">
                        What our users say about us
                    </p>
                </div>

                <div className="testimonial-cards">
                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "ROVAMS Connect has transformed our remote team
                            collaboration. The video quality is exceptional and
                            the breakout rooms feature has made our workshops
                            much more effective."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-name">Pranav Jakhale</div>
                            <div className="author-title">
                                Team Lead, TechCorp Sangli
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <p className="testimonial-text">
                            "I use it for both client meetings and family
                            gatherings. The intuitive interface means even my
                            less tech-savvy relatives can join without issues."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-name">Vaibhav Gadhave</div>
                            <div className="author-title">
                                Freelance Designer , Wai
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Ready to Elevate Your Video Meetings?</h2>
                <p className="cta-subtitle">
                    Join thousands of satisfied users today
                </p>

                <div className="cta-buttons">
                    {/* <Button
            variant="contained"
            startIcon={<VideoCallIcon />}
            className="cta-button primary"
            onClick={() => navigate('/home')}
          >
            Start Free Meeting
          </Button> */}

                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        className="cta-button secondary"
                    >
                        Download Desktop App
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default LearnMorePage;
