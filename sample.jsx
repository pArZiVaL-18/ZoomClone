import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IconButton,
  TextField,
  Button,
  Badge,
  Tooltip,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";

// Material UI Icons
// import Tooltip from '@mui/material/Tooltip';
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

// Styles and Environment Settings
// import styles from "../styles/videoComponent.module.css";
import styles from "../styles/videoComponent.module.css";
import "./VideoMeet.css"; // Import the new CSS file
// import server from "../enviornment";

// Global Settings
const server_url = "http://localhost:4001";
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
let connections = {};

export default function VideoMeet() {
  // Refs
  const [leftUser, setLeftUser] = useState(null);
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
  let remoteUsernameMap = {};
  // UI State
  const [showModal, setModal] = useState(true);
  const [askForUsername, setAskForUsername] = useState(true);
  // const [username, setUsername] = useState("");
  const username = localStorage.getItem("username");

  // Chat State
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);

  // Navigation and Location
  // const location = useLocation();
  const { roomId } = useParams(); // Get meeting ID from state
  const meetingId = roomId;
  console.log(roomId);
  const navigate = useNavigate();
  // const { randomId: stateRandomId } = location.state || {};

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
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
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
            let tracks = localVideoref.current.srcObject.getTracks();
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
                      sdp: connections[id].localDescription,
                    })
                  );
                })
                .catch((e) =>
                  console.log("Error in track.onended setLocalDescription:", e)
                );
            });
          }
        })
    );
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
            console.log("Screen share setLocalDescription error:", e)
          );
      });
    }

    // Handle screen share ending
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
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
    } else {
      try {
        // Stop existing stream tracks
        window.localStream.getTracks().forEach((track) => track.stop());
      } catch (e) {
        console.log("Error stopping tracks for screen share:", e);
      }
    }
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
   * Creates a black video track by capturing a static canvas.
   *
   * @param {Object} [options] - Configuration options.
   * @param {number} [options.width=640] - The width of the canvas.
   * @param {number} [options.height=480] - The height of the canvas.
   * @returns {MediaStreamTrack} - A video track with a black frame, initially disabled.
   * @throws {Error} If the 2D context cannot be obtained.
   */
  const black = ({ width = 640, height = 480 } = {}) => {
    // Create and configure the canvas element.
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
      socketRef.current.emit("join-call", {
        path : window.location.href,
        username : username
    });
      socketIdRef.current = socketRef.current.id;

      // Setup chat message handler
      socketRef.current.on("chat-message", addMessage);

      // Handle users leaving
      socketRef.current.on("user-left", (id) => {
        // ✅ Remove from videos state
        setVideos((videos) => {
          const updated = videos.filter((video) => video.socketId !== id);
          videoRef.current = updated;
          return updated;
        });
        // Optional: Show username
  const username = remoteUsernameMap[id] || "A user";
  setLeftUser(username + " left the call");

  // Clear after 3s
  setTimeout(() => setLeftUser(null), 3000);
      
        // ✅ Close the peer connection
        if (connections[id]) {
          connections[id].close();
          delete connections[id];
        }
      
        // ✅ Remove from username map
        delete remoteUsernameMap[id];
      });
      
    //   socketRef.current.on("user-left", (id) => {
    //     setVideos((videos) => videos.filter((video) => video.socketId !== id));
    //   });

      // Handle new users joining
      socketRef.current.on("user-joined", (joinedUser, { clients, clientsUsernames }) => {
        const { id, username } = joinedUser;
        // if (id !== socketIdRef.current) {
        //     toast.success(${username} joined the meeting, {
        //       position: "top-right",
        //       autoClose: 3000,
        //     });
        //   }
        clients.forEach((socketListId) => {
          // ✅ Save each user's username for their socket ID
          remoteUsernameMap[socketListId] = clientsUsernames[socketListId];
      
          // Create new peer connection
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
      
          // ICE candidates
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };
      
          // When receiving stream from remote
          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );
      
            if (videoExists) {
              setVideos((videos) => {
                const updated = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updated;
                return updated;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                username: remoteUsernameMap[socketListId], // 👈 Display this on UI
                stream: event.stream,
              };
      
              setVideos((videos) => {
                const updated = [...videos, newVideo];
                videoRef.current = updated;
                return updated;
              });
            }
          };
      
          // Add local stream to connection
          if (window.localStream) {
            connections[socketListId].addStream(window.localStream);
          } else {
            const blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });
      
        // Send offer to all other users
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;
      
            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log("Error adding stream to connection:", e);
            }
      
            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description).then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({ sdp: connections[id2].localDescription })
                );
              });
            });
          }
        }
      });
      
    //   socketRef.current.on("user-joined", (joinedUser, clients) => {
    //     const { id, username } = joinedUser;
    //     clients.forEach((socketListId) => {
    //         remoteUsernameMap[socketListId] = clientsUsernames[socketListId]; // clientsUsernames is an object sent from server

    //       // Create new peer connection for each client
    //       connections[socketListId] = new RTCPeerConnection(
    //         peerConfigConnections
    //       );

    //       // Handle ICE candidates
    //       connections[socketListId].onicecandidate = function (event) {
    //         if (event.candidate != null) {
    //           socketRef.current.emit(
    //             "signal",
    //             socketListId,
    //             JSON.stringify({ ice: event.candidate })
    //           );
    //         }
    //       };

    //       // Handle incoming stream
    //       connections[socketListId].onaddstream = (event) => {
    //         // Check if video already exists
    //         let videoExists = videoRef.current.find(
    //           (video) => video.socketId === socketListId
    //         );

    //         if (videoExists) {
    //           // Update existing video stream
    //           setVideos((videos) => {
    //             const updatedVideos = videos.map((video) =>
    //               video.socketId === socketListId
    //                 ? { ...video, stream: event.stream }
    //                 : video
    //             );
    //             videoRef.current = updatedVideos;
    //             return updatedVideos;
    //           });
    //         } else {
    //           // Create new video
    //           let newVideo = {
    //             socketId: socketListId,
    //             username: remoteUsernameMap[socketListId],
    //             stream: event.stream,
    //             autoplay: true,
    //             playsinline: true,
    //           };

    //           setVideos((videos) => {
    //             const updatedVideos = [...videos, newVideo];
    //             videoRef.current = updatedVideos;
    //             return updatedVideos;
    //           });
    //         }
    //       };

    //       // Add local stream to connection
    //       if (window.localStream !== undefined && window.localStream !== null) {
    //         connections[socketListId].addStream(window.localStream);
    //       } else {
    //         // Use black/silent stream if no local stream
    //         let blackSilence = (...args) =>
    //           new MediaStream([black(...args), silence()]);
    //         window.localStream = blackSilence();
    //         connections[socketListId].addStream(window.localStream);
    //       }
    //     });

    //     // If this is our join event, create offers to all other clients
    //     if (id === socketIdRef.current) {
    //       for (let id2 in connections) {
    //         if (id2 === socketIdRef.current) continue;

    //         try {
    //           connections[id2].addStream(window.localStream);
    //         } catch (e) {
    //           console.log("Error adding stream to connection:", e);
    //         }

    //         // Create and send offers
    //         connections[id2].createOffer().then((description) => {
    //           connections[id2]
    //             .setLocalDescription(description)
    //             .then(() => {
    //               socketRef.current.emit(
    //                 "signal",
    //                 id2,
    //                 JSON.stringify({
    //                   sdp: connections[id2].localDescription,
    //                 })
    //               );
    //             })
    //             .catch((e) => console.log("Error in join createOffer:", e));
    //         });
    //       }
    //     }

    //   });
    });
  };
  console.log("Videos : ",videos);

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
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) =>
                      console.log("Error setting local description:", e)
                    );
                })
                .catch((e) => console.log("Error creating answer:", e));
            }
          })
          .catch((e) => console.log("Error setting remote description:", e));
      }

      // Add ICE candidate if received
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log("Error adding ICE candidate:", e));
      }
    }
  };

  // ******************************************
  // ********** UI CONTROL HANDLERS **********
  // ******************************************

  const handleVideo = () => {
    setVideo(!video);
    setVideoAvailable(!video);
  };

  const handleAudio = () => {
    setAudio(!audio);
    setAudioAvailable(!audio);
  };

  const handleScreen = () => {
    setScreen(!screen);
  };

