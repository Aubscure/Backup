import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ClientSidebar from '@/Components/Client/ClientSidebar';
import {
    Box,
    Typography,
    Paper,
    InputBase,
    Stack,
    Button,
    IconButton,
    useMediaQuery,
    useTheme,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    Avatar,
    LinearProgress,
    Chip,
    Card,
    CardContent,
    CardMedia,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

const SIDEBAR_WIDTH = 240;

const STATIC_EMPLOYEES = [
    { id: 1, name: 'Marcus Holloway', email: 'm.holloway@enterprise.com', department: 'Product Design', load: 2, loadLabel: '2 active courses', status: 'ACTIVE', selected: true },
    { id: 2, name: 'Sarah Jenkins', email: 's.jenkins@enterprise.com', department: 'Engineering', load: 5, loadLabel: '5 active courses', status: 'ACTIVE', selected: true },
    { id: 3, name: 'Robert Chen', email: 'r.chen@enterprise.com', department: 'Marketing', load: 0, loadLabel: 'None', status: 'ON LEAVE', selected: false },
    { id: 4, name: 'Elena Rodriguez', email: 'e.rodriguez@enterprise.com', department: 'Human Resources', load: 1, loadLabel: '1 active course', status: 'ACTIVE', selected: true },
];

const STATIC_AVAILABLE_COURSES = [
    { id: 1, title: 'Advanced Project Management', category: 'Business • 24h', licenses: '45 Licenses Left', expires: 'Expires 12/24', selected: true },
    { id: 2, title: 'Cybersecurity Essentials', category: 'IT & Infrastructure • 12h', licenses: '210 Licenses Left', expires: 'Evergreen', selected: false },
    { id: 3, title: 'Effective Communication', category: 'Soft Skills • 8h', licenses: 'Unlimited Seats', expires: 'New Addition', selected: false },
];

export default function ClientAssignments() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Head title="Employee Assignment" />
            <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
                <ClientSidebar activePage="assignments" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
                <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, transition: theme.transitions.create('margin') }}>
                    <Paper square elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}>
                        <Box sx={{ display: 'flex', height: 64, alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 3, lg: 4 } }}>
                            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', borderRadius: 50, px: 2, py: 0.75, width: { xs: '100%', sm: 320 }, maxWidth: { xs: 'calc(100% - 100px)', sm: 320 }, mx: { xs: 1, sm: 'auto' } }}>
                                <SearchIcon sx={{ color: 'grey.400', mr: 1, fontSize: 20 }} />
                                <InputBase placeholder="Search for skills, mentors, or topics..." sx={{ fontSize: '0.875rem', flex: 1 }} />
                            </Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
                                <Typography variant="body2" fontWeight={500} sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>ManPro Learning Hub</Typography>
                                <Box sx={{ position: 'relative', cursor: 'pointer' }}><NotificationsNoneIcon sx={{ color: 'grey.500' }} /></Box>
                            </Stack>
                        </Box>
                    </Paper>

                    <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* Main content */}
                        <Box sx={{ flex: '1 1 500px', minWidth: 0 }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">ADMIN CONSOLE</Typography>
                                <Typography variant="caption" color="text.secondary">›</Typography>
                                <Typography variant="caption" fontWeight={700} color="success.main">LICENSE ALLOCATION</Typography>
                            </Stack>
                            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Employee Assignment</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Assign professional courses and manage seat distribution for your enterprise workforce across all departments.</Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                <TextField size="small" label="DEADLINE DATE" defaultValue="Oct 24, 2024" InputProps={{ readOnly: true }} sx={{ minWidth: 160 }} />
                                <Button endIcon={<FilterListIcon />} variant="outlined" size="medium" sx={{ textTransform: 'none' }}>Department: All</Button>
                                <Button endIcon={<FilterListIcon />} variant="outlined" size="medium" sx={{ textTransform: 'none' }}>Role: All Roles</Button>
                                <Button endIcon={<FilterListIcon />} variant="outlined" size="medium" sx={{ textTransform: 'none' }}>Status: Active</Button>
                                <Button variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}>RESET</Button>
                            </Stack>

                            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', borderRadius: 1, px: 1.5, py: 0.75, flex: 1, minWidth: 200 }}>
                                        <SearchIcon sx={{ color: 'grey.400', mr: 1, fontSize: 20 }} />
                                        <InputBase placeholder="Search by name, email or department..." sx={{ fontSize: '0.875rem', flex: 1 }} />
                                    </Box>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <Typography variant="body2" fontWeight={600}>1,248 Employees Found</Typography>
                                        <FilterListIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    </Stack>
                                </Box>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                                            <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
                                            <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Employee Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Department</TableCell>
                                            <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Current Load</TableCell>
                                            <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {STATIC_EMPLOYEES.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell padding="checkbox"><Checkbox size="small" defaultChecked={row.selected} /></TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'grey.300' }}><PersonIcon fontSize="small" /></Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell><Typography variant="body2">{row.department}</Typography></TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <LinearProgress variant="determinate" value={row.load ? Math.min(row.load * 20, 100) : 0} sx={{ width: 60, height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: row.load >= 5 ? 'warning.main' : 'success.main' } }} />
                                                        <Typography variant="caption" color="text.secondary">{row.loadLabel}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip size="small" label={row.status} sx={{ bgcolor: row.status === 'ACTIVE' ? 'success.50' : 'grey.100', color: row.status === 'ACTIVE' ? 'success.dark' : 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Showing 1-10 of 1,248</Typography>
                                    <Stack direction="row" spacing={0.5}>
                                        <IconButton size="small"><ChevronLeftIcon /></IconButton>
                                        <Button size="small" variant="contained" sx={{ minWidth: 36, bgcolor: 'success.main' }}>1</Button>
                                        <Button size="small" variant="text">2</Button>
                                        <Button size="small" variant="text">3</Button>
                                        <IconButton size="small"><ChevronRightIcon /></IconButton>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Right sidebar */}
                        <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={700}>Available Courses</Typography>
                                    <Chip size="small" label="12 AVAILABLE" sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 700 }} />
                                </Stack>
                                <Stack spacing={1.5} sx={{ mb: 2 }}>
                                    {STATIC_AVAILABLE_COURSES.map((c) => (
                                        <Card key={c.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', borderColor: c.selected ? 'success.main' : 'divider' }}>
                                            <Stack direction="row" spacing={0}>
                                                <Box sx={{ width: 80, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ImageRoundedIcon sx={{ color: 'grey.500' }} />
                                                </Box>
                                                <CardContent sx={{ flex: 1, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                    {c.selected && <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main', float: 'right' }} />}
                                                    <Typography variant="subtitle2" fontWeight={700}>{c.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{c.category}</Typography>
                                                    <Typography variant="caption" display="block" color="success.dark" fontWeight={600}>{c.licenses}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{c.expires}</Typography>
                                                </CardContent>
                                            </Stack>
                                        </Card>
                                    ))}
                                </Stack>
                                <Button fullWidth variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>+ BROWSE LIBRARY</Button>
                            </Paper>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>SUMMARY DETAILS</Typography>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                    <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    <Typography variant="body2">Selected</Typography>
                                    <Typography variant="body2" fontWeight={700} color="success.main">12 Employees</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <CardMembershipIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    <Typography variant="body2">Remaining</Typography>
                                    <Typography variant="body2" fontWeight={700} color="success.main">45 Licenses</Typography>
                                </Stack>
                                <Button fullWidth variant="contained" size="large" sx={{ bgcolor: 'success.main', textTransform: 'none', fontWeight: 700, py: 1.5, '&:hover': { bgcolor: 'success.dark' } }}>CONFIRM ALLOCATION</Button>
                                <Button fullWidth variant="text" sx={{ mt: 1, textTransform: 'none', color: 'text.secondary' }}>CANCEL ACTION</Button>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
