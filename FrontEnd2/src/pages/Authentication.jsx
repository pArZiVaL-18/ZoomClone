// import * as React from "react";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
// import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Typography from "@mui/material/Typography";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { AuthContext } from "../contexts/AuthContext";
// import { Snackbar } from "@mui/material";

// // TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

// export default function Authentication() {
//     const [username, setUsername] = React.useState();
//     const [password, setPassword] = React.useState();
//     const [name, setName] = React.useState();
//     const [error, setError] = React.useState();
//     const [message, setMessage] = React.useState();

//     const [formState, setFormState] = React.useState(0);

//     const [open, setOpen] = React.useState(false);

//     const { handleRegister, handleLogin } = React.useContext(AuthContext);

//     let handleAuth = async () => {
//         try {
//             if (formState === 0) {
//                 let result = await handleLogin(username, password);
//             }
//             if (formState === 1) {
//                 let result = await handleRegister(name, username, password);
//                 console.log(result);
//                 setUsername("");
//                 setMessage(result);
//                 setOpen(true);
//                 setError("");
//                 setFormState(0);
//                 setPassword("");
//             }
//         } catch (err) {
//             console.log(err);
//             let message = err.response.data.message;
//             setError(message);
//         }
//     };

//     return (
//         <ThemeProvider theme={defaultTheme}>
//             <Grid container component="main" sx={{ height: "100vh" }}>
//                 <CssBaseline />
//                 <Grid
//                     item
//                     xs={false}
//                     sm={4}
//                     md={7}
//                     sx={{
//                         backgroundImage: "url(https://picsum.photos/800/600)",
//                         backgroundRepeat: "no-repeat",
//                         backgroundColor: (t) =>
//                             t.palette.mode === "light"
//                                 ? t.palette.grey[50]
//                                 : t.palette.grey[900],
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                     }}
//                 />
//                 <Grid
//                     item
//                     xs={12}
//                     sm={8}
//                     md={5}
//                     component={Paper}
//                     elevation={6}
//                     square
//                 >
//                     <Box
//                         sx={{
//                             my: 8,
//                             mx: 4,
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                         }}
//                     >
//                         <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//                             <LockOutlinedIcon />
//                         </Avatar>

//                         <div>
//                             <Button
//                                 variant={formState === 0 ? "contained" : ""}
//                                 onClick={() => {
//                                     setFormState(0);
//                                 }}
//                             >
//                                 Sign In
//                             </Button>
//                             <Button
//                                 variant={formState === 1 ? "contained" : ""}
//                                 onClick={() => {
//                                     setFormState(1);
//                                 }}
//                             >
//                                 Sign Up
//                             </Button>
//                         </div>

//                         <Box component="form" noValidate sx={{ mt: 1 }}>
//                             {formState === 1 ? (
//                                 <TextField
//                                     margin="normal"
//                                     required
//                                     fullWidth
//                                     id="username"
//                                     label="Full Name"
//                                     name="username"
//                                     value={name}
//                                     autoFocus
//                                     onChange={(e) => setName(e.target.value)}
//                                 />
//                             ) : (
//                                 <></>
//                             )}

//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 id="username"
//                                 label="Username"
//                                 name="username"
//                                 value={username}
//                                 autoFocus
//                                 onChange={(e) => setUsername(e.target.value)}
//                             />
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 name="password"
//                                 label="Password"
//                                 value={password}
//                                 type="password"
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 id="password"
//                             />

//                             <p style={{ color: "red" }}>{error}</p>

//                             <Button
//                                 type="button"
//                                 fullWidth
//                                 variant="contained"
//                                 sx={{ mt: 3, mb: 2 }}
//                                 onClick={handleAuth}
//                             >
//                                 {formState === 0 ? "Login " : "Register"}
//                             </Button>
//                         </Box>
//                     </Box>
//                 </Grid>
//             </Grid>

//             <Snackbar open={open} autoHideDuration={4000} message={message} />
//         </ThemeProvider>
//     );
// }

