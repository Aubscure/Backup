import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Box, Typography, Alert, Button } from '@mui/material';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </Typography>

            {status === 'verification-link-sent' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    A new verification link has been sent to the email address
                    you provided during registration.
                </Alert>
            )}

            <Box component="form" onSubmit={submit}>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                    <Button
                        component={Link}
                        href={route('logout')}
                        method="post"
                        as="button"
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            color: 'text.secondary',
                            textDecoration: 'underline',
                            '&:hover': { color: 'text.primary' },
                        }}
                    >
                        Log Out
                    </Button>
                </Box>
            </Box>
        </GuestLayout>
    );
}
