import InputError      from '@/Components/InputError';
import Modal           from '@/Components/Modal';
import TextInput       from '@/Components/TextInput';
import { useForm }     from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import WarningAmberIcon          from '@mui/icons-material/WarningAmber';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({ password: '' });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError:   () => passwordInput.current.focus(),
            onFinish:  () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <Box>
            {/* ── Section header ──────────────────────────────────────── */}
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        bgcolor: '#fef2f2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <DeleteForeverOutlinedIcon sx={{ color: '#dc2626', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                        Delete Account
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Permanently remove your account and all associated data.
                    </Typography>
                </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* ── Danger notice ────────────────────────────────────────── */}
            <Alert
                severity="error"
                variant="outlined"
                icon={<WarningAmberIcon fontSize="small" />}
                sx={{ borderRadius: 2, mb: 3 }}
            >
                <Typography variant="body2" fontWeight={600} gutterBottom>
                    This action cannot be undone.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Once your account is deleted, all resources and data will be permanently removed.
                    Please download any data you wish to retain before proceeding.
                </Typography>
            </Alert>

            {/* ── Trigger button ───────────────────────────────────────── */}
            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverOutlinedIcon />}
                onClick={confirmUserDeletion}
                sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                        bgcolor: '#dc2626',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                    },
                    transition: 'all 0.2s ease',
                }}
            >
                Delete Account
            </Button>

            {/* ── Confirmation modal ───────────────────────────────────── */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <Box component="form" onSubmit={deleteUser}>

                    {/* Modal header */}
                    <Box
                        sx={{
                            px: 3, pt: 3, pb: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 36, height: 36, borderRadius: '50%',
                                bgcolor: '#fef2f2',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <WarningAmberIcon sx={{ color: '#dc2626', fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                Confirm Account Deletion
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                This cannot be reversed.
                            </Typography>
                        </Box>
                    </Box>

                    {/* Modal body */}
                    <Box sx={{ px: 3, py: 2.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                            All of your data, courses, certificates, and account information will be
                            permanently deleted. Please enter your password to confirm.
                        </Typography>

                        <Box>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                label="Your Password"
                                isFocused
                                placeholder="Enter your password"
                                fullWidth
                            />
                            <InputError message={errors.password} />
                        </Box>
                    </Box>

                    {/* Modal footer */}
                    <Box
                        sx={{
                            px: 3, pb: 3,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1.5,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={closeModal}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 1.5,
                                borderColor: 'divider',
                                color: 'text.secondary',
                                '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            startIcon={<DeleteForeverOutlinedIcon />}
                            sx={{
                                bgcolor: '#dc2626',
                                '&:hover': { bgcolor: '#b91c1c', boxShadow: '0 4px 12px rgba(220,38,38,0.35)' },
                                '&:disabled': { bgcolor: '#fca5a5' },
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 1.5,
                                boxShadow: 'none',
                            }}
                        >
                            Yes, Delete My Account
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}
