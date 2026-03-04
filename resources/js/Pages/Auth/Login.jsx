import AuthLayout from "@/Layouts/Auth/AuthLayout";
import { sx } from "./Login.style";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link, useForm } from "@inertiajs/react";
import TextField from "@mui/material/TextField";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;

        post("/login", {
            onError: (errs) => { console.log("Login failed:", errs); }
        })
    };

    return (
        <AuthLayout>
            <Container>
                <Box sx={sx.boxContainer}>
                    <Box>
                        <Typography
                            sx={{
                                color: "#1E7E34",
                                fontWeight: "bold",
                                fontSize: "30px",
                            }}
                        >
                            Sign In
                        </Typography>
                    </Box>
                    <Box>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Box sx={sx.credBox}>
                                <Box sx={sx.authCredBox}>
                                    <TextField
                                        value={data.email}
                                        disabled={processing}
                                        label="Email"
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    <TextField
                                        value={data.password}
                                        disabled={processing}
                                        type="password"
                                        label="Password"
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                </Box>
                                <Box sx={sx.buttonGroup}>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        sx={{
                                            color: "white",
                                            fontWeight: "bold",
                                            backgroundColor: "#1E7E34",
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        component={Link}
                                        href="/register"
                                        disabled={processing}
                                        variant="outlined"
                                        sx={{
                                            color: "#1E7E34",
                                            fontWeight: "bold",
                                            borderColor: "#1E7E34",
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </AuthLayout>
    );
}
