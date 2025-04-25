import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import {
    IconButton,
    TextField,
    Button,
    Badge,
    Tooltip,
    Snackbar,
    Avatar,
    Alert,
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
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import styles from "../styles/videoComponent.module.css";
import "./VideoMeet.css";
import server from "../enviornment";
import "./script.js";
import { AuthContext } from "../contexts/AuthContext";

const server_url = server;
const peerConfigConnections = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
let connections = {};

export default function VideoMeetComponent() {
    // Refs
    const socketRef = useRef();
    const socketIdRef = useRef();
    const chatDisplayRef = useRef();
    const localVideoref = useRef();
    const videoRef = useRef([]);
    let remoteUsernameMap = useRef([]);

    // State variables
    const [leftUser, setLeftUser] = useState(null);
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [video, setVideo] = useState([]);
    const [audio, setAudio] = useState();
    const [screen, setScreen] = useState();
    const [videos, setVideos] = useState([]);
    const [showModal, setModal] = useState(true);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();
    const { randomId: stateRandomId } = location.state || {};

    const { saveMeetTime } = useContext(AuthContext);

    // Request and check media device permissions
    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setVideoAvailable(!!videoPermission);

            const audioPermission = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            setAudioAvailable(!!audioPermission);

            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

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

    // Get user media stream (camera/microphone)
    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices
                .getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log("getUserMedia error:", e));
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            } catch (e) {
                console.log("Error stopping tracks:", e);
            }
        }
    };

    // Handle successful media stream acquisition
    const getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
            console.log("Error stopping existing tracks:", e);
        }

        stream.isScreenShare = false;
        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        // Share stream with all existing connections
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
                    .catch((e) => console.log("setLocalDescription error:", e));
            });
        }

        // Handle track ending
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

                    let blackSilence = (...args) =>
                        new MediaStream([black(...args), silence()]);
                    window.localStream = blackSilence();
                    localVideoref.current.srcObject = window.localStream;

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

    // Get display media for screen sharing
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

    // Handle successful screen sharing
    const getDislayMediaSuccess = (stream) => {
        stream.isScreenShare = true;
        try {
            window.localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
            console.log("Error stopping tracks for screen share:", e);
        }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

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

                    let blackSilence = (...args) =>
                        new MediaStream([black(...args), silence()]);
                    window.localStream = blackSilence();
                    localVideoref.current.srcObject = window.localStream;

                    getUserMedia();
                })
        );
    };

    // Create silent audio track
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

    // Create black video track
    const black = ({ width = 640, height = 480 } = {}) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Unable to obtain 2D context from the canvas.");
        }
        context.fillStyle = "#000000";
        context.fillRect(0, 0, width, height);
        const stream = canvas.captureStream();

        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = false;

        return videoTrack;
    };

    // Connect to socket server
    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {
            socketRef.current.emit("join-call", {
                path: window.location.href,
                username: username,
            });
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on("chat-message", addMessage);

            // Handle users leaving
            socketRef.current.on("user-left", (id, duration) => {
                setVideos((videos) => {
                    const updated = videos.filter(
                        (video) => video.socketId !== id
                    );
                    videoRef.current = updated;
                    return updated;
                });

                const username = remoteUsernameMap[id] || "A user";
                localStorage.setItem("duration", duration);
                setLeftUser(username + " left the call");
                setTimeout(() => setLeftUser(null), 2000);

                if (connections[id]) {
                    connections[id].close();
                    delete connections[id];
                }

                delete remoteUsernameMap[id];
            });

            // Handle new users joining
            socketRef.current.on(
                "user-joined",
                (joinedUser, { clients, clientsUsernames }) => {
                    const { id, username } = joinedUser;

                    clients.forEach((socketListId) => {
                        remoteUsernameMap[socketListId] =
                            clientsUsernames[socketListId];
                        connections[socketListId] = new RTCPeerConnection(
                            peerConfigConnections
                        );

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
                            let videoExists = videoRef.current.find(
                                (video) => video.socketId === socketListId
                            );

                            const isScreen =
                                event.stream.isScreenShare || false;

                            if (videoExists) {
                                setVideos((videos) => {
                                    const updatedVideos = videos.map((video) =>
                                        video.socketId === socketListId
                                            ? { ...video, stream: event.stream }
                                            : video
                                    );
                                    videoRef.current = updatedVideos;
                                    console.log(updatedVideos);
                                    return updatedVideos;
                                });
                            } else {
                                let newVideo = {
                                    socketId: socketListId,
                                    stream: event.stream,
                                    username: remoteUsernameMap[socketListId],
                                    isScreenShare: isScreen,
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

                        if (
                            window.localStream !== undefined &&
                            window.localStream !== null
                        ) {
                            connections[socketListId].addStream(
                                window.localStream
                            );
                        } else {
                            let blackSilence = (...args) =>
                                new MediaStream([black(...args), silence()]);
                            window.localStream = blackSilence();
                            connections[socketListId].addStream(
                                window.localStream
                            );
                        }
                    });

                    // Create offers to all other clients when joining
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

                            connections[id2]
                                .createOffer()
                                .then((description) => {
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
                                            console.log(
                                                "Error in join createOffer:",
                                                e
                                            )
                                        );
                                });
                        }
                    }
                }
            );
        });
    };

    // Handle WebRTC signaling
    const gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId]
                    .setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
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

            if (signal.ice) {
                connections[fromId]
                    .addIceCandidate(new RTCIceCandidate(signal.ice))
                    .catch((e) =>
                        console.log("Error adding ICE candidate:", e)
                    );
            }
        }
    };

    // UI control handlers
    const handleVideo = () => {
        setVideo(!video);
    };

    const handleAudio = () => {
        setAudio(!audio);
    };

    const handleScreen = () => {
        setScreen(!screen);
    };

    const handleEndCall = async () => {
        try {
            if (localVideoref.current?.srcObject) {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }

            Object.values(connections).forEach((conn) => conn.close());
            Object.keys(connections).forEach((key) => delete connections[key]);

            setVideos([]);
            videoRef.current = [];

            socketRef.current?.disconnect();

            remoteUsernameMap = {};
        } catch (e) {
            console.log("Error stopping tracks on end call:", e);
        }

        const meetCode = localStorage.getItem("meetCode");
        const duration = localStorage.getItem("duration");
        await saveMeetTime(username, meetCode, duration);

        setTimeout(() => {
            localStorage.getItem("token") ? navigate("/home") : navigate("/");
        }, 500);
    };

    // Join meeting
    const connect = () => {
        localStorage.setItem("username", username);
        // localStorage.setItem("meetCode", meetCode);
        setAskForUsername(false);
        getMedia();
    };

    const getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    const copyMeetingLink = () => {
        navigator.clipboard.writeText(`${stateRandomId}`);
    };

    // Chat functionality
    const openChat = () => {
        setModal(true);
        setNewMessages(0);
    };

    const closeChat = () => {
        setModal(false);
    };

    const handleMessage = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        if (message.trim() === "") return;
        socketRef.current.emit("chat-message", message, username);
        setMessage("");
    };

    // Add message to chat
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

        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    // Format time for chat messages
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Effect hooks
    useEffect(() => {
        getPermissions();
    }, []);

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen]);

    // Waiting room / username prompt
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

    return (
        <div className="video-meet-container">
            {/* Video Grid */}
            <div className="video-grid">
                {/* Local Video */}
                <div
                    className={`video-container ${
                        videos.length === 0 ? "col-span-full" : ""
                    }`}
                >
                    <video
                        ref={localVideoref}
                        autoPlay
                        muted
                        className={!video.isScreenShare ? "mirror" : ""}
                    ></video>
                    <div className="overlay-username">{username} (You)</div>
                </div>

                {/* Remote Videos */}
                {videos.map((video) => (
                    <div key={video.socketId} className="video-container">
                        <video
                            data-socket={video.socketId}
                            ref={(ref) => {
                                if (ref && video.stream) {
                                    ref.srcObject = video.stream;
                                }
                            }}
                            autoPlay
                            className={!video.isScreenShare ? "mirror" : ""}
                        ></video>
                        <div className="overlay-username">{video.username}</div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="controls-container">
                <button onClick={copyMeetingLink} className="control-button">
                    <ContentCopyIcon />
                </button>

                <button
                    onClick={handleVideo}
                    className={`control-button ${video ? "active" : ""}`}
                >
                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="control-button danger"
                >
                    <CallEndIcon />
                </button>

                <button
                    onClick={handleAudio}
                    className={`control-button ${audio ? "active" : ""}`}
                >
                    {audio ? <MicIcon /> : <MicOffIcon />}
                </button>

                {screenAvailable && (
                    <button
                        onClick={handleScreen}
                        className={`control-button ${screen ? "active" : ""}`}
                    >
                        {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                    </button>
                )}

                <button
                    onClick={() => setModal(!showModal)}
                    className="control-button relative"
                >
                    <ChatIcon />
                    {newMessages > 0 && (
                        <span className="new-message-badge">{newMessages}</span>
                    )}
                </button>
            </div>

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
                                        <div className={styles.messageSender}>
                                            {msg.sender}
                                        </div>
                                        <div className={styles.messageContent}>
                                            <span
                                                className={styles.messageText}
                                            >
                                                {msg.data}
                                            </span>
                                            {msg.timestamp && (
                                                <span
                                                    className={
                                                        styles.messageTime
                                                    }
                                                >
                                                    {formatTime(msg.timestamp)}
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
                            <IconButton onClick={sendMessage} color="primary">
                                <SendIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Snackbar for user left */}
            <Snackbar open={!!leftUser} autoHideDuration={3000}>
                <Alert severity="info" sx={{ width: "100%" }}>
                    {leftUser}
                </Alert>
            </Snackbar>
        </div>
    );
}
