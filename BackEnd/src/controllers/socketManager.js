import { Server, Socket } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};
let userNames = {};

const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("join-call", (path, username) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            connections[path].push(socket.id);

            timeOnline[socket.id] = new Date();
            // userNames[socket.id] = username;

            // const clientUsernames = {};
            // connections[path].forEach((id) => {
            //     clientUsernames[id] = userNames[id];
            // });

            // for (let i = 0; i < connections[path].length; i++) {
            //     io.to(connections[path][i]).emit(
            //         "user-joined",
            //         socket.id,
            //         connections[path],
            //         clientUsernames
            //     );
            // }

            // const clientUsernames = {};
            // connections[path].forEach((id) => {
            //     clientUsernames[id] = userNames[id];
            // })

            for (let i = 0; i < connections[path].length; i++) {
                io.to(connections[path][i]).emit(
                    "user-joined",
                    socket.id,
                    connections[path],
                );
            }

            if (messages[path] !== undefined) {
                for (let i = 0; i < messages[path].length; ++i) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path][i]["data"],
                        messages[path][i]["sender"],
                        messages[path][i]["socket-id-sender"]
                    );
                }
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];
                },
                ["", false]
            );

            if (found === true) {
                if (messages[matchingRoom] == undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({
                    sender: sender,
                    data: data,
                    "socket-id-sender": socket.id,
                });
                console.log("message", matchingRoom, " : ", sender, data);
            }

            connections[matchingRoom].forEach((element) => {
                io.to(element).emit("chat-message", data, sender, socket.id);
            });
        });

        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());

            var key;

            for (const [k, v] of JSON.parse(
                JSON.stringify(Object.entries(connections))
            )) {
                for (let a = 0; a < v.length; ++a) {
                    if (v[a] == socket.id) {
                        key = k;

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit(
                                "user-left",
                                socket.id
                            );
                        }

                        var index = connections[key].indexOf(socket.id);

                        connections[key].splice(index, 1);
                        // delete userNames[socket.id];

                        if (connections[key].length === 0) {
                            delete connections[key];
                        }
                    }
                }
            }
        });
    });

    return io;
};

export default connectToSocket;


// import { Server, Socket } from "socket.io";

// let connections = {};
// let messages = {};
// let timeOnline = {};
// let userNames = {};

// const connectToSocket = (server) => {
//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"],
//             allowedHeaders: ["*"],
//             credentials: true,
//         },
//     });

//     io.on("connection", (socket) => {
//         // Handle user joining a call
//         socket.on("join-call", ({path,username}) => {
//             try {
//                 if (connections[path] === undefined) {
//                     connections[path] = [];
//                 }

//                 connections[path].push(socket.id);
//                 timeOnline[socket.id] = new Date();
//                 userNames[socket.id]=username;

//                 const clientUsernames = {};
//                 connections[path].forEach((id)=>{
//                     clientUsernames[id]=userNames[id]
//                 });


//                 // Notify all participants that a new user has joined
//                 for (let i = 0; i < connections[path].length; i++) {
//                     io.to(connections[path][i]).emit(
//                         "user-joined",
//                         socket.id,
//                         connections,
//                         clientUsernames,
//                     );
//                 }
//                 // connections[path].forEach((socketId) => {
//                 //     io.to(socketId).emit(
//                 //         "user-joined",
//                 //         socket.id,
//                 //         connections[path]
//                 //     );
//                 // });

//                 // If there is existing chat history, send it to the new user
//                 if (messages[path] !== undefined) {
//                     messages[path].forEach((msg) => {
//                         io.to(socket.id).emit(
//                             "chat-message",
//                             msg.data,
//                             msg.sender,
//                             msg["socket-id-sender"]
//                         );
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error in join-call event:", error);
//             }
//         });
//         // socket.on("join-call", ({ path, username }) => {
//         //     if (connections[path] === undefined) {
//         //       connections[path] = [];
//         //     }
      
