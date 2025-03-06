import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import Authentication from "./pages/Authentication.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import HomeComponent from "./pages/home.jsx";
import History from "./pages/history.jsx";
import VideoMeetComponent from "./pages/VideoMeet.jsx";

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />

                        <Route path="/auth" element={<Authentication />} />

                        <Route path="/home" element={<HomeComponent />} />

                        <Route path="/history" element={<History />} />

                        <Route path="/:url" element={<VideoMeetComponent />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
