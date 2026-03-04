import InputError  from '@/Components/InputError';
import TextInput    from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Fade,
    Stack,
    Typography,
} from '@mui/material';
import PersonOutlineIcon  from '@mui/icons-material/PersonOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BadgeOutlinedIcon  from '@mui/icons-material/BadgeOutlined';
import SaveOutlinedIcon   from '@mui/icons-material/SaveOutlined';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            firstname: user.firstname,
            lastname:  user.lastname,
            username:  user.username,
            email:     user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box>
            {/* ── Section header ──────────────────────────────────────── */}
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        bgcolor: '#f0fdf4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <PersonOutlineIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                        Profile Information
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Update your account's profile information and email address.
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* ── Form ────────────────────────────────────────────────── */}
            <Box component="form" onSubmit={submit}>
                <Stack spacing={2.5}>

                    {/* Name row */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <TextInput
                                id="firstname"
                                label="First Name"
                                value={data.firstname}
                                onChange={(e) => setData('firstname', e.target.value)}
                                required
                                isFocused
                                autoComplete="given-name"
                                fullWidth
                            />
                            <InputError message={errors.firstname} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <TextInput
                                id="lastname"
                                label="Last Name"
                                value={data.lastname}
                                onChange={(e) => setData('lastname', e.target.value)}
                                required
                                autoComplete="family-name"
                                fullWidth
                            />
                            <InputError message={errors.lastname} />
                        </Box>
                    </Stack>

                    {/* Username */}
                    <Box>
                        <TextInput
                            id="username"
                            label="Username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            autoComplete="username"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <BadgeOutlinedIcon sx={{ color: 'text.disabled', fontSize: 18, mr: 1 }} />
                                ),
                            }}
                        />
                        <InputError message={errors.username} />
                    </Box>

                    {/* Email */}
                    <Box>
                        <TextInput
                            id="email"
                            type="email"
                            label="Email Address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <AlternateEmailIcon sx={{ color: 'text.disabled', fontSize: 18, mr: 1 }} />
                                ),
                            }}
                        />
                        <InputError message={errors.email} />
                    </Box>

                    {/* Email verification notice */}
                    {mustVerifyEmail && user.email_verified_at === null && (
                        <Alert
                            severity="warning"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                            action={
                                <Button
                                    component={Link}
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: 'warning.dark',
                                    }}
                                >
                                    Resend
                                </Button>
                            }
                        >
                            Your email address is unverified.
                            {status === 'verification-link-sent' && (
                                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'success.dark' }}>
                                    A new verification link has been sent.
                                </Typography>
                            )}
                        </Alert>
                    )}

                    {/* Save row */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ pt: 0.5 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            startIcon={<SaveOutlinedIcon />}
                            sx={{
                                bgcolor: '#16a34a',
                                '&:hover': { bgcolor: '#15803d', boxShadow: '0 4px 12px rgba(22,163,74,0.35)' },
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 1.5,
                                px: 3,
                                boxShadow: 'none',
                            }}
                        >
                            Save Changes
                        </Button>

                        <Fade in={recentlySuccessful}>
                            <Chip
                                label="Saved!"
                                size="small"
                                sx={{
                                    bgcolor: '#f0fdf4',
                                    color: '#16a34a',
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    border: '1px solid #bbf7d0',
                                    borderRadius: 1.5,
                                }}
                            />
                        </Fade>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
