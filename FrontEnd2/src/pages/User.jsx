import React, { useState } from "react";
import { Button, TextField, Avatar, IconButton } from "@mui/material";
import {
    Person as PersonIcon,
    History as HistoryIcon,
    Settings as SettingsIcon,
    Edit as EditIcon,
    VideoCall as VideoCallIcon,
    Timeline as TimelineIcon,
} from "@mui/icons-material";
import withAuth from "../utils/withAuth";
import "./User.css";

function User() {
    const [activeSection, setActiveSection] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "/path/to/default/avatar.png",
    });

    const menuItems = [
        {
            icon: <PersonIcon />,
            label: "Profile",
            key: "profile",
        },
        {
            icon: <HistoryIcon />,
            label: "Meeting History",
            key: "history",
        },
        {
            icon: <VideoCallIcon />,
            label: "Meeting Stats",
            key: "stats",
        },
        {
            icon: <SettingsIcon />,
            label: "Account Settings",
            key: "settings",
        },
    ];

    const meetingHistory = [
        {
            id: "1",
            date: "2024-03-15",
            duration: "45 min",
            participants: 5,
        },
        {
            id: "2",
            date: "2024-03-10",
            duration: "30 min",
            participants: 3,
        },
    ];

    const renderProfileSection = () => (
        <div className="userProfileSection">
            <div className="userProfileContentHeader">
                <h1>Personal Information</h1>
                <IconButton onClick={() => setIsEditing(!isEditing)}>
                    <EditIcon />
                </IconButton>
            </div>
            <form className="userProfileForm">
                <TextField
                    label="First Name"
                    value={userProfile.firstName}
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Last Name"
                    value={userProfile.lastName}
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Email"
                    value={userProfile.email}
                    disabled={!isEditing}
                    fullWidth
                />
                <TextField
                    label="Phone Number"
                    value={userProfile.phone}
                    disabled={!isEditing}
                    fullWidth
                />
            </form>
            {isEditing && (
                <div className="userProfileActions">
                    <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsEditing(false)}
                    >
                        Save Changes
                    </Button>
                </div>
            )}
        </div>
    );

    const renderMeetingHistory = () => (
        <div className="userProfileSection">
            <div className="userProfileContentHeader">
                <h1>Meeting History</h1>
            </div>
            <table className="meetingHistoryTable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Participants</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {meetingHistory.map((meeting) => (
                        <tr key={meeting.id} className="meetingHistoryTableRow">
                            <td>{meeting.date}</td>
                            <td>{meeting.duration}</td>
                            <td>{meeting.participants}</td>
                            <td>
                                <Button size="small">View Details</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderMeetingStats = () => (
        <div className="userProfileSection">
            <div className="userProfileContentHeader">
                <h1>Meeting Statistics</h1>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                }}
            >
                <div className="userStatCard">
                    <div className="userStatIcon">
                        <VideoCallIcon />
                    </div>
                    <div className="userStatContent">
                        <h3>12</h3>
                        <p>Total Meetings</p>
                    </div>
                </div>
                <div className="userStatCard">
                    <div className="userStatIcon">
                        <TimelineIcon />
                    </div>
                    <div className="userStatContent">
                        <h3>6h 45m</h3>
                        <p>Total Meeting Time</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAccountSettings = () => (
        <div className="userProfileSection">
            <div className="userProfileContentHeader">
                <h1>Account Settings</h1>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <Button variant="outlined" color="primary">
                    Change Password
                </Button>
                <Button variant="outlined" color="secondary">
                    Two-Factor Authentication
                </Button>
                <Button variant="outlined" color="error">
                    Delete Account
                </Button>
            </div>
        </div>
    );

    return (
        <div className="userProfilePage">
            <div className="userProfileSidebar">
                <Avatar
                    src={userProfile.avatar}
                    alt={`${userProfile.firstName} ${userProfile.lastName}`}
                    className="userProfileAvatar"
                />
                <h2 className="userProfileName">
                    {userProfile.firstName} {userProfile.lastName}
                </h2>
                <p className="userProfileEmail">{userProfile.email}</p>
                <div className="userProfileMenu">
                    {menuItems.map((item) => (
                        <div
                            key={item.key}
                            className={`userProfileMenuItem ${
                                activeSection === item.key ? "active" : ""
                            }`}
                            onClick={() => setActiveSection(item.key)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="userProfileContent">
                {activeSection === "profile" && renderProfileSection()}
                {activeSection === "history" && renderMeetingHistory()}
                {activeSection === "stats" && renderMeetingStats()}
                {activeSection === "settings" && renderAccountSettings()}
            </div>
        </div>
    );
}

export default User;
