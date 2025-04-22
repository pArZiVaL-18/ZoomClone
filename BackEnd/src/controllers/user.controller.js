import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";
import { CLIENT_RENEG_LIMIT } from "tls";

const login = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "Please provide" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "User Not Found" });
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
        } else {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ message: "Invalid Username or Password" });
        }
    } catch (e) {
        return res.status(500).json({ message: `Something Went Wrong ${e}` });
    }
};

const register = async (req, res) => {
    const { name, username, email, password } = req.body;
    console.log("in registerj controller", name, username, email, password);
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res
                .status(httpStatus.FOUND)
                .json({ message: `User already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("In register function ", username, email);
        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
        });

        console.log("User schema paths:", User.schema.paths);

        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: `User Registered` });
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` });
    }
};

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        console.log(user + "hit");
        const meetings = await Meeting.find({ user_id: user.username });
        console.log(meetings + " hit2");
        res.json(meetings);
    } catch (e) {
        console.log("hit3");
        res.json({ message: `Something went wrong ${e}` });
    }
};

const addToHistory = async (req, res) => {
    const { token, meeting_code, startTime } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code,
            startTime: startTime,
        });

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({
            message: "Added code to history",
        });
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` });
    }
};

const markUserAsAttended = async (req, res) => {
    const { meetingCode, user_id } = req.body;

    if (!meetingCode || !user_id) {
        return res
            .status(400)
            .json({ message: "Meeting code and user ID are required" });
    }

    try {
        // ✅ Find existing meeting by meetingCode
        let meeting = await Meeting.findOne({ meetingCode });

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        // ✅ Add user to attendedUsers only if not already present
        if (!meeting.attendedUsers.includes(user_id)) {
            meeting.attendedUsers.push(user_id);
            await meeting.save();
        }

        res.status(httpStatus.OK).json({
            message: "User marked as attended",
            meeting,
        });
    } catch (error) {
        console.error("Error updating attended users:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export { login, register, getUserHistory, addToHistory, markUserAsAttended };

// import httpStatus from "http-status";
// import { User } from "../models/user.model.js";
// import bcrypt, { hash } from "bcrypt";
// import crypto from "crypto";
// import { Meeting } from "../models/meeting.model.js";

// const login = async (req, res) => {
//     const { username, email, password } = req.body;

//     if (!username || !password || !email) {
//         return res.status(400).json({ message: "Please provide" });
//     }

//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res
//                 .status(httpStatus.NOT_FOUND)
//                 .json({ message: "User Not Found" });
//         }

//         let isPasswordCorrect = await bcrypt.compare(password, user.password);

//         if (isPasswordCorrect) {
//             let token = crypto.randomBytes(20).toString("hex");
//             user.token = token;
//             await user.save();
//             return res.status(httpStatus.OK).json({ token: token });
//         } else {
//             return res
//                 .status(httpStatus.UNAUTHORIZED)
//                 .json({ message: "Invalid Username or Password" });
//         }
//     } catch (e) {
//         return res.status(500).json({ message: `Something Went Wrong ${e}` });
//     }
// };

// const register = async (req, res) => {
//     const { name, username, email, password } = req.body;
//     console.log("in registerj controller", name, username, email, password);
//     try {
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res
//                 .status(httpStatus.FOUND)
//                 .json({ message: `User already exists` });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         console.log("In register function ", username, email);
//         const newUser = new User({
//             name: name,
//             username: username,
//             email: email,
//             password: hashedPassword,
//         });

//         console.log("User schema paths:", User.schema.paths);

//         await newUser.save();
//         res.status(httpStatus.CREATED).json({ message: `User Registered` });
//     } catch (e) {
//         res.json({ message: `Something went wrong ${e}` });
//     }
// };

// const getUserHistory = async (req, res) => {
//     console.log("hit1");
//     const { username } = req.query;
//     console.log(username);

//     try {
//         // const user = await User.findOne({ user_id: token });
//         const meetings = await Meeting.find({ user_id: username });
//         console.log(meetings);
//         res.json(meetings);
//     } catch (e) {
//         console.log("hiit");
//         res.json({ message: `Something went wrong ${e}` });
//     }
// };

// const addToHistory = async (req, res) => {
//     const { token, meeting_code, startTime } = req.body;

//     try {
//         const user = await User.findOne({ token: token });

//         const newMeeting = new Meeting({
//             user_id: user.username,
//             meetingCode: meeting_code,
//             startTime: startTime,
//         });

//         await newMeeting.save();

//         res.status(httpStatus.CREATED).json({
//             message: "Added code to history",
//         });
//     } catch (e) {
//         res.json({ message: `Something went wrong ${e}` });
//     }
// };

// const markUserAsAttended = async (req, res) => {
//     const { meetingCode, user_id } = req.body;

//     if (!meetingCode || !user_id) {
//         return res
//             .status(400)
//             .json({ message: "Meeting code and user ID are required" });
//     }

//     try {
//         // ✅ Find existing meeting by meetingCode
//         let meeting = await Meeting.findOne({ meetingCode });

//         if (!meeting) {
//             return res.status(404).json({ message: "Meeting not found" });
//         }

//         // ✅ Add user to attendedUsers only if not already present
//         if (!meeting.attendedUsers.includes(user_id)) {
//             meeting.attendedUsers.push(user_id);
//             await meeting.save();
//         }

//         res.status(httpStatus.OK).json({
//             message: "User marked as attended",
//             meeting,
//         });
//     } catch (error) {
//         console.error("Error updating attended users:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// };

// export { login, register, getUserHistory, addToHistory, markUserAsAttended };