//         //     connections[path].push(socket.id);
//         //     timeOnline[socket.id] = new Date();
//         //     userNames[socket.id] = username;
      
//         //     // 👇 Send updated response with usernames
//         //     const clientUsernames = {};
//         //     connections[path].forEach((id) => {
//         //       clientUsernames[id] = userNames[id];
//         //     });
      
//         //     for (let i = 0; i < connections[path].length; i++) {
//         //       io.to(connections[path][i]).emit(
//         //         "user-joined",
//         //         { id: socket.id },
//         //         {
//         //           clients: connections[path],
//         //           clientsUsernames: clientUsernames,
//         //         } 
//         //       );
//         //     }
      
//         //     if (messages[path] !== undefined) {
//         //       for (let i = 0; i < messages[path].length; ++i) {
//         //         io.to(socket.id).emit(
//         //           "chat-message",
//         //           messages[path][i]["data"],
//         //           messages[path][i]["sender"],
//         //           messages[path][i]["socket-id-sender"]
//         //         );
//         //       }
//         //     }
//         //   });
//         // Handle signaling messages for WebRTC
//         socket.on("signal", (toId, message) => {
//             try {
//                 io.to(toId).emit("signal", socket.id, message);
//             } catch (error) {
//                 console.error("Error in signal event:", error);
//             }
//         });

//         // Handle chat messages
//         socket.on("chat-message", (data, sender) => {
//             try {
//                 // Determine which room the socket belongs to
//                 const [matchingRoom, found] = Object.entries(
//                     connections
//                 ).reduce(
//                     ([room, isFound], [roomKey, roomValue]) => {
//                         if (!isFound && roomValue.includes(socket.id)) {
//                             return [roomKey, true];
//                         }
//                         return [room, isFound];
//                     },
//                     ["", false]
//                 );

//                 if (found === true) {
//                     if (messages[matchingRoom] === undefined) {
//                         messages[matchingRoom] = [];
//                     }

//                     const msgObj = {
//                         sender: sender,
//                         data: data,
//                         "socket-id-sender": socket.id,
//                     };

//                     messages[matchingRoom].push(msgObj);
//                     console.log("message", matchingRoom, ":", sender, data);

//                     // Broadcast the chat message to all participants in the room
//                     connections[matchingRoom].forEach((socketId) => {
//                         io.to(socketId).emit(
//                             "chat-message",
//                             data,
//                             sender,
//                             socket.id
//                         );
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error in chat-message event:", error);
//             }
//         });

//         // Handle disconnections
//         socket.on("disconnect", () => {
//             try {
//                 const diffTime = Math.abs(timeOnline[socket.id] - new Date());
//                 let roomKeyFound;

//                 // Find the room that the disconnected socket was part of
//                 for (const [roomKey, socketIds] of Object.entries(
//                     connections
//                 )) {
//                     if (socketIds.includes(socket.id)) {
//                         roomKeyFound = roomKey;
//                         // Inform remaining participants that the user has left
//                         socketIds.forEach((socketId) => {
//                             io.to(socketId).emit("user-left", socket.id);
//                         });

//                         // Remove the socket from the room
//                         const index = socketIds.indexOf(socket.id);
//                         if (index !== -1) {
//                             socketIds.splice(index, 1);
//                         }

//                         // Clean up if the room is empty
//                         if (socketIds.length === 0) {
//                             delete connections[roomKey];
//                         }
//                         break;
//                     }
//                 }
//                 // Clean up the online time record
//                 delete timeOnline[socket.id];
//             } catch (error) {
//                 console.error("Error in disconnect event:", error);
//             }
//         });
//     });

//     return io;
// };

// export default connectToSocket;

// // import { Server } from "socket.io";
// // import { createLogger } from "winston"; // Recommended logging library

