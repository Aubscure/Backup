import AuthLayout from "@/Layouts/Auth/AuthLayout";
import { sx } from "./Otp.style";
import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useForm, usePage } from "@inertiajs/react";
import TextField from "@mui/material/TextField";

function Otp() {
    const { email, type } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        email: email,
        otp_code: "",
        type: type,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/otp/verify", {
            onError: (errs) => {
                alert("OTP verification failed:", errs);
            },
        });
    };

    const handleResend = () => {
        post("/otp/generate");
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
                            OTP Verification
                        </Typography>
                        <Typography sx={{ color: "#6B7280" }}>
                            We've sent a verification code to your email
                        </Typography>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={sx.credBox}>
                            <TextField
                                value={data.otp_code}
                                label="One Time Password (OTP)"
                                error={!!errors.otp_code}
                                helperText={errors.otp_code}
                                onChange={(e) =>
                                    setData("otp_code", e.target.value)
                                }
                            />
                            <Button
                                type="submit"
                                disabled={processing}
                                sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    backgroundColor: "#1E7E34",
                                }}
                            >
                                Verify Otp
                            </Button>
                            <Button
                                type="button"
                                onClick={handleResend}
                                disabled={processing}
                                variant="outlined"
                                sx={{
                                    borderColor: "#1E7E34",
                                    color: "#1E7E34",
                                }}
                            >
                                Resend OTP
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </AuthLayout>
    );
}

export default Otp;
