import React from "react";
import "./LandingPage.css";
import { Link, useNavigate } from "react-router";

export default function LandingPage() {
    const Router = useNavigate();
    return (
        <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>ROVAMS</h2>
                </div>
                <div className="navList">
                    <p
                        onClick={() => {
                            Router("/asdflkj4356211");
                        }}
                    >
                        Join as guest
                    </p>
                    <p
                        onClick={() => {
                            Router("/auth");
                        }}
                    >
                        Register
                    </p>
                    <div
                        onClick={() => {
                            Router("/auth");
                        }}
                        role="button"
                    >
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div>
                    <h1>
                        <span style={{ color: "#FF9839" }}>Connect</span> With
                        your Loved Ones
                    </h1>
                    <p>Cover a distance by ROVAMS</p>
                    <div role="button">
                        <Link to={"/auth"}>Get started</Link>
                    </div>
                </div>
                <div>
                    <img src="/mobile.png" alt="mobile image" />
                </div>
            </div>
        </div>
    );
}
