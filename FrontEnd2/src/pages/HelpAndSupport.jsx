import React, { useState } from "react";
import {
    Help as HelpIcon,
    QuestionAnswer as QuestionAnswerIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Book as BookIcon,
    ExpandMore as ChevronDownIcon,
    ExpandLess as ChevronUpIcon,
    Home as HomeIcon,
} from "@mui/icons-material";
import {
    Typography,
    TextField,
    Card,
    CardContent,
    CardHeader,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Box,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HelpAndSupport = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedPanel, setExpandedPanel] = useState(false);
    const navigate = useNavigate();

    const faqData = [
        {
            category: "Getting Started",
            items: [
                {
                    question: "How do I create a new meeting?",
                    answer: 'Click the "Start New Meeting" button on the home page. You can then generate a unique link to share with participants.',
                },
                {
                    question: "How do I join an existing meeting?",
                    answer: 'Enter the meeting code or link in the input field and click "Join". Ensure you have the correct meeting link from the host.',
                },
            ],
        },
        {
            category: "Technical Support",
            items: [
                {
                    question: "What are the system requirements?",
                    answer: "ROVAMS Connect works on most modern browsers. Recommended: Chrome, Firefox, Safari, or Edge. Ensure stable internet connection.",
                },
                {
                    question: "Troubleshooting audio/video issues",
                    answer: "Check your device permissions, refresh the browser, and ensure your camera and microphone are working correctly.",
                },
            ],
        },
    ];

    const contactMethods = [
        {
            icon: EmailIcon,
            title: "Email Support",
            description: "roshanmalkar16@rovamsconnect.com",
            details: "Response within 24 hours",
        },
        {
            icon: PhoneIcon,
            title: "Phone Support",
            description: "+91 73500 69171",
            details: "Mon-Fri, 9 AM - 5 PM EST",
        },
    ];

    const filteredFAQs = faqData
        .map((category) => ({
            ...category,
            items: category.items.filter(
                (item) =>
                    item.question
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }))
        .filter((category) => category.items.length > 0);

    return (
        <Box sx={{ maxWidth: 800, margin: "auto", p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HelpIcon
                        sx={{ mr: 2, color: "primary.main", fontSize: 40 }}
                    />
                    <Typography variant="h4" component="h1">
                        Help & Support
                    </Typography>
                </Box>
                <IconButton
                    color="primary"
                    onClick={() => navigate("/home")}
                    aria-label="home"
                    sx={{
                        backgroundColor: "primary.light",
                        "&:hover": {
                            backgroundColor: "primary.light",
                            opacity: 0.9,
                        },
                    }}
                >
                    <HomeIcon />
                </IconButton>
            </Box>

            {/* <TextField 
        fullWidth
        variant="outlined"
        placeholder="Search help topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      /> */}

            <Grid container spacing={3} sx={{ mb: 3 }}>
                {contactMethods.map((method, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                            <CardHeader
                                avatar={<method.icon color="primary" />}
                                title={method.title}
                            />
                            <CardContent>
                                <Typography variant="body1">
                                    {method.description}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {method.details}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                    <QuestionAnswerIcon sx={{ mr: 2, color: "primary.main" }} />
                    Frequently Asked Questions
                </Typography>

                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((category, catIndex) => (
                        <Box key={catIndex} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                {category.category}
                            </Typography>
                            {category.items.map((faq, index) => (
                                <Accordion
                                    key={index}
                                    expanded={
                                        expandedPanel ===
                                        `panel${catIndex}-${index}`
                                    }
                                    onChange={(e, isExpanded) =>
                                        setExpandedPanel(
                                            isExpanded
                                                ? `panel${catIndex}-${index}`
                                                : false
                                        )
                                    }
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            expandedPanel ===
                                            `panel${catIndex}-${index}` ? (
                                                <ChevronUpIcon />
                                            ) : (
                                                <ChevronDownIcon />
                                            )
                                        }
                                    >
                                        <Typography>{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>{faq.answer}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    ))
                ) : (
                    <Typography textAlign="center" color="text.secondary">
                        No FAQs found matching your search.
                    </Typography>
                )}
            </Box>

            {/* <Card variant="outlined" sx={{ backgroundColor: 'primary.light', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BookIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6">Additional Resources</Typography>
        </Box>
        <Typography component="ul" sx={{ pl: 3 }}>
          <li>User Manual</li>
          <li>Video Tutorials</li>
          <li>Community Forums</li>
        </Typography>
      </Card> */}
        </Box>
    );
};

export default HelpAndSupport;
