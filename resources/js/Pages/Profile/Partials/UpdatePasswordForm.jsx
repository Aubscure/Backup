import InputError from '@/Components/InputError';
import TextInput   from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef }  from 'react';
import {
    Box,
    Button,
    Chip,
    Divider,
    Fade,
    Stack,
    Typography,
} from '@mui/material';
import LockOutlinedIcon    from '@mui/icons-material/LockOutlined';
import SaveOutlinedIcon    from '@mui/icons-material/SaveOutlined';
import VisibilityOffIcon   from '@mui/icons-material/VisibilityOff';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput        = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } =
        useForm({
            current_password:      '',
            password:              '',
            password_confirmation: '',
        });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <Box>
            {/* ── Section header ──────────────────────────────────────── */}
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        bgcolor: '#fffbeb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <LockOutlinedIcon sx={{ color: '#d97706', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                        Update Password
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Ensure your account is using a long, random password to stay secure.
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* ── Form ────────────────────────────────────────────────── */}
            <Box component="form" onSubmit={updatePassword}>
                <Stack spacing={2.5}>

                    <Box>
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            label="Current Password"
                            autoComplete="current-password"
                            fullWidth
                        />
                        <InputError message={errors.current_password} />
                    </Box>

                    <Box>
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            label="New Password"
                            autoComplete="new-password"
                            fullWidth
                        />
                        <InputError message={errors.password} />
                    </Box>

                    <Box>
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            label="Confirm New Password"
                            autoComplete="new-password"
                            fullWidth
                        />
                        <InputError message={errors.password_confirmation} />
                    </Box>

                    {/* Password hint */}
                    <Box
                        sx={{
                            p: 1.5,
                            bgcolor: '#fffbeb',
                            border: '1px solid #fde68a',
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            Use at least 8 characters. Include uppercase letters, numbers, and symbols for a stronger password.
                        </Typography>
                    </Box>

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
                            Update Password
                        </Button>

                        <Fade in={recentlySuccessful}>
                            <Chip
                                label="Updated!"
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
