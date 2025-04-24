import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    IconButton,
    Tooltip,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {
    VideoCall as VideoCallIcon,
    Home as HomeIcon,
    Logout as LogoutIcon,
    Link as LinkIcon,
    CallReceived as IncomingIcon,
    CallMade as OutgoingIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./history.css";

function History() {
    const navigate = useNavigate();
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    // Fetch meeting history on component mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history.length !== 0 ? history : []);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    const filteredMeetings = meetings?.filter((meeting) => {
        const matchesSearch = meeting.meetingCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" || meeting.type === filter;
        return matchesSearch && matchesFilter;
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleNewMeeting = () => {
        const randomId = Math.random().toString(36).substring(7);
        navigate(`/${randomId}`);
    };

    // Format date to a readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="history-container">
            {/* Header section */}
            <header className="history-header">
                <div className="header-left">
                    <IconButton onClick={() => navigate("/home")}>
                        <HomeIcon />
                    </IconButton>
                    <h1>
                        Meeting History{" "}
                        <span>({meetings.length} Meetings)</span>
                    </h1>
                </div>
                <div className="header-right">
                    <Tooltip title="Logout">
                        <IconButton onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </header>

            <div className="history-controls">
                <div className="control-buttons"></div>
            </div>

            {/* Meetings table */}
            <TableContainer component={Paper} className="history-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Meeting Code</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMeetings.length !== 0 ? (
                            filteredMeetings.map((meeting) => (
                                <TableRow key={meeting.meetingCode}>
                                    <TableCell>
                                        <div className="meeting-code">
                                            <LinkIcon
                                                sx={{
                                                    fontSize: 16,
                                                    marginRight: 1,
                                                }}
                                            />
                                            {meeting.meetingCode}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className={`meeting-type ${
                                                meeting.type || "outgoing"
                                            }`}
                                        >
                                            {meeting.type === "incoming" ? (
                                                <IncomingIcon />
                                            ) : (
                                                <OutgoingIcon />
                                            )}
                                            {meeting.type
                                                ? meeting.type
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  meeting.type.slice(1)
                                                : "Outgoing"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(meeting.date).split(",")[0]}
                                    </TableCell>
                                    <TableCell>{meeting.startTime}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Join Meeting">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/${meeting.meetingCode}`
                                                    )
                                                }
                                            >
                                                <VideoCallIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        No meeting history available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default History;