//   const handleEndCall = () => {
//     try {
//       if (localVideoref.current?.srcObject) {
//         let tracks = localVideoref.current.srcObject.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     } catch (e) {
//       console.log("Error stopping tracks on end call:", e);
//     }

//     // Navigate back to home after a short delay
//     setTimeout(() => {
//       navigate("/profile");
//     }, 500);
//   };
const handleEndCall = () => {
    try {
      // Stop your local tracks
      if (localVideoref.current?.srcObject) {
        localVideoref.current.srcObject.getTracks().forEach((track) => track.stop());
      }
  
      // Close all peer connections
      Object.values(connections).forEach((conn) => conn.close());
      Object.keys(connections).forEach((key) => delete connections[key]);
  
      // Clear remote video UI
      setVideos([]);
      videoRef.current = [];
  
      // Disconnect socket
      socketRef.current?.disconnect();
  
      // Clear username map if you're using it
      remoteUsernameMap = {}; // or however you're storing it
  
    } catch (e) {
      console.log("Error during cleanup:", e);
    }
  
    // Navigate back after short delay
    setTimeout(() => {
      navigate("/profile");
    }, 500);
  };
  

  /**
   * Initialize media and join the meeting
   */
  const connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(${meetingId});
    // alert("Meeting link copied to clipboard!");
  };

  // ******************************************
  // ********** CHAT FUNCTIONALITY ***********
  // ******************************************

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
                Meeting ID : <span>{meetingId}</span>
              </h3>
              <Tooltip title="Copy meeting Code">
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
              className={video ? styles.activeControl : styles.inactiveControl}
            >
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton
              onClick={handleAudio}
              className={audio ? styles.activeControl : styles.inactiveControl}
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
              InputProps={{
                readOnly: true,
              }}
              // onChange={(e) => setUsername(e.target.value)}
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
//     <div className="video-meet-container">
//       {/*     Video Grid */}
//       {/* <div className="video-grid"> */}
//       {/* Local Video */}
//       {/* <div 
//         //             className={`video-container ${
//         //                 videos.length === 0 ? "col-span-full" : ""
//         //             }`}
//         //         >
//         //             <video ref={localVideoref} autoPlay muted></video>
//         //         </div>

