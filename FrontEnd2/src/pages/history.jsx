// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Card from "@mui/material/Card";
// import Box from "@mui/material/Box";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import HomeIcon from "@mui/icons-material/Home";
// import "./history.css";

// import { IconButton } from "@mui/material";
// export default function History() {
//     const { getHistoryOfUser } = useContext(AuthContext);

//     const [meetings, setMeetings] = useState([]);

//     const routeTo = useNavigate();

//     useEffect(() => {
//         const fetchHistory = async () => {
//             try {
//                 const history = await getHistoryOfUser();
//                 setMeetings(history);
//             } catch {
//                 // IMPLEMENT SNACKBAR
//             }
//         };

//         fetchHistory();
//     }, []);

//     let formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, "0");
//         const month = (date.getMonth() + 1).toString().padStart(2, "0");
//         const year = date.getFullYear();

//         return `${day}/${month}/${year}`;
//     };

//     return (
//         <div>
//             <IconButton
//                 onClick={() => {
//                     routeTo("/home");
//                 }}
//             >
//                 <HomeIcon />
//             </IconButton>
//             {meetings.length !== 0 ? (
//                 meetings.map((e, i) => {
//                     return (
//                         <Card key={i} variant="outlined">
//                             <CardContent>
//                                 <Typography
//                                     sx={{ fontSize: 14 }}
//                                     color="text.secondary"
//                                     gutterBottom
//                                 >
//                                     Code: {e.meetingCode}
//                                 </Typography>

//                                 <Typography
//                                     sx={{ mb: 1.5 }}
//                                     color="text.secondary"
//                                 >
//                                     Date: {formatDate(e.date)}
//                                 </Typography>

//                                 <Typography color="text.secondary">
//                                     Start Time: {e.startTime}
//                                     {console.log(e.startTime)}
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     );
//                 })
//             ) : (
//                 <Typography>No meeting history available.</Typography>
//             )}
//         </div>
//     );
// }
// history.jsx
// history.jsx
import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    IconButton,
    Tooltip,
    Avatar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import {
    VideoCall as VideoCallIcon,
    Home as HomeIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Download as DownloadIcon,
    CallReceived as IncomingIcon,
    CallMade as OutgoingIcon,
    Logout as LogoutIcon,
    Link as LinkIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./history.css";

function History() {
    const navigate = useNavigate();
    const { user2, logout, getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history || []);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    const filteredMeetings = meetings.filter((meeting) => {
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
            {/* Header */}
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
                    {/* <Button
                        variant="contained"
                        startIcon={<VideoCallIcon />}
                        className="new-meeting-btn"
                        onClick={handleNewMeeting}
                    >
                        New Meeting
                    </Button> */}
                    <Tooltip title="Logout">
                        <IconButton onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </header>

            {/* Controls */}
            <div className="history-controls">
                {/* <TextField
                    placeholder="Search by meeting code"
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                /> */}

                <div className="control-buttons">
                    {/* <Button 
                        variant="outlined" 
                        startIcon={<DownloadIcon />}
                        className="export-button"
                     >
                        Export
                    </Button> */}

                    {/* <FormControl size="small" className="filter-control">
                        <InputLabel id="filter-label">Filter</InputLabel>
                        <Select
                            labelId="filter-label"
                            value={filter}
                            label="Filter"
                            onChange={(e) => setFilter(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <FilterIcon />
                                </InputAdornment>
                            }
                        >
                            <MenuItem value="all">All Meetings</MenuItem>
                            <MenuItem value="incoming">Incoming</MenuItem>
                            <MenuItem value="outgoing">Outgoing</MenuItem>
                        </Select>
                    </FormControl> */}
                </div>
            </div>

            {/* Table */}
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
                        {filteredMeetings.length > 0 ? (
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
