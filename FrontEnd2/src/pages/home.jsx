// import React, { useContext, useState } from "react";
// import withAuth from "../utils/withAuth";
// import { useNavigate } from "react-router-dom";
// import "../App.css";
// import { Button, IconButton, TextField } from "@mui/material";
// import RestoreIcon from "@mui/icons-material/Restore";
// import { AuthContext } from "../contexts/AuthContext";
// import { v4 as uuidv4 } from "uuid";

// function HomeComponent() {
//     let navigate = useNavigate();
//     const [meetingCode, setMeetingCode] = useState("");

//     const { addToUserHistory } = useContext(AuthContext);
//     let handleJoinVideoCall = async () => {
//         await addToUserHistory(meetingCode);
//         navigate(`/${meetingCode}`);
//     };
//     const handleNewMeeting = async () => {
//         // await addToUserHistory(meetingCode);
//         const randomId = uuidv4(); // Generates a unique ID
//         console.log(randomId);
//         navigate(`/${randomId}`, { state: { randomId } });
//     };
//     return (
//         <>
//             <div className="navBar">
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                     <h2>ROVAMS Connect</h2>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center" }}>
//                     <IconButton
//                         onClick={() => {
//                             navigate("/history");
//                         }}
//                     >
//                         <RestoreIcon />
//                     </IconButton>
//                     <p>History</p>

//                     <Button
//                         onClick={() => {
//                             localStorage.removeItem("token");
//                             navigate("/auth");
//                         }}
//                     >
//                         Logout
//                     </Button>
//                 </div>
//             </div>

//             <div className="meetContainer">
//                 <div className="leftPanel">
//                     <div>
//                         <h2>Providing Quality Video Call For FREE!!!</h2>

//                         <div style={{ display: "flex", gap: "10px" }}>
//                             <TextField
//                                 onChange={(e) => setMeetingCode(e.target.value)}
//                                 id="outlined-basic"
//                                 label="Meeting Code"
//                                 variant="outlined"
//                             />
//                             <Button
//                                 onClick={handleJoinVideoCall}
//                                 variant="contained"
//                             >
//                                 Join
//                             </Button>

//                             <Button
//                                 onClick={handleNewMeeting}
//                                 variant="contained"
//                             >
//                                 New Meet
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="rightPanel">
//                     <img srcSet="/logo3.png" alt="" />
//                 </div>
//             </div>
//         </>
//     );
// }

// export default withAuth(HomeComponent);

import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LinkIcon from "@mui/icons-material/Link";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    };

    // let handleNewMeeting = async () => {
    //     // Generate a random meeting code
    //     const randomCode = Math.random().toString(36).substring(2, 8);
    //     await addToUserHistory(randomCode);
    //     navigate(`/${randomCode}`);
    // };

    const handleNewMeeting = async () => {
        // await addToUserHistory(meetingCode);
        const randomId = uuidv4(); // Generates a unique ID
        console.log(randomId);
        navigate(`/${randomId}`, { state: { randomId } });
    };

    return (
        <div className="meetPage">
            <div className="navBar">
                <div className="logoSection">
                    {/* <img src="/logo3.png" alt="ROVAMS Connect" height="24" /> */}
                    <h2>ROVAMS Connect</h2>
                </div>

                <div className="userControls">
                    <div
                        className="historyButton"
                        onClick={() => navigate("/history")}
                    >
                        <RestoreIcon />
                        <span>History</span>
                    </div>

                    <Button
                        variant="outlined"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="mainContent">
                <div className="leftContent">
                    <h1>Video calls and meetings for everyone</h1>
                    <p>
                        Connect, collaborate, and celebrate from anywhere with
                        ROVAMS Connect
                    </p>

                    <div className="actionButtons">
                        <Button
                            variant="contained"
                            startIcon={<VideoCallIcon />}
                            className="newMeetingBtn"
                            onClick={handleNewMeeting}
                        >
                            New meeting
                        </Button>

                        <div className="joinSection">
                            <TextField
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                                placeholder="Enter a code or link"
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
                        <a href="#">Learn more</a> about ROVAMS Connect
                    </div>
                </div>

                <div className="rightContent">
                    <div className="infoCard">
                        <h2>Get a link you can share</h2>
                        <p>
                            Click <strong>New meeting</strong> to get a link you
                            can send to people you want to meet with
                        </p>
                        <div className="pagination">
                            {/* <span className="activeDot">•</span>
                            <span className="dot">•</span>
                            <span className="dot">•</span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent);
