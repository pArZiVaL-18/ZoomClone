import mongoose, { Schema } from "mongoose";

// const meetingSchema = new Schema({
//     user_id: { type: String },
//     meetingCode: { type: String, required: true },
//     date: { type: Date, default: Date.now, required: true },
// });

const meetingSchema = new Schema({
    user_id: { type: String },
    meetingCode: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    startTime: { type: String, required: true }, // e.g., "14:30"
    attendees: [{ type: String, required: true }], // Array of user IDs or emails
});

// const meetingSchema = new Schema({
//     user_id: { type: String }, // Meeting creator
//     meetingCode: { type: String, required: true }, // Unique meeting code
//     date: { type: Date, default: Date.now, required: true },
//     attendees: [{ type: String, required: true }], // Stores user IDs or usernames
//     joinedUsers: [{ type: String }], // 🆕 Stores users who attended at any time
// });


const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
