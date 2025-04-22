import express from "express";
import { createServer } from "node:http";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/users.route.js";
import { Meeting } from "./models/meeting.model.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8080);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
    res.json({ Hello: "world" });
});

const start = async () => {
    const connectionDB = await mongoose.connect(
        "mongodb+srv://malkarroshan7:NiBcgQSsmSw3vjX6@cluster0.aqopn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(`Mongo Connected DB to Host: ${connectionDB.connection.host}`);
    server.listen(app.get("port"), () => {
        console.log("Listning on port 8000");
    });
};

start();

// mongodb+srv://malkarroshan7:<db_password>@cluster0.aqopn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0