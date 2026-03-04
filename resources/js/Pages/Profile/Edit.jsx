import { Head }                      from '@inertiajs/react';
import { usePage }                   from '@inertiajs/react';
import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    keyframes,
    Stack,
    Typography,
}                                    from '@mui/material';
import AccountCircleOutlinedIcon     from '@mui/icons-material/AccountCircleOutlined';

import MentorLayout                  from '@/Layouts/MentorLayout';
import DeleteUserForm                from './Partials/DeleteUserForm';
import UpdatePasswordForm            from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm  from './Partials/UpdateProfileInformationForm';
import ProfileAvatar                 from '@/Components/Mentor/MentorProfileAvatar';

// ─── Fade-up animation ────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Section = ({ children, delay = '0s' }) => (
    <Box sx={{ animation: `${fadeInUp} 0.4s ease-out both`, animationDelay: delay }}>
        {children}
    </Box>
);

// ─── Uniform section card ──────────────────────────────────────────────────────
function ProfileCard({ children }) {
    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
            }}
        >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, '&:last-child': { pb: { xs: 2.5, sm: 3.5 } } }}>
                {children}
            </CardContent>
        </Card>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <>
            <Head title="Profile Settings" />

            <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
                <Box component="main" sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1440, mx: 'auto' }}>

                    {/* ── Page header ─────────────────────────────────── */}
                    <Section delay="0s">
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h4" fontWeight={700} color="#111827">
                                Profile Settings
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Manage your personal information, password, and account preferences.
                            </Typography>
                        </Box>
                    </Section>

                    <Grid container spacing={3} alignItems="flex-start">

                        {/* ── Left: avatar summary card ──────────────── */}
                        <Grid item xs={12} md={3}>
                            <Section delay="0.05s">
                                <Card
                                    elevation={0}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 2.5,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Green header strip */}
                                    <Box
                                        sx={{
                                            height: 72,
                                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                        }}
                                    />

                                    <CardContent sx={{ pt: 0, pb: 3, px: 3, textAlign: 'center' }}>
                                        {/* Avatar overlapping the strip */}
                                        <Box sx={{ mt: '-36px', mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                                            <ProfileAvatar
                                                size={72}
                                                src={user.profile_photo_url}
                                                user={user}
                                            />
                                        </Box>

                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                            {user.firstname} {user.lastname}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            @{user.username}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
                                            {user.email}
                                        </Typography>

                                        <Box
                                            sx={{
                                                mt: 2,
                                                px: 2, py: 1,
                                                bgcolor: '#f0fdf4',
                                                border: '1px solid #bbf7d0',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="caption" color="#16a34a" fontWeight={600}>
                                                Mentor Account
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Section>
                        </Grid>

                        {/* ── Right: form cards ───────────────────────── */}
                        <Grid item xs={12} md={9}>
                            <Stack spacing={2.5}>

                                <Section delay="0.08s">
                                    <ProfileCard>
                                        <UpdateProfileInformationForm
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                        />
                                    </ProfileCard>
                                </Section>

                                <Section delay="0.12s">
                                    <ProfileCard>
                                        <UpdatePasswordForm />
                                    </ProfileCard>
                                </Section>

                                <Section delay="0.16s">
                                    <ProfileCard>
                                        <DeleteUserForm />
                                    </ProfileCard>
                                </Section>

                            </Stack>
                        </Grid>

                    </Grid>
                </Box>
            </Box>
        </>
    );
}

Edit.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="">
        {page}
    </MentorLayout>
);
