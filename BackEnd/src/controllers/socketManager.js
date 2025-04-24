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
        socket.on("join-call", ({ path, username }) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }

            connections[path].push(socket.id);

            timeOnline[socket.id] = new Date();
            userNames[socket.id] = username;

            const clientUsernames = {};
            connections[path].forEach((id) => {
                clientUsernames[id] = userNames[id];
            });

            for (let i = 0; i < connections[path].length; i++) {
                io.to(connections[path][i]).emit(
                    "user-joined",
                    { joinedUser: socket.id, username },
                    {
                        clients: connections[path],
                        clientsUsernames: clientUsernames,
                    }
                );
            }

            // for (let i = 0; i < connections[path].length; i++) {
            //     io.to(connections[path][i]).emit(
            //         "user-joined",
            //         socket.id,
            //         connections[path],
            //     );
            // }

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
                        delete userNames[socket.id];

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

