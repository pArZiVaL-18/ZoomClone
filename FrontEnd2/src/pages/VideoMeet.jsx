// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import {
//     IconButton,
//     TextField,
//     Button,
//     Badge,
//     Tooltip,
//     Avatar,
// } from "@mui/material";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import styles from "../styles/videoComponent.module.css";
// import CallEndIcon from "@mui/icons-material/CallEnd";
// import MicIcon from "@mui/icons-material/Mic";
// import MicOffIcon from "@mui/icons-material/MicOff";
// import ScreenShareIcon from "@mui/icons-material/ScreenShare";
// import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
// import ChatIcon from "@mui/icons-material/Chat";
// // import ChatIcon from "@mui/icons-material/Chat";
// import SendIcon from "@mui/icons-material/Send";
// import server from "../enviornment";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import PopupModal from "./popUp";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// const server_url = server;

// var connections = {};

// const peerConfigConnections = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// export default function VideoMeetComponent() {
//     var socketRef = useRef();
//     let socketIdRef = useRef();
//     const chatDisplayRef = useRef();
//     let localVideoref = useRef();

//     let [videoAvailable, setVideoAvailable] = useState(true);

//     let [audioAvailable, setAudioAvailable] = useState(true);

//     let [video, setVideo] = useState([]);

//     let [audio, setAudio] = useState();

//     let [screen, setScreen] = useState();

//     let [showModal, setModal] = useState(true);

//     let [screenAvailable, setScreenAvailable] = useState();

//     let [messages, setMessages] = useState([]);

//     let [message, setMessage] = useState("");

//     let [newMessages, setNewMessages] = useState(0);

//     let [askForUsername, setAskForUsername] = useState(true);

//     let [username, setUsername] = useState("");

//     const location = useLocation();
//     const { randomId: stateRandomId } = location.state || {}; // Get from state

//     console.log("From State:", stateRandomId);

//     const videoRef = useRef([]);

//     const navigate = useNavigate();

//     let [videos, setVideos] = useState([]);

//     useEffect(() => {
//         console.log("HELLO");
//         getPermissions();
//     }, []);

//     let getDislayMedia = () => {
//         if (screen) {
//             if (navigator.mediaDevices.getDisplayMedia) {
//                 navigator.mediaDevices
//                     .getDisplayMedia({ video: true, audio: true })
//                     .then(getDislayMediaSuccess)
//                     .then((stream) => {})
//                     .catch((e) => console.log(e));
//             }
//         }
//     };

//     const getPermissions = async () => {
//         try {
//             const videoPermission = await navigator.mediaDevices.getUserMedia({
//                 video: true,
//             });
//             if (videoPermission) {
//                 setVideoAvailable(true);
//                 console.log("Video permission granted");
//             } else {
//                 setVideoAvailable(false);
//                 console.log("Video permission denied");
//             }

//             const audioPermission = await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//             });
//             if (audioPermission) {
//                 setAudioAvailable(true);
//                 console.log("Audio permission granted");
//             } else {
//                 setAudioAvailable(false);
//                 console.log("Audio permission denied");
//             }

//             if (navigator.mediaDevices.getDisplayMedia) {
//                 setScreenAvailable(true);
//             } else {
//                 setScreenAvailable(false);
//             }

