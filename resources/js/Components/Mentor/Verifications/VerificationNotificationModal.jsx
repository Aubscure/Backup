import { Link } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Zoom,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const theme = createTheme({
    palette: {
        primary: {
            light: '#F5D569',
            main: '#E7AB13',
            contrastText: '#000',
        },
        success: {
            main: '#187604',
            dark: '#166534',
            contrastText: '#fff',
        },
        background: {
            default: '#F7F7F7',
            paper: '#FFFFFF',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
});

export default function VerificationModal({ show, onClose }) {
    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={show}  // ✅ This was missing, causing the error
                onClose={onClose}
                TransitionComponent={Zoom}
                transitionDuration={300}
                PaperProps={{
                    sx: {
                        p: 2,
                        background: 'linear-gradient(145deg, #ffffff, #f7f7f7)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    },
                }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(6px)',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    },
                }}
            >
                <DialogContent>
                    <Box display="flex" gap={2} alignItems="flex-start">
                        {/* Icon */}
                        <Box
                            sx={{
                                backgroundColor: '#FFF2C8',
                                color: '#E7AB13',
                                p: 1.5,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(231,171,19,0.3)',
                            }}
                        >
                            <WarningAmberRoundedIcon />
                        </Box>

                        {/* Text */}
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                gutterBottom
                            >
                                Expertise Verification Required
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                            >
                                To ensure the quality of our courses, mentors must verify
                                their expertise before creating content. Please complete
                                the verification process to proceed.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderColor: '#E7AB13',
                            color: '#E7AB13',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                borderColor: '#E7AB13',
                                backgroundColor: '#FFF2C8',
                            },
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        component={Link}
                        href={route('dashboard', { open_verification: 1 })}
                        variant="contained"
                        sx={{
                            backgroundColor: '#187604',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            '&:hover': {
                                backgroundColor: '#166534',
                            },
                        }}
                    >
                        Proceed to Verify
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}