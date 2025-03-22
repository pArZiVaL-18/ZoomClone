// import React from "react";
// import "./LandingPage.css";
// import { Link, useNavigate } from "react-router";

// export default function LandingPage() {
//     const Router = useNavigate();
//     return (
//         <div className="landingPageContainer">
//             <nav>
//                 <div className="navHeader">
//                     <h2>ROVAMS</h2>
//                 </div>
//                 <div className="navList">
//                     <p
//                         onClick={() => {
//                             Router("/asdflkj4356211");
//                         }}
//                     >
//                         Join as guest
//                     </p>
//                     <p
//                         onClick={() => {
//                             Router("/auth");
//                         }}
//                     >
//                         Register
//                     </p>
//                     <div
//                         onClick={() => {
//                             Router("/auth");
//                         }}
//                         role="button"
//                     >
//                         <p>Login</p>
//                     </div>
//                 </div>
//             </nav>

//             <div className="landingMainContainer">
//                 <div>
//                     <h1>
//                         <span style={{ color: "#FF9839" }}>Connect</span> With
//                         your Loved Ones
//                     </h1>
//                     <p>Cover a distance by ROVAMS</p>
//                     <div role="button">
//                         <Link to={"/auth"}>Get started</Link>
//                     </div>
//                 </div>
//                 <div>
//                     <img src="/mobile.png" alt="mobile image" />
//                 </div>
//             </div>
//         </div>
//     );
// }

import React from "react";
import { useNavigate } from "react-router";
import "./LandingPage.css";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-inner">
                <header className="landing-header">
                    <div className="logo">
                        <img src="/logo.jpg" alt="Logo" />
                        <h1>ROVAMS</h1>
                    </div>

                    <nav className="nav-menu">
                        <ul>
                            <li>
                                <a href="#">Home</a>
                            </li>
                            <li>
                                <a href="#">About us</a>
                            </li>
                            <li>
                                <a href="#">Services</a>
                            </li>
                            <li>
                                <a href="#">Blog</a>
                            </li>
                        </ul>
                    </nav>

                    <button
                        className="sign-up-btn"
                        onClick={() => navigate("/auth")}
                    >
                        Sign up
                    </button>
                </header>

                <main className="landing-content">
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
                            onClick={() => navigate("/meetings")}
                        >
                            READ MORE
                        </button>
                    </div>

                    <div className="content-right">
                        <div className="illustration">
                            <img
                                src="/back.jpg"
                                alt="Virtual meeting illustration"
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
