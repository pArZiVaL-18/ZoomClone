import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import Authentication from "./pages/Authentication.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import HomeComponent from "./pages/home.jsx";
import History from "./pages/history.jsx";
import VideoMeetComponent from "./pages/VideoMeet.jsx";
import User from "./pages/User.jsx";
import LearnMorePage from "./pages/LearnMorePage.jsx";
import HelpAndSupport from "./pages/HelpAndSupport.jsx";
import Guest from "./pages/Guest.jsx";

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />

                        <Route path="/auth" element={<Authentication />} />

                        <Route path="/user" element={<User />} />

                        <Route path="/home" element={<HomeComponent />} />

                        <Route path="/history" element={<History />} />

                        <Route path="/learn-more" element={<LearnMorePage />} />

                        <Route path="/support" element={<HelpAndSupport />} />

                        <Route path="/guest" element={<Guest />} />

                        <Route path="/:url" element={<VideoMeetComponent />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