//             if (videoAvailable || audioAvailable) {
//                 const userMediaStream =
//                     await navigator.mediaDevices.getUserMedia({
//                         video: videoAvailable,
//                         audio: audioAvailable,
//                     });
//                 if (userMediaStream) {
//                     window.localStream = userMediaStream;
//                     if (localVideoref.current) {
//                         localVideoref.current.srcObject = userMediaStream;
//                     }
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (video !== undefined && audio !== undefined) {
//             getUserMedia();
//             console.log("SET STATE HAS ", video, audio);
//         }
//     }, [video, audio]);
//     let getMedia = () => {
//         setVideo(videoAvailable);
//         setAudio(audioAvailable);
//         connectToSocketServer();
//     };

//     let getUserMediaSuccess = (stream) => {
//         try {
//             window.localStream.getTracks().forEach((track) => track.stop());
//         } catch (e) {
//             console.log(e);
//         }

//         window.localStream = stream;
//         localVideoref.current.srcObject = stream;

//         for (let id in connections) {
//             if (id === socketIdRef.current) continue;

//             connections[id].addStream(window.localStream);

//             connections[id].createOffer().then((description) => {
//                 console.log(description);
//                 connections[id]
//                     .setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit(
//                             "signal",
//                             id,
//                             JSON.stringify({
//                                 sdp: connections[id].localDescription,
//                             })
//                         );
//                     })
//                     .catch((e) => console.log(e));
//             });
//         }

//         stream.getTracks().forEach(
//             (track) =>
//                 (track.onended = () => {
//                     setVideo(false);
//                     setAudio(false);

//                     try {
//                         let tracks =
//                             localVideoref.current.srcObject.getTracks();
//                         tracks.forEach((track) => track.stop());
//                     } catch (e) {
//                         console.log(e);
//                     }

//                     let blackSilence = (...args) =>
//                         new MediaStream([black(...args), silence()]);
//                     window.localStream = blackSilence();
//                     localVideoref.current.srcObject = window.localStream;

//                     for (let id in connections) {
//                         connections[id].addStream(window.localStream);

//                         connections[id].createOffer().then((description) => {
//                             connections[id]
//                                 .setLocalDescription(description)
//                                 .then(() => {
//                                     socketRef.current.emit(
//                                         "signal",
//                                         id,
//                                         JSON.stringify({
//                                             sdp: connections[id]
//                                                 .localDescription,
//                                         })
//                                     );
//                                 })
//                                 .catch((e) => console.log(e));
//                         });
//                     }
//                 })
//         );
//     };

//     let getUserMedia = () => {
//         if ((video && videoAvailable) || (audio && audioAvailable)) {
//             navigator.mediaDevices
//                 .getUserMedia({ video: video, audio: audio })
//                 .then(getUserMediaSuccess)
//                 .catch((e) => console.log(e));
//         } else {
//             try {
//                 let tracks = localVideoref.current.srcObject.getTracks();
//                 tracks.forEach((track) => track.stop());
//             } catch (e) {}
//         }
//     };

//     let getDislayMediaSuccess = (stream) => {
//         console.log("HERE");
//         try {
//             window.localStream.getTracks().forEach((track) => track.stop());
//         } catch (e) {
//             console.log(e);
//         }

//         window.localStream = stream;
//         localVideoref.current.srcObject = stream;

//         for (let id in connections) {
//             if (id === socketIdRef.current) continue;

//             connections[id].addStream(window.localStream);

//             connections[id].createOffer().then((description) => {
//                 connections[id]
//                     .setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit(
//                             "signal",
//                             id,
//                             JSON.stringify({
//                                 sdp: connections[id].localDescription,
//                             })
//                         );
//                     })
//                     .catch((e) => console.log(e));
//             });
//         }

//         stream.getTracks().forEach(
//             (track) =>
//                 (track.onended = () => {
//                     setScreen(false);

//                     try {
//                         let tracks =
//                             localVideoref.current.srcObject.getTracks();
//                         tracks.forEach((track) => track.stop());
//                     } catch (e) {
//                         console.log(e);
//                     }

//                     let blackSilence = (...args) =>
//                         new MediaStream([black(...args), silence()]);
//                     window.localStream = blackSilence();
//                     localVideoref.current.srcObject = window.localStream;

//                     getUserMedia();
//                 })
//         );
//     };

//     let gotMessageFromServer = (fromId, message) => {
//         var signal = JSON.parse(message);

//         if (fromId !== socketIdRef.current) {
//             if (signal.sdp) {
//                 connections[fromId]
//                     .setRemoteDescription(new RTCSessionDescription(signal.sdp))
//                     .then(() => {
//                         if (signal.sdp.type === "offer") {
//                             connections[fromId]
//                                 .createAnswer()
//                                 .then((description) => {
//                                     connections[fromId]
//                                         .setLocalDescription(description)
//                                         .then(() => {
//                                             socketRef.current.emit(
//                                                 "signal",
//                                                 fromId,
//                                                 JSON.stringify({
//                                                     sdp: connections[fromId]
//                                                         .localDescription,
//                                                 })
//                                             );
//                                         })
//                                         .catch((e) => console.log(e));
//                                 })
//                                 .catch((e) => console.log(e));
//                         }
//                     })
//                     .catch((e) => console.log(e));
//             }

//             if (signal.ice) {
//                 connections[fromId]
//                     .addIceCandidate(new RTCIceCandidate(signal.ice))
//                     .catch((e) => console.log(e));
//             }
//         }
//     };

//     let connectToSocketServer = () => {
//         socketRef.current = io.connect(server_url, { secure: false });

//         socketRef.current.on("signal", gotMessageFromServer);

//         socketRef.current.on("connect", () => {
//             socketRef.current.emit("join-call", window.location.href);
//             socketIdRef.current = socketRef.current.id;

//             socketRef.current.on("chat-message", addMessage);

//             socketRef.current.on("user-left", (id) => {
//                 setVideos((videos) =>
//                     videos.filter((video) => video.socketId !== id)
//                 );
//             });

//             socketRef.current.on("user-joined", (id, clients) => {
//                 clients.forEach((socketListId) => {
//                     connections[socketListId] = new RTCPeerConnection(
//                         peerConfigConnections
//                     );
//                     // Wait for their ice candidate
//                     connections[socketListId].onicecandidate = function (
//                         event
//                     ) {
//                         if (event.candidate != null) {
//                             socketRef.current.emit(
//                                 "signal",
//                                 socketListId,
//                                 JSON.stringify({ ice: event.candidate })
//                             );
//                         }
//                     };

//                     // Wait for their video stream
//                     connections[socketListId].onaddstream = (event) => {
//                         console.log("BEFORE:", videoRef.current);
//                         console.log("FINDING ID: ", socketListId);

//                         let videoExists = videoRef.current.find(
//                             (video) => video.socketId === socketListId
//                         );

//                         if (videoExists) {
//                             console.log("FOUND EXISTING");

//                             // Update the stream of the existing video
//                             setVideos((videos) => {
//                                 const updatedVideos = videos.map((video) =>
//                                     video.socketId === socketListId
//                                         ? { ...video, stream: event.stream }
//                                         : video
//                                 );
//                                 videoRef.current = updatedVideos;
//                                 return updatedVideos;
//                             });
//                         } else {
//                             // Create a new video
//                             console.log("CREATING NEW");
//                             let newVideo = {
//                                 socketId: socketListId,
//                                 stream: event.stream,
//                                 autoplay: true,
//                                 playsinline: true,
//                             };

//                             setVideos((videos) => {
//                                 const updatedVideos = [...videos, newVideo];
//                                 videoRef.current = updatedVideos;
//                                 return updatedVideos;
//                             });
//                         }
//                     };

//                     // Add the local video stream
//                     if (
//                         window.localStream !== undefined &&
//                         window.localStream !== null
//                     ) {
//                         connections[socketListId].addStream(window.localStream);
//                     } else {
//                         let blackSilence = (...args) =>
//                             new MediaStream([black(...args), silence()]);
//                         window.localStream = blackSilence();
//                         connections[socketListId].addStream(window.localStream);
//                     }
//                 });

//                 if (id === socketIdRef.current) {
//                     for (let id2 in connections) {
//                         if (id2 === socketIdRef.current) continue;

//                         try {
//                             connections[id2].addStream(window.localStream);
//                         } catch (e) {}

//                         connections[id2].createOffer().then((description) => {
//                             connections[id2]
//                                 .setLocalDescription(description)
//                                 .then(() => {
//                                     socketRef.current.emit(
//                                         "signal",
//                                         id2,
//                                         JSON.stringify({
//                                             sdp: connections[id2]
//                                                 .localDescription,
//                                         })
//                                     );
//                                 })
//                                 .catch((e) => console.log(e));
//                         });
//                     }
//                 }
//             });
//         });
//     };

//     let silence = () => {
//         let ctx = new AudioContext();
//         let oscillator = ctx.createOscillator();
//         let dst = oscillator.connect(ctx.createMediaStreamDestination());
//         oscillator.start();
//         ctx.resume();
//         return Object.assign(dst.stream.getAudioTracks()[0], {
//             enabled: false,
//         });
//     };
//     let black = ({ width = 640, height = 480 } = {}) => {
//         let canvas = Object.assign(document.createElement("canvas"), {
//             width,
//             height,
//         });
//         canvas.getContext("2d").fillRect(0, 0, width, height);
//         let stream = canvas.captureStream();
//         return Object.assign(stream.getVideoTracks()[0], { enabled: false });
//     };

//     let handleVideo = () => {
//         setVideo(!video);
//         // getUserMedia();
//     };
//     let handleAudio = () => {
//         setAudio(!audio);
//         // getUserMedia();
//     };

//     useEffect(() => {
//         if (screen !== undefined) {
//             getDislayMedia();
//         }
//     }, [screen]);

//     let handleScreen = () => {
//         setScreen(!screen);
//     };

//     let handleEndCall = () => {
//         try {
//             if (localVideoref.current?.srcObject) {
//                 let tracks = localVideoref.current.srcObject.getTracks();
//                 tracks.forEach((track) => track.stop());
//             }
//         } catch (e) {
//             console.log("Error stopping tracks:", e);
//         }

//         setTimeout(() => {
//             navigate("/home"); // Use React Router's navigation
//         }, 500);
//     };

//     let openChat = () => {
//         setModal(true);
//         setNewMessages(0);
//     };
//     let closeChat = () => {
//         setModal(false);
//     };
//     let handleMessage = (e) => {
//         setMessage(e.target.value);
//     };

//     const addMessage = (data, sender, socketIdSender) => {
//         setMessages((prevMessages) => [
//             ...prevMessages,
//             {
//                 sender: sender,
//                 data: data,
//                 timestamp: new Date(),
//                 type: socketIdSender,
//             },
//         ]);
//         if (socketIdSender !== socketIdRef.current) {
//             setNewMessages((prevNewMessages) => prevNewMessages + 1);
//         }
//     };

//     let sendMessage = () => {
//         if (message.trim() === "") return;
//         console.log(socketRef.current);
//         socketRef.current.emit("chat-message", message, username);
//         setMessage("");

//         // this.setState({ message: "", sender: username })
//     };

//     const copyMeetingLink = () => {
//         navigator.clipboard.writeText(`${stateRandomId}`);
//         alert("Meeting link copied to clipboard!");
//     };

//     // Format timestamp for chat messages
//     const formatTime = (date) => {
//         return new Date(date).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     let connect = () => {
//         setAskForUsername(false);
//         getMedia();
//     };

//     // Waiting room / username prompt
//     if (askForUsername) {
//         return (
//             <div className={styles.waitingRoom}>
//                 <div className={styles.waitingRoomContent}>
//                     <h2>Join Meeting</h2>
//                     <div className={styles.meetingInfo}>
//                         <div className={styles.meetingId}>
//                             <h3>
//                                 Meeting ID : <span>{stateRandomId}</span>
//                             </h3>
//                             <Tooltip title="Copy meeting link">
//                                 <IconButton onClick={copyMeetingLink}>
//                                     <ContentCopyIcon />
//                                 </IconButton>
//                             </Tooltip>
//                         </div>
//                     </div>

//                     <div className={styles.videoPreview}>
//                         <video ref={localVideoref} autoPlay muted></video>
//                     </div>

//                     <div className={styles.controls}>
//                         <IconButton
//                             onClick={handleVideo}
//                             className={
//                                 video
//                                     ? styles.activeControl
//                                     : styles.inactiveControl
//                             }
//                         >
//                             {video ? <VideocamIcon /> : <VideocamOffIcon />}
//                         </IconButton>
//                         <IconButton
//                             onClick={handleAudio}
//                             className={
//                                 audio
//                                     ? styles.activeControl
//                                     : styles.inactiveControl
//                             }
//                         >
//                             {audio ? <MicIcon /> : <MicOffIcon />}
//                         </IconButton>
//                     </div>

//                     <div className={styles.usernameForm}>
//                         <TextField
//                             label="Your Name"
//                             variant="outlined"
//                             fullWidth
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             onKeyPress={(e) => e.key === "Enter" && connect()}
//                         />
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             fullWidth
//                             onClick={connect}
//                             className={styles.joinButton}
//                         >
//                             Join Now
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//     return (
//         <div>
//             <div className={styles.meetVideoContainer}>
//                 {showModal ? (
//                 <div className={styles.chatRoom}>
//                     <div className={styles.chatContainer}>
//                         <h3>Chat</h3>
//                         <div
//                             className={styles.chattingDisplay}
//                             ref={chatDisplayRef}
//                         >
//                             {messages.length > 0 ? (
//                                 messages.map((msg, index) => (
//                                     <div
//                                         key={index}
//                                         className={`${styles.messageItem} ${
//                                             msg.type === socketIdRef.current
//                                                 ? styles.myMessage
//                                                 : msg.type === "system"
//                                                 ? styles.systemMessage
//                                                 : styles.otherMessage
//                                         }`}
//                                     >
//                                         <div className={styles.messageSender}>
//                                             {msg.sender}
//                                         </div>
//                                         <div className={styles.messageContent}>
//                                             <span
//                                                 className={styles.messageText}
//                                             >
//                                                 {msg.data}
//                                             </span>
//                                             {msg.timestamp && (
//                                                 <span
//                                                     className={
//                                                         styles.messageTime
//                                                     }
//                                                 >
//                                                     {formatTime(msg.timestamp)}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className={styles.noMessages}>
//                                     No messages yet
//                                 </p>
//                             )}
//                         </div>
//                         <div className={styles.chattingArea}>
//                             <TextField
//                                 value={message}
//                                 onChange={(e) => setMessage(e.target.value)}
//                                 placeholder="Type a message..."
//                                 variant="outlined"
//                                 fullWidth
//                                 onKeyPress={(e) =>
//                                     e.key === "Enter" && sendMessage()
//                                 }
//                             />
//                             <IconButton onClick={sendMessage} color="primary">
//                                 <SendIcon />
//                             </IconButton>
//                         </div>
//                     </div>
//                 </div>
//                 ) : (
//                     <></>
//                 )}

//                 <div className={styles.buttonContainers}>
//                     {/* <PopupModal link={stateRandomId} /> */}
//                     <Tooltip title="Copy meeting link">
//                         //{" "}
//                         <IconButton
//                             onClick={copyMeetingLink}
//                             className={styles.controlButton}
//                         >
//                             <ContentCopyIcon />
//                         </IconButton>
//                     </Tooltip>
//                     <IconButton
//                         onClick={handleVideo}
//                         style={{ color: "white" }}
//                     >
//                         {video === true ? (
//                             <VideocamIcon />
//                         ) : (
//                             <VideocamOffIcon />
//                         )}
//                     </IconButton>
//                     <IconButton
//                         onClick={handleEndCall}
//                         style={{ color: "red" }}
//                     >
//                         <CallEndIcon />
//                     </IconButton>
//                     <IconButton
//                         onClick={handleAudio}
//                         style={{ color: "white" }}
//                     >
//                         {audio === true ? <MicIcon /> : <MicOffIcon />}
//                     </IconButton>

//                     {screenAvailable === true ? (
//                         <IconButton
//                             onClick={handleScreen}
//                             style={{ color: "white" }}
//                         >
//                             {screen === true ? (
//                                 <ScreenShareIcon />
//                             ) : (
//                                 <StopScreenShareIcon />
//                             )}
//                         </IconButton>
//                     ) : (
//                         <></>
//                     )}

//                     <Badge badgeContent={newMessages} max={999} color="orange">
//                         <IconButton
//                             onClick={() => setModal(!showModal)}
//                             style={{ color: "white" }}
//                         >
//                             <ChatIcon />{" "}
//                         </IconButton>
//                     </Badge>
//                 </div>

//                 <video
//                     className={
//                         videos.length === 0
//                             ? styles.singleUser
//                             : styles.multiUser
//                     }
//                     ref={localVideoref}
//                     autoPlay
//                     muted
//                 ></video>

//                 <div className={styles.conferenceView}>
//                     {videos.map((video) => (
//                         <div key={video.socketId}>
//                             <video
//                                 data-socket={video.socketId}
//                                 ref={(ref) => {
//                                     if (ref && video.stream) {
//                                         ref.srcObject = video.stream;
//                                     }
//                                 }}
//                                 autoPlay
//                             ></video>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import styles from "../styles/VideoComponent.module.css";
// import server from "../enviornment";
// import { useLocation, useNavigate } from "react-router-dom";

// // Icons
// import VideocamIcon from "@mui/icons-material/Videocam";
// import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import MicIcon from "@mui/icons-material/Mic";
// import MicOffIcon from "@mui/icons-material/MicOff";
// import CallEndIcon from "@mui/icons-material/CallEnd";
// import ScreenShareIcon from "@mui/icons-material/ScreenShare";
// import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
// import ChatIcon from "@mui/icons-material/Chat";
// import SendIcon from "@mui/icons-material/Send";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import {
//     IconButton,
//     TextField,
//     Button,
//     Badge,
//     Tooltip,
//     Avatar,
// } from "@mui/material";

// // const server_url = server;
// const server_url = "http://localhost:8000";

// // Global object to store connections
// var connections = {};

// const peerConfigConnections = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// export default function VideoMeet() {
//     // Refs
//     const socketRef = useRef();
//     const socketIdRef = useRef();
//     const localVideoRef = useRef();
//     const videoRef = useRef([]);
//     const chatDisplayRef = useRef();

//     // State for media permissions
//     const [videoAvailable, setVideoAvailable] = useState(true);
//     const [audioAvailable, setAudioAvailable] = useState(true);
//     const [screenAvailable, setScreenAvailable] = useState(false);

//     // State for media controls
//     const [video, setVideo] = useState(true);
//     const [audio, setAudio] = useState(true);
//     const [screen, setScreen] = useState(false);

//     // State for UI
//     const [showChat, setShowChat] = useState(false);
//     const [askForUsername, setAskForUsername] = useState(true);
//     const [username, setUsername] = useState("");

//     // State for chat
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [newMessages, setNewMessages] = useState(0);

//     // State for participants
//     const [videos, setVideos] = useState([]);

//     // Router
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { randomId: meetingId } = location.state || {
//         randomId: "meeting-" + Math.random().toString(36).substring(2, 7),
//     };

//     // Initialize on component mount
//     useEffect(() => {
//         getPermissions();
//     }, []);

//     // Update media when state changes
//     useEffect(() => {
//         if (video !== undefined && audio !== undefined) {
//             getUserMedia();
//         }
//     }, [video, audio]);

//     // Handle screen sharing changes
//     useEffect(() => {
//         if (screen !== undefined) {
//             getDisplayMedia();
//         }
//     }, [screen]);

//     // Media handling functions
//     const getPermissions = async () => {
//         try {
//             // Check video permission
//             try {
//                 const videoPermission =
//                     await navigator.mediaDevices.getUserMedia({
//                         video: true,
//                     });
//                 setVideoAvailable(true);
//                 videoPermission.getTracks().forEach((track) => track.stop());
//             } catch (e) {
//                 setVideoAvailable(false);
//                 console.log("Video permission denied", e);
//             }

//             // Check audio permission
//             try {
//                 const audioPermission =
//                     await navigator.mediaDevices.getUserMedia({
//                         audio: true,
//                     });
//                 setAudioAvailable(true);
//                 audioPermission.getTracks().forEach((track) => track.stop());
//             } catch (e) {
//                 setAudioAvailable(false);
//                 console.log("Audio permission denied", e);
//             }

//             // Check screen sharing availability
//             setScreenAvailable("getDisplayMedia" in navigator.mediaDevices);

//             // Initialize local stream
//             if (videoAvailable || audioAvailable) {
//                 const userMediaStream =
//                     await navigator.mediaDevices.getUserMedia({
//                         video: videoAvailable,
//                         audio: audioAvailable,
//                     });

//                 window.localStream = userMediaStream;
//                 if (localVideoRef.current) {
//                     localVideoRef.current.srcObject = userMediaStream;
//                 }
//             }
//         } catch (error) {
//             console.log("Error getting permissions:", error);
//         }
//     };

//     const getUserMedia = (stream) => {
//         if ((video && videoAvailable) || (audio && audioAvailable)) {
//             navigator.mediaDevices
//                 .getUserMedia({ video: video, audio: audio })
//                 .then(getUserMediaSuccess)
//                 .then((stream) => {})
//                 .catch((e) => console.log("Error getting user media:", e));
//         } else {
//             try {
//                 let tracks = localVideoRef.current.srcObject.getTracks();
//                 tracks.forEach((track) => track.stop());
//             } catch (e) {
//                 console.log("Error stopping tracks:", e);
//             }
//         }
//     };

//     const getUserMediaSuccess = (stream) => {
//         try {
//             window.localStream.getTracks().forEach((track) => track.stop());
//         } catch (e) {
//             console.log("Error stopping previous stream:", e);
//         }

//         window.localStream = stream;
//         localVideoRef.current.srcObject = stream;

//         // Handle peer connections
//         for (let id in connections) {
//             if (id === socketIdRef.current) continue;

//             connections[id].addStream(window.localStream);
//             connections[id].createOffer().then((description) => {
//                 connections[id]
//                     .setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit(
//                             "signal",
//                             id,
//                             JSON.stringify({
//                                 sdp: connections[id].localDescription,
//                             })
//                         );
//                     })
//                     .catch((e) => console.log(e));
//             });
//         }

//         // Handle stream end
//         stream.getTracks().forEach(
//             (track) =>
//                 (track.onended = () => {
//                     setVideo(false);
//                     setAudio(false);

//                     try {
//                         let tracks =
//                             localVideoRef.current.srcObject.getTracks();
//                         tracks.forEach((track) => track.stop());
//                     } catch (e) {
//                         console.log(e);
//                     }

//                     let blackSilence = (...args) =>
//                         new MediaStream([black(...args), silence()]);
//                     window.localStream = blackSilence();
//                     localVideoRef.current.srcObject = window.localStream;

//                     for (let id in connections) {
//                         connections[id].addStream(window.localStream);

//                         connections[id].createOffer().then((description) => {
//                             connections[id]
//                                 .setLocalDescription(description)
//                                 .then(() => {
//                                     socketRef.current.emit(
//                                         "signal",
//                                         id,
//                                         JSON.stringify({
//                                             sdp: connections[id]
//                                                 .localDescription,
//                                         })
//                                     );
//                                 })
//                                 .catch((e) => console.log(e));
//                         });
//                     }
//                 })
//         );
//     };

//     const getDisplayMedia = () => {
//         if (screen && navigator.mediaDevices.getDisplayMedia) {
//             navigator.mediaDevices
//                 .getDisplayMedia({ video: true, audio: true })
//                 .then(getDisplayMediaSuccess)
//                 .catch((e) => console.log("Error getting display media:", e));
//         }
//     };

//     const getDisplayMediaSuccess = (stream) => {
//         try {
//             window.localStream.getTracks().forEach((track) => track.stop());
//         } catch (e) {
//             console.log("Error stopping previous stream:", e);
//         }

//         window.localStream = stream;
//         localVideoRef.current.srcObject = stream;

//         // Handle peer connections
//         for (let id in connections) {
//             if (id === socketIdRef.current) continue;

//             connections[id].addStream(window.localStream);
//             connections[id].createOffer().then((description) => {
//                 connections[id]
//                     .setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit(
//                             "signal",
//                             id,
//                             JSON.stringify({
//                                 sdp: connections[id].localDescription,
//                             })
//                         );
//                     })
//                     .catch((e) => console.log(e));
//             });
//         }

//         // Handle screen sharing end
//         stream.getTracks().forEach(
//             (track) =>
//                 (track.onended = () => {
//                     setScreen(false);

//                     try {
//                         let tracks =
//                             localVideoRef.current.srcObject.getTracks();
//                         tracks.forEach((track) => track.stop());
//                     } catch (e) {
//                         console.log(e);
//                     }

//                     let blackSilence = (...args) =>
//                         new MediaStream([black(...args), silence()]);
//                     window.localStream = blackSilence();
//                     localVideoRef.current.srcObject = window.localStream;

//                     getUserMedia();
//                 })
//         );
//     };

//     // Utility functions for black video and silence audio
//     const silence = () => {
//         let ctx = new AudioContext();
//         let oscillator = ctx.createOscillator();
//         let dst = oscillator.connect(ctx.createMediaStreamDestination());
//         oscillator.start();
//         ctx.resume();
//         return Object.assign(dst.stream.getAudioTracks()[0], {
//             enabled: false,
//         });
//     };

//     const black = ({ width = 640, height = 480 } = {}) => {
//         let canvas = Object.assign(document.createElement("canvas"), {
//             width,
//             height,
//         });
//         canvas.getContext("2d").fillRect(0, 0, width, height);
//         let stream = canvas.captureStream();
//         return Object.assign(stream.getVideoTracks()[0], { enabled: false });
//     };

//     // Signal handling
//     const gotMessageFromServer = (fromId, message) => {
//         var signal = JSON.parse(message);

//         if (fromId !== socketIdRef.current) {
//             if (signal.sdp) {
//                 connections[fromId]
//                     .setRemoteDescription(new RTCSessionDescription(signal.sdp))
//                     .then(() => {
//                         if (signal.sdp.type === "offer") {
//                             connections[fromId]
//                                 .createAnswer()
//                                 .then((description) => {
//                                     connections[fromId]
//                                         .setLocalDescription(description)
//                                         .then(() => {
//                                             socketRef.current.emit(
//                                                 "signal",
//                                                 fromId,
//                                                 JSON.stringify({
//                                                     sdp: connections[fromId]
//                                                         .localDescription,
//                                                 })
//                                             );
//                                         })
//                                         .catch((e) => console.log(e));
//                                 })
//                                 .catch((e) => console.log(e));
//                         }
//                     })
//                     .catch((e) => console.log(e));
//             }

//             if (signal.ice) {
//                 connections[fromId]
//                     .addIceCandidate(new RTCIceCandidate(signal.ice))
//                     .catch((e) => console.log(e));
//             }
//         }
//     };

//     // Connection handling
//     const connectToSocketServer = () => {
//         socketRef.current = io.connect(server_url, { secure: false });

//         socketRef.current.on("signal", gotMessageFromServer);

//         socketRef.current.on("connect", () => {
//             socketRef.current.emit("join-call", meetingId);
//             socketIdRef.current = socketRef.current.id;

//             // Set up event listeners
//             socketRef.current.on("chat-message", addMessage);
//             socketRef.current.on("user-left", handleUserLeft);
//             socketRef.current.on("user-joined", handleUserJoined);
//         });
//     };

//     // User and message handling
//     const handleUserJoined = (id, clients) => {
//         clients.forEach((socketListId) => {
//             connections[socketListId] = new RTCPeerConnection(
//                 peerConfigConnections
//             );

//             // Wait for their ice candidate
//             connections[socketListId].onicecandidate = function (event) {
//                 if (event.candidate != null) {
//                     socketRef.current.emit(
//                         "signal",
//                         socketListId,
//                         JSON.stringify({ ice: event.candidate })
//                     );
//                 }
//             };

//             // Wait for their video stream
//             connections[socketListId].onaddstream = (event) => {
//                 // Check if this socket already has a video
//                 let videoExists = videos.find(
//                     (video) => video.socketId === socketListId
//                 );

//                 if (videoExists) {
//                     // Update the stream of the existing video
//                     setVideos((videos) => {
//                         const updatedVideos = videos.map((video) =>
//                             video.socketId === socketListId
//                                 ? { ...video, stream: event.stream }
//                                 : video
//                         );
//                         videoRef.current = updatedVideos;
//                         return updatedVideos;
//                     });
//                 } else {
//                     // Create a new video
//                     let newVideo = {
//                         socketId: socketListId,
//                         stream: event.stream,
//                         autoplay: true,
//                         playsinline: true,
//                     };

//                     setVideos((videos) => {
//                         const updatedVideos = [...videos, newVideo];
//                         videoRef.current = updatedVideos;
//                         return updatedVideos;
//                     });
//                 }
//             };

//             // Add the local video stream
//             if (
//                 window.localStream !== undefined &&
//                 window.localStream !== null
//             ) {
//                 connections[socketListId].addStream(window.localStream);
//             } else {
//                 let blackSilence = (...args) =>
//                     new MediaStream([black(...args), silence()]);
//                 window.localStream = blackSilence();
//                 connections[socketListId].addStream(window.localStream);
//             }
//         });

//         if (id === socketIdRef.current) {
//             for (let id2 in connections) {
//                 if (id2 === socketIdRef.current) continue;

//                 try {
//                     connections[id2].addStream(window.localStream);
//                 } catch (e) {}

//                 connections[id2].createOffer().then((description) => {
//                     connections[id2]
//                         .setLocalDescription(description)
//                         .then(() => {
//                             socketRef.current.emit(
//                                 "signal",
//                                 id2,
//                                 JSON.stringify({
//                                     sdp: connections[id2].localDescription,
//                                 })
//                             );
//                         })
//                         .catch((e) => console.log(e));
//                 });
//             }
//         }
//     };

//     const handleUserLeft = (id) => {
//         setVideos((videos) => videos.filter((video) => video.socketId !== id));
//     };

//     const addMessage = (data, sender, socketIdSender) => {
//         setMessages((prevMessages) => [
//             ...prevMessages,
//             {
//                 sender: sender,
//                 data: data,
//                 timestamp: new Date(),
//                 type: socketIdSender,
//             },
//         ]);

//         if (socketIdSender !== socketIdRef.current) {
//             setNewMessages((prevNewMessages) => prevNewMessages + 1);
//         }
//     };

//     const sendMessage = () => {
//         if (message.trim() === "") return;

//         socketRef.current.emit("chat-message", message, username);
//         addMessage(message, "You", socketIdRef.current);
//         setMessage("");
//     };

//     // UI action handlers
//     const handleVideo = () => {
//         if (window.localStream) {
//             window.localStream.getVideoTracks().forEach((track) => {
//                 track.enabled = !video;
//             });
//         }
//         setVideo(!video);
//     };

//     const handleAudio = () => {
//         if (window.localStream) {
//             window.localStream.getAudioTracks().forEach((track) => {
//                 track.enabled = !audio;
//             });
//         }
//         setAudio(!audio);
//     };

//     const handleScreen = () => {
//         setScreen(!screen);
//     };

//     const handleChatToggle = () => {
//         setShowChat(!showChat);
//         if (!showChat) {
//             setNewMessages(0);
//         }
//     };

//     const handleEndCall = () => {
//         try {
//             if (localVideoRef.current?.srcObject) {
//                 localVideoRef.current.srcObject
//                     .getTracks()
//                     .forEach((track) => track.stop());
//             }
//         } catch (e) {
//             console.log("Error stopping tracks:", e);
//         }

//         setTimeout(() => {
//             navigate("/home");
//         }, 500);
//     };

//     const joinMeeting = () => {
//         if (!username.trim()) {
//             alert("Please enter a username");
//             return;
//         }

//         setAskForUsername(false);
//         setVideo(videoAvailable);
//         setAudio(audioAvailable);
//         connectToSocketServer();
//     };

//     const copyMeetingLink = () => {
//         navigator.clipboard.writeText(
//             `${window.location.origin}/meeting/${meetingId}`
//         );
//         alert("Meeting link copied to clipboard!");
//     };

//     // Format timestamp for chat messages
//     const formatTime = (date) => {
//         return new Date(date).toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     // Waiting room / username prompt
//     if (askForUsername) {
//         return (
//             <div className={styles.waitingRoom}>
//                 <div className={styles.waitingRoomContent}>
//                     <h2>Join Meeting</h2>
//                     <div className={styles.meetingInfo}>
//                         <div className={styles.meetingId}>
//                             <h3>
//                                 Meeting ID : <span>{meetingId}</span>
//                             </h3>
//                             <Tooltip title="Copy meeting link">
//                                 <IconButton onClick={copyMeetingLink}>
//                                     <ContentCopyIcon />
//                                 </IconButton>
//                             </Tooltip>
//                         </div>
//                     </div>

//                     <div className={styles.videoPreview}>
//                         <video ref={localVideoRef} autoPlay muted></video>
//                     </div>

//                     <div className={styles.controls}>
//                         <IconButton
//                             onClick={handleVideo}
//                             className={
//                                 video
//                                     ? styles.activeControl
//                                     : styles.inactiveControl
//                             }
//                         >
//                             {video ? <VideocamIcon /> : <VideocamOffIcon />}
//                         </IconButton>
//                         <IconButton
//                             onClick={handleAudio}
//                             className={
//                                 audio
//                                     ? styles.activeControl
//                                     : styles.inactiveControl
//                             }
//                         >
//                             {audio ? <MicIcon /> : <MicOffIcon />}
//                         </IconButton>
//                     </div>

//                     <div className={styles.usernameForm}>
//                         <TextField
//                             label="Your Name"
//                             variant="outlined"
//                             fullWidth
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             onKeyPress={(e) =>
//                                 e.key === "Enter" && joinMeeting()
//                             }
//                         />
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             fullWidth
//                             onClick={joinMeeting}
//                             className={styles.joinButton}
//                         >
//                             Join Now
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // Main meeting view
//     return (
//         <div className={styles.meetVideoContainer}>
//             {/* Main video grid */}
//             <div
//                 className={`${styles.conferenceView} ${
//                     videos.length <= 1 ? styles.singleUser : styles.multiUser
//                 }`}
//             >
//                 {/* Remote videos */}
//                 {videos.map((videoObj) => (
//                     <div
//                         key={videoObj.socketId}
//                         className={styles.userVideoContainer}
//                     >
//                         <video
//                             data-socket={videoObj.socketId}
//                             ref={(ref) => {
//                                 if (ref && videoObj.stream) {
//                                     ref.srcObject = videoObj.stream;
//                                 }
//                             }}
//                             autoPlay
//                             className={styles.userVideo}
//                         />
//                         <div className={styles.participantName}>
//                             {videoObj.name || "Participant"}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Local video */}
//             <video
//                 ref={localVideoRef}
//                 autoPlay
//                 muted
//                 className={
//                     videos.length === 0 ? styles.singleUser : styles.multiUser
//                 }
//             />

//             {/* Chat panel */}
//             {showChat && (
//                 <div className={styles.chatRoom}>
//                     <div className={styles.chatContainer}>
//                         <h3>Chat</h3>
//                         <div
//                             className={styles.chattingDisplay}
//                             ref={chatDisplayRef}
//                         >
//                             {messages.length > 0 ? (
//                                 messages.map((msg, index) => (
//                                     <div
//                                         key={index}
//                                         className={`${styles.messageItem} ${
//                                             msg.type === socketIdRef.current
//                                                 ? styles.myMessage
//                                                 : msg.type === "system"
//                                                 ? styles.systemMessage
//                                                 : styles.otherMessage
//                                         }`}
//                                     >
//                                         <div className={styles.messageSender}>
//                                             {msg.sender}
//                                         </div>
//                                         <div className={styles.messageContent}>
//                                             <span
//                                                 className={styles.messageText}
//                                             >
//                                                 {msg.data}
//                                             </span>
//                                             {msg.timestamp && (
//                                                 <span
//                                                     className={
//                                                         styles.messageTime
//                                                     }
//                                                 >
//                                                     {formatTime(msg.timestamp)}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className={styles.noMessages}>
//                                     No messages yet
//                                 </p>
//                             )}
//                         </div>
//                         <div className={styles.chattingArea}>
//                             <TextField
//                                 value={message}
//                                 onChange={(e) => setMessage(e.target.value)}
//                                 placeholder="Type a message..."
//                                 variant="outlined"
//                                 fullWidth
//                                 onKeyPress={(e) =>
//                                     e.key === "Enter" && sendMessage()
//                                 }
//                             />
//                             <IconButton onClick={sendMessage} color="primary">
//                                 <SendIcon />
//                             </IconButton>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Control buttons */}
//             <div className={styles.buttonContainers}>
//                 <Tooltip title={`${video ? "Turn off" : "Turn on"} camera`}>
//                     <IconButton
//                         onClick={handleVideo}
//                         className={
//                             video
//                                 ? styles.activeControl
//                                 : styles.inactiveControl
//                         }
//                     >
//                         {video ? <VideocamIcon /> : <VideocamOffIcon />}
//                     </IconButton>
//                 </Tooltip>
//                 <Tooltip title={`${audio ? "Mute" : "Unmute"} microphone`}>
//                     <IconButton
//                         onClick={handleAudio}
//                         className={
//                             audio
//                                 ? styles.activeControl
//                                 : styles.inactiveControl
//                         }
//                     >
//                         {audio ? <MicIcon /> : <MicOffIcon />}
//                     </IconButton>
//                 </Tooltip>
//                 <Tooltip title="End call">
//                     <IconButton
//                         onClick={handleEndCall}
//                         className={styles.endCallButton}
//                     >
//                         <CallEndIcon />
//                     </IconButton>
//                 </Tooltip>
//                 {screenAvailable && (
//                     <Tooltip
//                         title={`${screen ? "Stop" : "Start"} screen sharing`}
//                     >
//                         <IconButton
//                             onClick={handleScreen}
//                             className={
//                                 screen
//                                     ? styles.activeControl
//                                     : styles.inactiveControl
//                             }
//                         >
//                             {screen ? (
//                                 <StopScreenShareIcon />
//                             ) : (
//                                 <ScreenShareIcon />
//                             )}
//                         </IconButton>
//                     </Tooltip>
//                 )}
//                 <Tooltip title="Chat">
//                     <IconButton
//                         onClick={handleChatToggle}
//                         className={
//                             showChat
//                                 ? styles.activeControl
//                                 : styles.inactiveControl
//                         }
//                     >
//                         <Badge badgeContent={newMessages} color="error">
//                             <ChatIcon />
//                         </Badge>
//                     </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Copy meeting link">
//                     <IconButton
//                         onClick={copyMeetingLink}
//                         className={styles.controlButton}
//                     >
//                         <ContentCopyIcon />
//                     </IconButton>
//                 </Tooltip>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import {
    IconButton,
    TextField,
    Button,
    Badge,
    Tooltip,
    Avatar,
} from "@mui/material";

// Material UI Icons
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// Styles and Environment Settings
import styles from "../styles/videoComponent.module.css";
import server from "../enviornment";

// Global Settings
const server_url = server;
const peerConfigConnections = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
let connections = {};

export default function VideoMeetComponent() {
    // ******************************************
    // ********** REFS AND STATE SETUP **********
    // ******************************************

    // Refs
    const socketRef = useRef();
    const socketIdRef = useRef();
    const chatDisplayRef = useRef();
    const localVideoref = useRef();
    const videoRef = useRef([]);

    // Media State
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [video, setVideo] = useState([]);
    const [audio, setAudio] = useState();
    const [screen, setScreen] = useState();
    const [videos, setVideos] = useState([]);

    // UI State
    const [showModal, setModal] = useState(true);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");

    // Chat State
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);

    // Navigation and Location
    const location = useLocation();
    const navigate = useNavigate();
    const { randomId: stateRandomId } = location.state || {}; // Get meeting ID from state

    // ******************************************
    // ********** MEDIA HANDLING LOGIC **********
    // ******************************************

    /**
     * Request and setup initial device permissions
     */
    const getPermissions = async () => {
        try {
            // Request video permission
            const videoPermission = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setVideoAvailable(!!videoPermission);

            // Request audio permission
            const audioPermission = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            setAudioAvailable(!!audioPermission);

            // Check if screen sharing is available
            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

            // Setup local stream if permissions granted
            if (videoAvailable || audioAvailable) {
                const userMediaStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: videoAvailable,
                        audio: audioAvailable,
                    });

                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log("Permission error:", error);
        }
    };

    /**
     * Get user media (camera/mic) stream
     */
    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices
                .getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log("getUserMedia error:", e));
        } else {
            try {
                // Stop tracks if they exist
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            } catch (e) {
                console.log("Error stopping tracks:", e);
            }
        }
    };

    /**
     * Handle successful acquisition of user media
     */
    const getUserMediaSuccess = (stream) => {
        try {
            // Stop any existing stream tracks
            window.localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
            console.log("Error stopping existing tracks:", e);
        }

        // Set new stream
        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        // Share stream with all existing connections
        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);

            // Create and send offer
            connections[id].createOffer().then((description) => {
                connections[id]
                    .setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit(
                            "signal",
                            id,
                            JSON.stringify({
                                sdp: connections[id].localDescription,
                            })
                        );
                    })
                    .catch((e) => console.log("setLocalDescription error:", e));
            });
        }

        // Handle track ending (e.g. camera disconnected)
        stream.getTracks().forEach(
            (track) =>
                (track.onended = () => {
                    setVideo(false);
                    setAudio(false);

                    try {
                        let tracks =
                            localVideoref.current.srcObject.getTracks();
                        tracks.forEach((track) => track.stop());
                    } catch (e) {
                        console.log("Error stopping tracks on end:", e);
                    }

                    // Replace with black/silent stream
                    let blackSilence = (...args) =>
                        new MediaStream([black(...args), silence()]);
                    window.localStream = blackSilence();
                    localVideoref.current.srcObject = window.localStream;

                    // Update all connections with the black/silent stream
                    for (let id in connections) {
                        connections[id].addStream(window.localStream);

                        connections[id].createOffer().then((description) => {
                            connections[id]
                                .setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit(
                                        "signal",
                                        id,
                                        JSON.stringify({
                                            sdp: connections[id]
                                                .localDescription,
                                        })
                                    );
                                })
                                .catch((e) =>
                                    console.log(
                                        "Error in track.onended setLocalDescription:",
                                        e
                                    )
                                );
                        });
                    }
                })
        );
    };

    /**
     * Get display media for screen sharing
     */
    const getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices
                    .getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .catch((e) => console.log("getDisplayMedia error:", e));
            }
        }
    };

    /**
     * Handle successful acquisition of display media
     */
    const getDislayMediaSuccess = (stream) => {
        try {
            // Stop existing stream tracks
            window.localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
            console.log("Error stopping tracks for screen share:", e);
        }

        // Set new stream
        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        // Share screen with all connections
        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
                connections[id]
                    .setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit(
                            "signal",
                            id,
                            JSON.stringify({
                                sdp: connections[id].localDescription,
                            })
                        );
                    })
                    .catch((e) =>
                        console.log(
                            "Screen share setLocalDescription error:",
                            e
                        )
                    );
            });
        }

        // Handle screen share ending
        stream.getTracks().forEach(
            (track) =>
                (track.onended = () => {
                    setScreen(false);

                    try {
                        let tracks =
                            localVideoref.current.srcObject.getTracks();
                        tracks.forEach((track) => track.stop());
                    } catch (e) {
                        console.log("Error stopping screen share tracks:", e);
                    }

                    // Replace with black/silent stream
                    let blackSilence = (...args) =>
                        new MediaStream([black(...args), silence()]);
                    window.localStream = blackSilence();
                    localVideoref.current.srcObject = window.localStream;

                    // Return to camera/mic
                    getUserMedia();
                })
        );
    };

    /**
     * Create a silent audio track
     */
    const silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], {
            enabled: false,
        });
    };

    /**
     * Create a black video track
     */
    const black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), {
            width,
            height,
        });
        canvas.getContext("2d").fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };

    // ******************************************
    // ********** SOCKET & RTC LOGIC ***********
    // ******************************************

    /**
     * Connect to the socket server and setup event listeners
     */
    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        // Handle incoming WebRTC signals
        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {
            // Join the current meeting
            socketRef.current.emit("join-call", window.location.href);
            socketIdRef.current = socketRef.current.id;

            // Setup chat message handler
            socketRef.current.on("chat-message", addMessage);

            // Handle users leaving
            socketRef.current.on("user-left", (id) => {
                setVideos((videos) =>
                    videos.filter((video) => video.socketId !== id)
                );
            });

            // Handle new users joining
            socketRef.current.on("user-joined", (id, clients) => {
                clients.forEach((socketListId) => {
                    // Create new peer connection for each client
                    connections[socketListId] = new RTCPeerConnection(
                        peerConfigConnections
                    );

                    // Handle ICE candidates
                    connections[socketListId].onicecandidate = function (
                        event
                    ) {
                        if (event.candidate != null) {
                            socketRef.current.emit(
                                "signal",
                                socketListId,
                                JSON.stringify({ ice: event.candidate })
                            );
                        }
                    };

                    // Handle incoming stream
                    connections[socketListId].onaddstream = (event) => {
                        // Check if video already exists
                        let videoExists = videoRef.current.find(
                            (video) => video.socketId === socketListId
                        );

                        if (videoExists) {
                            // Update existing video stream
                            setVideos((videos) => {
                                const updatedVideos = videos.map((video) =>
                                    video.socketId === socketListId
                                        ? { ...video, stream: event.stream }
                                        : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create new video
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true,
                            };

                            setVideos((videos) => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // Add local stream to connection
                    if (
                        window.localStream !== undefined &&
                        window.localStream !== null
                    ) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        // Use black/silent stream if no local stream
                        let blackSilence = (...args) =>
                            new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                // If this is our join event, create offers to all other clients
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;

                        try {
                            connections[id2].addStream(window.localStream);
                        } catch (e) {
                            console.log(
                                "Error adding stream to connection:",
                                e
                            );
                        }

                        // Create and send offers
                        connections[id2].createOffer().then((description) => {
                            connections[id2]
                                .setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit(
                                        "signal",
                                        id2,
                                        JSON.stringify({
                                            sdp: connections[id2]
                                                .localDescription,
                                        })
                                    );
                                })
                                .catch((e) =>
                                    console.log("Error in join createOffer:", e)
                                );
                        });
                    }
                }
            });
        });
    };

    /**
     * Handle incoming WebRTC signaling messages
     */
    const gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId]
                    .setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        // If we received an offer, create an answer
                        if (signal.sdp.type === "offer") {
                            connections[fromId]
                                .createAnswer()
                                .then((description) => {
                                    connections[fromId]
                                        .setLocalDescription(description)
                                        .then(() => {
                                            socketRef.current.emit(
                                                "signal",
                                                fromId,
                                                JSON.stringify({
                                                    sdp: connections[fromId]
                                                        .localDescription,
                                                })
                                            );
                                        })
                                        .catch((e) =>
                                            console.log(
                                                "Error setting local description:",
                                                e
                                            )
                                        );
                                })
                                .catch((e) =>
                                    console.log("Error creating answer:", e)
                                );
                        }
                    })
                    .catch((e) =>
                        console.log("Error setting remote description:", e)
                    );
            }

            // Add ICE candidate if received
            if (signal.ice) {
                connections[fromId]
                    .addIceCandidate(new RTCIceCandidate(signal.ice))
                    .catch((e) =>
                        console.log("Error adding ICE candidate:", e)
                    );
            }
        }
    };

    // ******************************************
    // ********** UI CONTROL HANDLERS **********
    // ******************************************

    /**
     * Toggle video on/off
     */
    const handleVideo = () => {
        setVideo(!video);
    };

    /**
     * Toggle audio on/off
     */
    const handleAudio = () => {
        setAudio(!audio);
    };

    /**
     * Toggle screen sharing
     */
    const handleScreen = () => {
        setScreen(!screen);
    };

    /**
     * End the call and return to home
     */
    const handleEndCall = () => {
        try {
            if (localVideoref.current?.srcObject) {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        } catch (e) {
            console.log("Error stopping tracks on end call:", e);
        }

        // Navigate back to home after a short delay
        setTimeout(() => {
            navigate("/home");
        }, 500);
    };

    /**
     * Initialize media and join the meeting
     */
    const connect = () => {
        setAskForUsername(false);
        getMedia();
    };

    /**
     * Get media and initialize socket connection
     */
    const getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    /**
     * Copy meeting link to clipboard
     */
    const copyMeetingLink = () => {
        navigator.clipboard.writeText(`${stateRandomId}`);
        alert("Meeting link copied to clipboard!");
    };

    // ******************************************
    // ********** CHAT FUNCTIONALITY ***********
    // ******************************************

    /**
     * Open chat panel
     */
    const openChat = () => {
        setModal(true);
        setNewMessages(0);
    };

    /**
     * Close chat panel
     */
    const closeChat = () => {
        setModal(false);
    };

    /**
     * Update message input
     */
    const handleMessage = (e) => {
        setMessage(e.target.value);
    };

    /**
     * Send chat message
     */
    const sendMessage = () => {
        if (message.trim() === "") return;
        socketRef.current.emit("chat-message", message, username);
        setMessage("");
    };

    /**
     * Add a received message to the chat
     */
    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: sender,
                data: data,
                timestamp: new Date(),
                type: socketIdSender,
            },
        ]);

        // Increment new message counter if not from self
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    /**
     * Format timestamp for chat messages
     */
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ******************************************
    // ********** EFFECT HOOKS *****************
    // ******************************************

    // Initialize permissions when component mounts
    useEffect(() => {
        getPermissions();
    }, []);

    // Update media when video/audio state changes
    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);

    // Handle screen share changes
    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen]);

    // ******************************************
    // ********** RENDER FUNCTIONS *************
    // ******************************************

    // Render waiting room / username prompt
    if (askForUsername) {
        return (
            <div className={styles.waitingRoom}>
                <div className={styles.waitingRoomContent}>
                    <h2>Join Meeting</h2>
                    <div className={styles.meetingInfo}>
                        <div className={styles.meetingId}>
                            <h3>
                                Meeting ID : <span>{stateRandomId}</span>
                            </h3>
                            <Tooltip title="Copy meeting link">
                                <IconButton onClick={copyMeetingLink}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    <div className={styles.videoPreview}>
                        <video ref={localVideoref} autoPlay muted></video>
                    </div>

                    <div className={styles.controls}>
                        <IconButton
                            onClick={handleVideo}
                            className={
                                video
                                    ? styles.activeControl
                                    : styles.inactiveControl
                            }
                        >
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton
                            onClick={handleAudio}
                            className={
                                audio
                                    ? styles.activeControl
                                    : styles.inactiveControl
                            }
                        >
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                    </div>

                    <div className={styles.usernameForm}>
                        <TextField
                            label="Your Name"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && connect()}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={connect}
                            className={styles.joinButton}
                        >
                            Join Now
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Render main meeting component
    return (
        <div>
            <div className={styles.meetVideoContainer}>
                {/* Chat Panel */}
                {showModal && (
                    <div className={styles.chatRoom}>
                        <div className={styles.chatContainer}>
                            <h3>Chat</h3>
                            <div
                                className={styles.chattingDisplay}
                                ref={chatDisplayRef}
                            >
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.messageItem} ${
                                                msg.type === socketIdRef.current
                                                    ? styles.myMessage
                                                    : msg.type === "system"
                                                    ? styles.systemMessage
                                                    : styles.otherMessage
                                            }`}
                                        >
                                            <div
                                                className={styles.messageSender}
                                            >
                                                {msg.sender}
                                            </div>
                                            <div
                                                className={
                                                    styles.messageContent
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.messageText
                                                    }
                                                >
                                                    {msg.data}
                                                </span>
                                                {msg.timestamp && (
                                                    <span
                                                        className={
                                                            styles.messageTime
                                                        }
                                                    >
                                                        {formatTime(
                                                            msg.timestamp
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.noMessages}>
                                        No messages yet
                                    </p>
                                )}
                            </div>
                            <div className={styles.chattingArea}>
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    variant="outlined"
                                    fullWidth
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && sendMessage()
                                    }
                                />
                                <IconButton
                                    onClick={sendMessage}
                                    color="primary"
                                >
                                    <SendIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* Control Buttons */}
                <div className={styles.buttonContainers}>
                    <Tooltip title="Copy meeting link">
                        <IconButton
                            onClick={copyMeetingLink}
                            className={styles.controlButton}
                        >
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton
                        onClick={handleVideo}
                        style={{ color: "white" }}
                    >
                        {video === true ? (
                            <VideocamIcon />
                        ) : (
                            <VideocamOffIcon />
                        )}
                    </IconButton>
                    <IconButton
                        onClick={handleEndCall}
                        style={{ color: "red" }}
                    >
                        <CallEndIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleAudio}
                        style={{ color: "white" }}
                    >
                        {audio === true ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>

                    {screenAvailable === true && (
                        <IconButton
                            onClick={handleScreen}
                            style={{ color: "white" }}
                        >
                            {screen === true ? (
                                <ScreenShareIcon />
                            ) : (
                                <StopScreenShareIcon />
                            )}
                        </IconButton>
                    )}

                    <Badge badgeContent={newMessages} max={999} color="orange">
                        <IconButton
                            onClick={() => setModal(!showModal)}
                            style={{ color: "white" }}
                        >
                            <ChatIcon />
                        </IconButton>
                    </Badge>
                </div>

                {/* Local Video */}
                <video
                    className={
                        videos.length === 0
                            ? styles.singleUser
                            : styles.multiUser
                    }
                    ref={localVideoref}
                    autoPlay
                    muted
                ></video>

                {/* Remote Videos */}
                <div className={styles.conferenceView}>
                    {videos.map((video) => (
                        <div key={video.socketId}>
                            <video
                                data-socket={video.socketId}
                                ref={(ref) => {
                                    if (ref && video.stream) {
                                        ref.srcObject = video.stream;
                                    }
                                }}
                                autoPlay
                            ></video>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