// // // Create a robust logger
// // const logger = createLogger({
// //     level: "info",
// //     format: winston.format.combine(
// //         winston.format.timestamp(),
// //         winston.format.json()
// //     ),
// //     transports: [
// //         new winston.transports.Console(),
// //         new winston.transports.File({ filename: "socket-errors.log" }),
// //     ],
// // });

// // // Error handling utility
// // class SocketErrorHandler {
// //     /**
// //      * Log socket-related errors
// //      * @param {string} type - Type of error
// //      * @param {Object} error - Error object
// //      * @param {Object} context - Additional context
// //      */
// //     static logError(type, error, context = {}) {
// //         logger.error(`${type} Error`, {
// //             message: error.message,
// //             stack: error.stack,
// //             ...context,
// //         });
// //     }

// //     /**
// //      * Handle critical socket errors
// //      * @param {Socket} socket - Socket instance
// //      * @param {Error} error - Error object
// //      */
// //     static handleCriticalError(socket, error) {
// //         this.logError("Critical Socket", error, {
// //             socketId: socket.id,
// //         });

// //         // Potential advanced error handling
// //         socket.emit("server-error", {
// //             type: "critical",
// //             message: "An unexpected server error occurred",
// //         });

// //         // Optionally disconnect problematic socket
// //         socket.disconnect(true);
// //     }
// // }

// // const connectToSocket = (server) => {
// //     const io = new Server(server, {
// //         cors: {
// //             origin: "*",
// //             methods: ["GET", "POST"],
// //             allowedHeaders: ["*"],
// //             credentials: true,
// //         },
// //         // Enhanced connection settings
// //         pingTimeout: 60000,
// //         pingInterval: 25000,
// //     });

// //     let connections = {};
// //     let messages = {};
// //     let timeOnline = {};

// //     // Global socket middleware for error handling
// //     io.use((socket, next) => {
// //         // Add error handling to each socket
// //         socket.on("error", (error) => {
// //             SocketErrorHandler.handleCriticalError(socket, error);
// //         });

// //         // Rate limiting and security checks
// //         if (Object.keys(connections).length > 100) {
// //             return next(new Error("Server capacity reached"));
// //         }

// //         next();
// //     });

// //     io.on("connection", (socket) => {
// //         // Wrap critical socket events in try-catch
// //         socket.on("join-call", (path) => {
// //             try {
// //                 // Validate input
// //                 if (!path || typeof path !== "string") {
// //                     throw new Error("Invalid meeting path");
// //                 }

// //                 // Existing join-call logic with added validation
// //                 if (connections[path] === undefined) {
// //                     connections[path] = [];
// //                 }

// //                 // Prevent duplicate joins
// //                 if (connections[path].includes(socket.id)) {
// //                     throw new Error("Already joined this call");
// //                 }

// //                 connections[path].push(socket.id);
// //                 timeOnline[socket.id] = new Date();

// //                 // Broadcast join with additional safety checks
// //                 connections[path].forEach((participant) => {
// //                     try {
// //                         io.to(participant).emit(
// //                             "user-joined",
// //                             socket.id,
// //                             connections[path]
// //                         );
// //                     } catch (broadcastError) {
// //                         SocketErrorHandler.logError(
// //                             "Broadcast",
// //                             broadcastError,
// //                             {
// //                                 participant,
// //                                 meetingPath: path,
// //                             }
// //                         );
// //                     }
// //                 });

// //                 // Handle message history with error protection
// //                 if (messages[path]) {
// //                     messages[path].slice(-50).forEach((message) => {
// //                         try {
// //                             io.to(socket.id).emit(
// //                                 "chat-message",
// //                                 message.data,
// //                                 message.sender,
// //                                 message["socket-id-sender"]
// //                             );
// //                         } catch (historyError) {
// //                             SocketErrorHandler.logError(
// //                                 "Message History",
// //                                 historyError
// //                             );
// //                         }
// //                     });
// //                 }
// //             } catch (error) {
// //                 SocketErrorHandler.handleCriticalError(socket, error);
// //             }
// //         });

