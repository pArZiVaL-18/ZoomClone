import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";

import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextField, IconButton, Tooltip, Avatar } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LinkIcon from "@mui/icons-material/Link";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import "./home.css";
import { Link } from "react-router-dom";
// import HelpAndSupport from './HelpAndSupport.jsx';

function HomeComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [meetingCode, setMeetingCode] = useState("");
    const Username = localStorage.getItem("username");
    const { user2, addToUserHistory, logout } = useContext(AuthContext);

    const handleLogout = () => {
        // logout();
        localStorage.removeItem("token");
        navigate("/");
    };

    const navActions = [
        {
            icon: <RestoreIcon />,
            tooltip: "Meeting History",
            onClick: () => navigate("/history"),
            path: "/history",
        },
        {
            icon: <HelpOutlineIcon />,
            tooltip: "Help & Support",
            onClick: () => navigate("/support"),
            path: "/support",
        },
    ];

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            const startTime = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            const type = "incoming";
            await addToUserHistory(meetingCode, startTime, type);
            localStorage.setItem("meetCode", meetingCode);
            navigate(`/${meetingCode}`);
        }
    };

    const handleNewMeeting = async () => {
        const startTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const randomId = uuidv4();
        const type = "outgoing";
        await addToUserHistory(randomId, startTime, type);
        localStorage.setItem("meetCode", randomId);
        navigate(`/${randomId}`, { state: { randomId } });
    };

    return (
        <div className="meetPage">
            <nav className="navBar">
                <div className="logoContainer">
                    <div className="logo">
                        <img src="/image.png" alt="Logo" />
                        <h1>ROVAMS Connect</h1>
                        {/* <span>Video Collaboration Platform</span> */}
                    </div>
                </div>

                <div className="userControls">
                    <div className="navbarActions">
                        {navActions.map((action) => (
                            <Tooltip
                                key={action.tooltip}
                                title={action.tooltip}
                            >
                                <div
                                    className={`navActionButton ${
                                        location.pathname === action.path
                                            ? "activeAction"
                                            : ""
                                    }`}
                                    onClick={action.onClick}
                                >
                                    {action.icon}
                                </div>
                            </Tooltip>
                        ))}
                    </div>

                    <div className="navProfile">
                        <Avatar
                            alt={"User"}
                            src={user2?.avatar}
                            sx={{ width: 36, height: 36 }}
                        />
                        <span>{Username || "User"}</span>
                    </div>

                    <Tooltip title="Logout">
                        <IconButton color="primary" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </nav>

            <div className="mainContent">
                <div className="leftContent">
                    <h1>Seamless Video Meetings, Anywhere</h1>
                    <p>
                        Connect, collaborate, and celebrate with ROVAMS Connect
                        - bringing teams and loved ones together with a single
                        click.
                    </p>

                    <div className="actionButtons">
                        <Button
                            variant="contained"
                            startIcon={<VideoCallIcon />}
                            className="newMeetingBtn"
                            onClick={handleNewMeeting}
                        >
                            Start New Meeting
                        </Button>

                        <div className="joinSection">
                            <TextField
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                                placeholder="Enter meeting code or link"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <LinkIcon
                                            color="action"
                                            style={{ marginRight: "8px" }}
                                        />
                                    ),
                                }}
                            />
                            <Button
                                onClick={handleJoinVideoCall}
                                disabled={!meetingCode.trim()}
                                className="joinBtn"
                            >
                                Join
                            </Button>
                        </div>
                    </div>

                    <div className="learnMoreSection">
                        <Link to="/learn-more">
                            Learn more about ROVAMS Connect
                        </Link>
                    </div>
                </div>

                <div className="rightContent">
                    <div className="infoCard">
                        <h2>Create Instant Meeting Links</h2>
                        <p>
                            Click <strong>Start New Meeting</strong> to generate
                            a unique link you can instantly share with your team
                            or friends.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent);
