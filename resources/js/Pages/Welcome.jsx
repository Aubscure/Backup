import { Head, Link } from '@inertiajs/react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Link as MuiLink,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material';

// Define a modern theme configuration
const theme = createTheme({
    palette: {
        background: {
            default: '#f3f4f6', // Matches bg-gray-100
        },
        primary: {
            main: '#2563eb', // Matches text-blue-600
        },
    },
});

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Head title="Welcome" />

            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <AppBar position="static" color="inherit" elevation={1} sx={{ bgcolor: 'white' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
                        <Typography variant="h6" component="h1" fontWeight="bold">
                            My Application
                        </Typography>

                        <Box>
                            {auth.user ? (
                                <Button
                                    component={Link}
                                    href={route('dashboard')}
                                    color="primary"
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        href={route('login')}
                                        color="primary"
                                        sx={{ mr: 1 }}
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        component={Link}
                                        href={route('register')}
                                        color="primary"
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 3,
                        py: 6,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                        Welcome to Your Laravel App
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
                        This is a simplified welcome page. You can explore the
                        Laravel ecosystem and improve your development skills
                        using the resources below.
                    </Typography>

                    {/* Resource Links */}
                    <Container maxWidth="md">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Card sx={{ height: '100%' }}>
                                    <CardActionArea
                                        href="https://laravel.com/docs"
                                        target="_blank"
                                        sx={{ height: '100%', p: 2, display: 'flex', justifyContent: 'flex-start' }}
                                    >
                                        <Typography variant="h6" component="div">
                                            📘 Documentation
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card sx={{ height: '100%' }}>
                                    <CardActionArea
                                        href="https://laracasts.com"
                                        target="_blank"
                                        sx={{ height: '100%', p: 2, display: 'flex', justifyContent: 'flex-start' }}
                                    >
                                        <Typography variant="h6" component="div">
                                            🎥 Laracasts
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card sx={{ height: '100%' }}>
                                    <CardActionArea
                                        href="https://laravel-news.com"
                                        target="_blank"
                                        sx={{ height: '100%', p: 2, display: 'flex', justifyContent: 'flex-start' }}
                                    >
                                        <Typography variant="h6" component="div">
                                            📰 Laravel News
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Card sx={{ height: '100%', p: 2 }}>
                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                        <Typography variant="h6" gutterBottom>
                                            🚀 Ecosystem Tools:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', fontSize: '0.875rem' }}>
                                            <MuiLink href="https://forge.laravel.com" target="_blank" underline="hover">Forge</MuiLink>
                                            <MuiLink href="https://vapor.laravel.com" target="_blank" underline="hover">Vapor</MuiLink>
                                            <MuiLink href="https://nova.laravel.com" target="_blank" underline="hover">Nova</MuiLink>
                                            <MuiLink href="https://envoyer.io" target="_blank" underline="hover">Envoyer</MuiLink>
                                            <MuiLink href="https://herd.laravel.com" target="_blank" underline="hover">Herd</MuiLink>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Laravel v{laravelVersion} (PHP v{phpVersion})
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