// //         // Enhanced signal handling with error management
// //         socket.on("signal", (toId, message) => {
// //             try {
// //                 // Validate inputs
// //                 if (!toId || !message) {
// //                     throw new Error("Invalid signaling data");
// //                 }

// //                 // Additional security check
// //                 if (typeof message !== "string") {
// //                     throw new Error("Malformed signal message");
// //                 }

// //                 io.to(toId).emit("signal", socket.id, message);
// //             } catch (error) {
// //                 SocketErrorHandler.logError("Signaling", error, {
// //                     toId,
// //                     messageLength: message?.length,
// //                 });
// //             }
// //         });

// //         // Robust chat message handling
// //         socket.on("chat-message", (data, sender) => {
// //             try {
// //                 // Input validation
// //                 if (!data || !sender) {
// //                     throw new Error("Invalid chat message");
// //                 }

// //                 // Find the room for this socket
// //                 const [matchingRoom] =
// //                     Object.entries(connections).find(([, clients]) =>
// //                         clients.includes(socket.id)
// //                     ) || [];

// //                 if (!matchingRoom) {
// //                     throw new Error("No matching room found");
// //                 }

// //                 // Initialize room messages if not exists
// //                 messages[matchingRoom] = messages[matchingRoom] || [];

// //                 // Limit message history
// //                 if (messages[matchingRoom].length > 100) {
// //                     messages[matchingRoom].shift();
// //                 }

// //                 // Store message
// //                 messages[matchingRoom].push({
// //                     sender: sender,
// //                     data: data,
// //                     "socket-id-sender": socket.id,
// //                     timestamp: new Date(),
// //                 });

// //                 // Broadcast message with error handling
// //                 connections[matchingRoom].forEach((element) => {
// //                     try {
// //                         io.to(element).emit(
// //                             "chat-message",
// //                             data,
// //                             sender,
// //                             socket.id
// //                         );
// //                     } catch (broadcastError) {
// //                         SocketErrorHandler.logError(
// //                             "Chat Broadcast",
// //                             broadcastError,
// //                             {
// //                                 recipient: element,
// //                             }
// //                         );
// //                     }
// //                 });
// //             } catch (error) {
// //                 SocketErrorHandler.logError("Chat Message", error);
// //             }
// //         });

// //         // Enhanced disconnect handling
// //         socket.on("disconnect", () => {
// //             try {
// //                 const disconnectTime = new Date();
// //                 const onlineTime = timeOnline[socket.id]
// //                     ? Math.abs(disconnectTime - timeOnline[socket.id])
// //                     : 0;

// //                 // Log disconnect details
// //                 logger.info("Socket Disconnected", {
// //                     socketId: socket.id,
// //                     onlineTime: onlineTime,
// //                 });

// //                 // Remove socket from all rooms
// //                 Object.entries(connections).forEach(
// //                     ([roomKey, roomClients]) => {
// //                         const index = roomClients.indexOf(socket.id);
// //                         if (index !== -1) {
// //                             roomClients.splice(index, 1);

// //                             // Notify other room members
// //                             roomClients.forEach((client) => {
// //                                 try {
// //                                     io.to(client).emit("user-left", socket.id);
// //                                 } catch (notifyError) {
// //                                     SocketErrorHandler.logError(
// //                                         "Disconnect Notify",
// //                                         notifyError
// //                                     );
// //                                 }
// //                             });

// //                             // Clean up empty rooms
// //                             if (roomClients.length === 0) {
// //                                 delete connections[roomKey];
// //                                 delete messages[roomKey];
// //                             }
// //                         }
// //                     }
// //                 );

// //                 // Clean up online time tracking
// //                 delete timeOnline[socket.id];
// //             } catch (error) {
// //                 SocketErrorHandler.handleCriticalError(socket, error);
// //             }
// //         });
// //     });

// //     return io;
// // };

// // export default connectToSocket;