//         //         {/* Remote Videos */}
//       {/* {videos.map((video) => ( */}
//       {/* //             <div key={video.socketId} className="video-container">
//         //                 <video
//         //                     data-socket={video.socketId}
//         //                     ref={(ref) => {
//         //                         if (ref && video.stream) {
//         //                             ref.srcObject = video.stream;
//         //                         }
//         //                     }}
//         //                     autoPlay
//         //                 ></video>
//         //             </div>
//         //         ))}
//         //     </div>*/}

//       {videos.length > 0 && (
//         <div className="remote-grid">
//           {videos.map((video) => (
//             <div key={video.socketId} className="remote-video">
//               <video
//                 data-socket={video.socketId}
//                 ref={(ref) => {
//                   if (ref && video.stream) {
//                     ref.srcObject = video.stream;
//                   }
//                 }}
//                 autoPlay
//               ></video>
//               <div className="username-overlay">{video.username}</div>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* Local video */}
//       <div
//         className={`local-video ${
//           videos.length === 0 ? "full-screen" : "small-corner"
//         }`}
//       >
//         <video ref={localVideoref} autoPlay muted></video>
//         <div className="username-overlay">{username}</div>
//       </div>


//       {/* Controls */}
//       <div className="controls-container">
//         <span></span>
//         <Tooltip title="Copy meeting Code">
//           <button onClick={copyMeetingLink} className="control-button">
//             <ContentCopyIcon />
//           </button>
//         </Tooltip>

//         <button
//           onClick={handleVideo}
//           className={control-button ${video ? "active" : ""}}
//         >
//           {video ? <VideocamIcon /> : <VideocamOffIcon />}
//         </button>

//         <button onClick={handleEndCall} className="control-button danger">
//           <CallEndIcon />
//         </button>

//         <button
//           onClick={handleAudio}
//           className={control-button ${audio ? "active" : ""}}
//         >
//           {audio ? <MicIcon /> : <MicOffIcon />}
//         </button>

//         {screenAvailable && (
//           <Tooltip title="Share Screen">
//             <button
//               onClick={handleScreen}
//               className={control-button ${screen ? "active" : ""}}
//             >
//               {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
//             </button>
//           </Tooltip>
//         )}