import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar, Paper, Link, Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import VideocamIcon from "@mui/icons-material/Videocam";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2563EB", // Blue color matching the image
        },
        secondary: {
            main: "#10B981", // Teal accent for secondary elements
        },
        background: {
            default: "#F3F4F6",
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "10px 0",
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    // Animation frame for the wave effect
    const [wave, setWave] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setWave((prev) => (prev + 1) % 40);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, email, password);
            }
            if (formState === 1) {
                console.log(
                    "Sending to handleRegister:",
                    name,
                    username,
                    email,
                    password
                ); // Debugging
                const result = await handleRegister(
                    name,
                    username,
                    email,
                    password
                );
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
                setPassword("");
                setEmail("");
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        position: "relative",
                        // background: "linear-gradient(135deg, #0062E6 0%, #33AEFF 100%)",
                        background:
                            "linear-gradient(135deg, #004BB5 0%, #2593E6 50%, #6A8FA0 100%)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {/* Simple and unique visual - Sound Wave Animation */}
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            color: "white",
                        }}
                    >
                        {/* Interactive wave animation - unique element */}
                        <Box
                            sx={{
                                position: "relative",
                                height: 200,
                                width: "80%",
                                mb: 6,
                            }}
                        >
                            {/* Sound waves */}
                            {[...Array(20)].map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "absolute",
                                        left: `${index * 5}%`,
                                        bottom: 0,
                                        width: "3px",
                                        height: `${
                                            30 +
                                            Math.sin((index + wave) * 0.3) *
                                                20 +
                                            Math.cos((index + wave) * 0.5) * 25
                                        }px`,
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.8)",
                                        borderRadius: "2px",
                                        transition: "height 0.1s ease-in-out",
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Simplified video icon */}
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                mb: 4,
                            }}
                        >
                            <VideocamIcon
                                sx={{ fontSize: 60, color: "white" }}
                            />
                        </Box>

                        {/* Key feature labels */}
                        <Box sx={{ textAlign: "center" }}>
                            <Typography
                                variant="h3"
                                sx={{ fontWeight: 700, mb: 2 }}
                            >
                                Connect
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 400, opacity: 0.8 }}
                            >
                                Seamless video calls with anyone, anywhere
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 2,
                                    mt: 4,
                                }}
                            >
                                {["HD Video", "Secure", "Easy to Join"].map(
                                    (feature, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                padding: "6px 16px",
                                                backgroundColor:
                                                    "rgba(255, 255, 255, 0.15)",
                                                borderRadius: 4,
                                                backdropFilter: "blur(5px)",
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {feature}
                                            </Typography>
                                        </Box>
                                    )
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{
                        backgroundColor: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 4,
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 400,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {/* Logo */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    letterSpacing: "0.5px",
                                }}
                            >
                                ROVAMS
                                <Box component="span" sx={{ color: "#10B981" }}>
                                    CONNECT
                                </Box>
                            </Typography>
                        </Box>

                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ mb: 4, fontWeight: 600 }}
                        >
                            {formState === 0 ? "Sign In" : "Sign Up"}
                        </Typography>

                        {formState === 0 && (
                            <>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        justifyContent: "flex-start",
                                        color: "black",
                                        borderColor: "#E5E7EB",
                                        "&:hover": {
                                            borderColor: "#D1D5DB",
                                            backgroundColor: "#F9FAFB",
                                        },
                                        pl: 2,
                                    }}
                                    startIcon={<GoogleIcon />}
                                >
                                    <Typography
                                        sx={{
                                            width: "100%",
                                            textAlign: "center",
                                            pr: 4,
                                        }}
                                    >
                                        Sign in with Google
                                    </Typography>
                                </Button>

                                <Divider sx={{ width: "100%", mb: 3 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#9CA3AF", px: 1 }}
                                    >
                                        Or
                                    </Typography>
                                </Divider>
                            </>
                        )}

                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1, width: "100%" }}
                        >
                            {formState === 1 && (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Full Name"
                                        name="name"
                                        value={name}
                                        autoFocus
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <EmailIcon
                                            sx={{
                                                mr: 1,
                                                color: "rgba(0, 0, 0, 0.54)",
                                            }}
                                        />
                                    ),
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <LockIcon
                                            sx={{
                                                mr: 1,
                                                color: "rgba(0, 0, 0, 0.54)",
                                            }}
                                        />
                                    ),
                                }}
                            />

                            {error && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, py: 1.5 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Log in" : "Sign Up"}
                            </Button>

                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {formState === 0
                                        ? "Don't have an account? "
                                        : "Already have an account? "}
                                    <Link
                                        href="#"
                                        variant="body2"
                                        onClick={() =>
                                            setFormState(
                                                formState === 0 ? 1 : 0
                                            )
                                        }
                                        sx={{
                                            color: "#2563EB",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {formState === 0
                                            ? "Sign Up here"
                                            : "Sign In"}
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </ThemeProvider>
    );
}
