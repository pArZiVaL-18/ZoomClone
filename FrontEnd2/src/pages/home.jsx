// import React, { useContext, useState } from "react";
// import withAuth from "../utils/withAuth";
// import { useNavigate } from "react-router-dom";
// import "../App.css";
// import { Button, TextField } from "@mui/material";
// import RestoreIcon from "@mui/icons-material/Restore";
// import VideoCallIcon from "@mui/icons-material/VideoCall";
// import LinkIcon from "@mui/icons-material/Link";
// import { AuthContext } from "../contexts/AuthContext";
// import { v4 as uuidv4 } from "uuid";
// import "./home.css";

// function HomeComponent() {
//     let navigate = useNavigate();
//     const [meetingCode, setMeetingCode] = useState("");

//     const { addToUserHistory } = useContext(AuthContext);

//     let handleJoinVideoCall = async () => {
//         if (meetingCode.trim()) {
//             const startTime = new Date().toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//             }); // Capture start time
//             await addToUserHistory(meetingCode, startTime);
//             navigate(`/${meetingCode}`);
//         }
//     };

//     const handleNewMeeting = async () => {
//         const startTime = new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//         }); // Capture start time

//         const randomId = uuidv4(); // Generates a unique ID
//         console.log(randomId);
//         await addToUserHistory(randomId, startTime);
//         navigate(`/${randomId}`, { state: { randomId } });
//     };

//     return (
//         <div className="meetPage">
//             <div className="navBar">
//                 <div className="logoSection">
//                     {/* <img src="/logo3.png" alt="ROVAMS Connect" height="24" /> */}
//                     <h2>ROVAMS Connect</h2>
//                 </div>

//                 <div className="userControls">
//                     <div
//                         className="historyButton"
//                         onClick={() => navigate("/history")}
//                     >
//                         <RestoreIcon />
//                         <span>History</span>
//                     </div>

//                     <Button
//                         variant="outlined"
//                         onClick={() => {
//                             localStorage.removeItem("token");
//                             navigate("/");
//                         }}
//                     >
//                         Logout
//                     </Button>
//                 </div>
//             </div>

//             <div className="mainContent">
//                 <div className="leftContent">
//                     <h1>Video calls and meetings for everyone</h1>
//                     <p>
//                         Connect, collaborate, and celebrate from anywhere with
//                         ROVAMS Connect
//                     </p>

//                     <div className="actionButtons">
//                         <Button
//                             variant="contained"
//                             startIcon={<VideoCallIcon />}
//                             className="newMeetingBtn"
//                             onClick={handleNewMeeting}
//                         >
//                             New meeting
//                         </Button>

//                         <div className="joinSection">
//                             <TextField
//                                 value={meetingCode}
//                                 onChange={(e) => setMeetingCode(e.target.value)}
//                                 placeholder="Enter a code or link"
//                                 variant="outlined"
//                                 fullWidth
//                                 InputProps={{
//                                     startAdornment: (
//                                         <LinkIcon
//                                             color="action"
//                                             style={{ marginRight: "8px" }}
//                                         />
//                                     ),
//                                 }}
//                             />
//                             <Button
//                                 onClick={handleJoinVideoCall}
//                                 disabled={!meetingCode.trim()}
//                                 className="joinBtn"
//                             >
//                                 Join
//                             </Button>
//                         </div>
//                     </div>

//                     <div className="learnMoreSection">
//                         <a href="#">Learn more</a> about ROVAMS Connect
//                     </div>
//                 </div>

//                 <div className="rightContent">
//                     <div className="infoCard">
//                         <h2>Get a link you can share</h2>
//                         <p>
//                             Click <strong>New meeting</strong> to get a link you
//                             can send to people you want to meet with
//                         </p>
//                         <div className="pagination">
//                             {/* <span className="activeDot">•</span>
//                             <span className="dot">•</span>
//                             <span className="dot">•</span> */}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default withAuth(HomeComponent);

import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    Button, 
    TextField, 
    IconButton, 
    Tooltip,
    Avatar
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LinkIcon from "@mui/icons-material/Link";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import "./home.css";

function HomeComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [meetingCode, setMeetingCode] = useState("");

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
            path: "/history"
        },
        {
            icon: <HelpOutlineIcon />,
            tooltip: "Help & Support",
            onClick: () => navigate("/home"),
            path: "/support"
        }
    ];

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            const startTime = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            await addToUserHistory(meetingCode, startTime);
            navigate(`/${meetingCode}`);
        }
    };

    const handleNewMeeting = async () => {
        const startTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const randomId = uuidv4();
        await addToUserHistory(randomId, startTime);
        navigate(`/${randomId}`, { state: { randomId } });
    };

    return (
        <div className="meetPage">
                        <nav className="navBar">
                <div className="logoContainer">
                    <div className="logoSection">
                        <h2>ROVAMS Connect</h2>
                        <span>Video Collaboration Platform</span>
                    </div>
                </div>

                <div className="userControls">
                    <div className="navbarActions">
                        {navActions.map((action) => (
                            <Tooltip key={action.tooltip} title={action.tooltip}>
                                <div 
                                    className={`navActionButton ${
                                        location.pathname === action.path 
                                            ? 'activeAction' 
                                            : ''
                                    }`}
                                    onClick={action.onClick}
                                >
                                    {action.icon}
                                </div>
                            </Tooltip>
                        ))}
                    </div>

                    <div className="navProfile" onClick={() => navigate("/user")}>
                        <Avatar 
                            alt={user2?.name || "User"} 
                            src={user2?.avatar} 
                            sx={{ width: 36, height: 36 }}
                        />
                        <span>{user2?.name || "User"}</span>
                    </div>

                    <Tooltip title="Logout">
                        <IconButton 
                            color="primary" 
                            onClick={handleLogout}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </nav>

            <div className="mainContent">
                <div className="leftContent">
                    <h1>Seamless Video Meetings, Anywhere</h1>
                    <p>
                        Connect, collaborate, and celebrate with ROVAMS Connect - 
                        bringing teams and loved ones together with a single click.
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
                        <a href="#">Learn more about ROVAMS Connect</a>
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
