import { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import DashboardSidebar from '@/Components/Mentor/MentorSidebar';
import TopNav           from '@/Components/Mentor/MentorTopNavigationBar';

// ─── Layout constants — import these wherever you need to offset fixed elements
export const SIDEBAR_WIDTH   = 256;
export const TOPNAV_HEIGHT   = 58;   // main bar height in px
export const MOBILE_TAB_H    = 38;   // extra height of the mobile tab strip
export const TOPNAV_TOTAL_MD = TOPNAV_HEIGHT;                    // desktop offset
export const TOPNAV_TOTAL_XS = TOPNAV_HEIGHT + MOBILE_TAB_H;   // mobile offset

/**
 * MentorLayout
 *
 * Wraps every mentor page with:
 *   - Permanent fixed sidebar on md+
 *   - Slide-in Drawer on xs/sm
 *   - Sticky top nav with mobile tab strip
 *   - Correct main-content top-margin at every breakpoint
 *
 * @param {object}   auth       - Inertia auth prop (passed down to sub-components via usePage)
 * @param {string}   activeTab  - Highlights the matching tab in TopNav
 * @param {node}     children   - Page content
 */
export default function MentorLayout({
    auth,
    activeTab = 'Dashboard',
    children,
}) {
    const theme    = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [drawerOpen, setDrawerOpen] = useState(false);
    const openDrawer  = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    return (
        <Box
            sx={{
                display:   'flex',
                minHeight: '100vh',
                bgcolor:   '#f4f6f8',
                overflowX: 'hidden',
            }}
        >
            {/* ── Permanent desktop sidebar ─────────────────────────────── */}
            <Box
                sx={{
                    width:      SIDEBAR_WIDTH,
                    flexShrink: 0,
                    display:    { xs: 'none', md: 'block' },
                }}
            >
                <DashboardSidebar drawerMode={false} />
            </Box>

            {/* ── Mobile slide-in drawer ────────────────────────────────── */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={closeDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width:     SIDEBAR_WIDTH,
                        boxSizing: 'border-box',
                        border:    'none',
                    },
                }}
            >
                <DashboardSidebar drawerMode={true} onClose={closeDrawer} />
            </Drawer>

            {/* ── Content column ───────────────────────────────────────── */}
            <Box
                sx={{
                    display:       'flex',
                    flexDirection: 'column',
                    flexGrow:       1,
                    minWidth:       0,  // prevents flex children from overflowing
                }}
            >
                <TopNav
                    activeTab={activeTab}
                    sidebarWidth={SIDEBAR_WIDTH}
                    topNavHeight={`${TOPNAV_HEIGHT}px`}
                    onMenuClick={openDrawer}
                />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        // Offset for sticky header — taller on mobile (bar + tab strip)
                        mt: {
                            xs: `${TOPNAV_TOTAL_XS}px`,
                            md: `${TOPNAV_TOTAL_MD}px`,
                        },
                        minHeight: {
                            xs: `calc(100vh - ${TOPNAV_TOTAL_XS}px)`,
                            md: `calc(100vh - ${TOPNAV_TOTAL_MD}px)`,
                        },
                        overflowX: 'hidden',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
