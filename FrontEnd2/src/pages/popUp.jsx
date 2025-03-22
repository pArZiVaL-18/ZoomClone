import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

export default function PopupModal({ link }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                Open Modal
            </Button>

            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Meet link
                    </Typography>
                    <Typography sx={{ mt: 2 }}>{link}</Typography>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
