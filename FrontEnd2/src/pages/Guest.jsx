import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LoginIcon from "@mui/icons-material/Login";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    Fade,
    Divider,
} from "@mui/material";

export default function Guest() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    const handleJoinVideoCall = () => {
        if (meetingCode.trim()) {
            navigate(`/${meetingCode}`);
        }
    };

    const handleLoginToStartMeeting = () => {
        navigate("/auth");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && meetingCode.trim()) {
            handleJoinVideoCall();
        }
    };

    return (
        <Container maxWidth="sm">
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        borderRadius: 2,
                        background:
                            "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
                        mt: 4,
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{
                            fontWeight: 600,
                            color: "#1a73e8",
                            mb: 3,
                        }}
                    >
                        <VideoCallIcon
                            sx={{
                                mr: 1,
                                fontSize: 35,
                                verticalAlign: "middle",
                            }}
                        />
                        Join Meeting
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 4 }}
                    >
                        Enter a meeting code or link to connect with others
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField
                            value={meetingCode}
                            onChange={(e) => setMeetingCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter meeting code or link"
                            variant="outlined"
                            fullWidth
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <LinkIcon color="action" sx={{ mr: 1 }} />
                                ),
                                sx: {
                                    borderRadius: 2,
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: isHovered
                                            ? "#1a73e8"
                                            : "rgba(0, 0, 0, 0.23)",
                                    },
                                },
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        />

                        <Button
                            onClick={handleJoinVideoCall}
                            disabled={!meetingCode.trim()}
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 600,
                                backgroundColor: "#1a73e8",
                                "&:hover": {
                                    backgroundColor: "#1557b0",
                                },
                            }}
                        >
                            Join Now
                        </Button>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                        </Divider>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ mb: 1 }}
                        >
                            Don't have a meeting code?
                        </Typography>

                        <Button
                            onClick={handleLoginToStartMeeting}
                            variant="outlined"
                            startIcon={<LoginIcon />}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                py: 1.2,
                                fontWeight: 500,
                                borderColor: "#1a73e8",
                                color: "#1a73e8",
                                "&:hover": {
                                    backgroundColor: "rgba(26, 115, 232, 0.04)",
                                    borderColor: "#1557b0",
                                },
                            }}
                        >
                            Create an Account to start new meeting
                        </Button>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
}