//         <button
//           onClick={() => setModal(!showModal)}
//           className="control-button relative"
//         >
//           <ChatIcon />
//           {newMessages > 0 && (
//             <span className="new-message-badge">{newMessages}</span>
//           )}
//         </button>
//       </div>

//       {/* Chat Panel */}
//       {showModal && (
//         <div className={styles.chatRoom}>
//           <div className={styles.chatContainer}>
//             <h3>Chat</h3>
//             <div className={styles.chattingDisplay} ref={chatDisplayRef}>
//               {messages.length > 0 ? (
//                 messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`${styles.messageItem} ${
//                       msg.type === socketIdRef.current
//                         ? styles.myMessage
//                         : msg.type === "system"
//                         ? styles.systemMessage
//                         : styles.otherMessage
//                     }`}
//                   >
//                     <div className={styles.messageSender}>{msg.sender}</div>
//                     <div className={styles.messageContent}>
//                       <span className={styles.messageText}>{msg.data}</span>
//                       {msg.timestamp && (
//                         <span className={styles.messageTime}>
//                           {formatTime(msg.timestamp)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className={styles.noMessages}>No messages yet</p>
//               )}
//             </div>
//             <div className={styles.chattingArea}>
//               <TextField
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 variant="outlined"
//                 fullWidth
//                 onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//               />
//               <IconButton onClick={sendMessage} color="primary">
//                 <SendIcon />
//               </IconButton>
//             </div>
//           </div>
//         </div>
//       )}
//       <Snackbar open={!!leftUser} autoHideDuration={3000}>
//   <Alert severity="info" sx={{ width: "100%" }}>
//     {leftUser}
//   </Alert>
// </Snackbar>

//     </div>
<div className="meet-app">
  {/* Video Grid */}
  <div className="video-section">
    <div className="video-grid">
      {/* Remote videos */}
      {videos.map((video) => (
        <div key={video.socketId} className="video-tile">
          <video
            data-socket={video.socketId}
            ref={(ref) => {
              if (ref && video.stream) {
                ref.srcObject = video.stream;
              }
            }}
            autoPlay
          />
          <div className="overlay-username">{video.username}</div>
        </div>
      ))}

      {/* Local video */}
      <div
        className={`video-tile local ${
          videos.length === 0 ? "full" : "corner"
        }`}
      >
        <video ref={localVideoref} autoPlay muted />
        <div className="overlay-username">{username}</div>
      </div>
    </div>
  </div>

  {/* Bottom Controls */}
  <div className="bottom-controls">
    <Tooltip title="Copy Meeting Link">
      <button onClick={copyMeetingLink} className="control-btn">
        <ContentCopyIcon />
      </button>
    </Tooltip>

    <button
      onClick={handleVideo}
      className={control-btn ${video ? "active" : ""}}
    >
      {video ? <VideocamIcon /> : <VideocamOffIcon />}
    </button>

    <button onClick={handleEndCall} className="control-btn danger">
      <CallEndIcon />
    </button>

    <button
      onClick={handleAudio}
      className={control-btn ${audio ? "active" : ""}}
    >
      {audio ? <MicIcon /> : <MicOffIcon />}
    </button>

    {screenAvailable && (
      <Tooltip title="Share Screen">
        <button
          onClick={handleScreen}
          className={control-btn ${screen ? "active" : ""}}
        >
          {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        </button>
      </Tooltip>
    )}

    <button
      onClick={() => setModal(!showModal)}
      className="control-btn relative"
    >
      <ChatIcon />
      {newMessages > 0 && (
        <span className="chat-badge">{newMessages}</span>
      )}
    </button>
  </div>

  {/* Chat Panel */}
  {showModal && (
    <div className="chat-panel">
      <div className="chat-content">
        <h3>Chat</h3>
        <div className="chat-messages" ref={chatDisplayRef}>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message-item ${
                  msg.type === socketIdRef.current
                    ? "my-msg"
                    : msg.type === "system"
                    ? "sys-msg"
                    : "other-msg"
                }`}
              >
                <div className="sender">{msg.sender}</div>
                <div className="content">
                  <span>{msg.data}</span>
                  {msg.timestamp && (
                    <span className="timestamp">
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-msg">No messages yet</p>
          )}
        </div>
        <div className="chat-input">
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            fullWidth
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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