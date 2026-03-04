import AuthLayout from "@/Layouts/Auth/AuthLayout";
import React, { useState } from "react";
import { sx } from "./Register.style";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useForm } from "@inertiajs/react";

function Register() {
    const { data, setData, post, processing, errors } = useForm({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (processing) return;

        post("/register", {
            onError: () => console.log("Register failed:", errors)
        });
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
                            Sign Up
                        </Typography>
                        <Typography sx={{ color: "#6B7280" }}>
                            Create your expert account to get started
                        </Typography>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={sx.credBox}>
                            <Box sx={sx.nameCredBox}>
                                <TextField
                                    value={data.firstname}
                                    label="First Name"
                                    onChange={(e) =>
                                        setData("firstname", e.target.value)
                                    }
                                    sx={sx.nameCredField}
                                />
                                <TextField
                                    value={data.lastname}
                                    label="Last Name"
                                    onChange={(e) =>
                                        setData("lastname", e.target.value)
                                    }
                                    sx={sx.nameCredField}
                                />
                            </Box>
                            <Box sx={sx.authCredBox}>
                                <TextField
                                    value={data.username}
                                    label="Username"
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                />
                                <TextField
                                    value={data.email}
                                    label="Email"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                <TextField
                                    type="password"
                                    value={data.password}
                                    label="Password"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <TextField
                                    type="password"
                                    value={data.password_confirmation}
                                    label="Password Confirmation"
                                    error={!!errors.password_confirmation}
                                    helperText={errors.password_confirmation}
                                    onChange={(e) =>
                                        setData("password_confirmation", e.target.value)
                                    }
                                />
                            </Box>
                            <Button
                                type="submit"
                                disabled={processing}
                                sx={{
                                    color: "white",
                                    backgroundColor: "#1E7E34",
                                    fontWeight: "bold",
                                }}
                            >
                                {processing ? "Processing..." : "Next"}
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ color: "#6B7280", mt: "12px", fontSize: 15 }}>
                        Already have an account?{" "}
                        {/* <Link to="/auth/login" style={{ color: "#1E7E34" }}> */}
                        {/* Sign In */}
                        {/* </Link> */}
                    </Box>
                </Box>
            </Container>
        </AuthLayout>
    );
}

export default Register;
