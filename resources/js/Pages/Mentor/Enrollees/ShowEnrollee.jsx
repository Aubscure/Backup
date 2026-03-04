import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material";
import MentorLayout from "@/Layouts/MentorLayout";

import EmployeeDetails       from "./Components_temp/EmployeeDetails";
import EmpCertificationLists from "./Components_temp/EmpCertificationLists";
import EmpTopCoursesList     from "./Components_temp/EmpTopCoursesList";
import PerformanceDetails    from "./Components_temp/PerformanceDetails";

import { resolveEnrollee, getFullName } from "@/Utils/enrolleeUtils";

// ── Mirrors Index page animation ──────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Global CSS for animation names referenced inside sx strings ───────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,300&family=Sora:wght@300;400;600;700;800&display=swap');

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideRight {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);    opacity: 0.55; }
    70%  { transform: scale(1.45); opacity: 0; }
    100% { transform: scale(1);    opacity: 0; }
  }
  @keyframes counterUp {
    from { opacity: 0; transform: translateY(10px) scale(0.8); }
    to   { opacity: 1; transform: translateY(0)    scale(1);   }
  }

  .show-enrollee-root { font-family: 'DM Sans', sans-serif; }

  /* Cert row hover — matches Index table row hover feel */
  .cert-row {
    transition: background 0.15s ease, transform 0.2s ease;
    border-radius: 8px;
    padding: 6px 8px;
    margin: -6px -8px;
    cursor: default;
  }
  .cert-row:hover { background: #f0fdf4; transform: translateX(4px); }

  .course-bar-wrap { transition: transform 0.2s ease; }
  .course-bar-wrap:hover { transform: scale(1.01); }

  /* Stat pill — matches Index stat card hover */
  .stat-pill { transition: box-shadow 0.2s ease, transform 0.2s ease; }
  .stat-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0,0,0,0.08) !important;
  }

  .accordion-course { transition: box-shadow 0.2s ease !important; }
  .accordion-course:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08) !important; }
`;

function ShowEnrollee({ userdata, enrolleeId }) {
    const enrollee = resolveEnrollee(userdata, enrolleeId);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!document.getElementById("show-enrollee-styles")) {
            const style = document.createElement("style");
            style.id = "show-enrollee-styles";
            style.textContent = GLOBAL_STYLES;
            document.head.appendChild(style);
        }
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box
            className="show-enrollee-root"
            sx={{
                minHeight: "100vh",
                bgcolor: "#f4f6f8",      // ← matches Index
                p: { xs: 2, md: 4 },    // ← matches Index
            }}
        >
            {/* ── Page Header — exact same structure as Index ── */}
            <Box sx={{ animation: `${fadeInUp} 0.4s ease-out both`, mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} sx={{ color: "#111827" }}>
                            Employee Profile
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                            {getFullName(enrollee)}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* ── Panels — Paper elevation={0} mirrors Index table card ── */}
            <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={2.5}
                alignItems="flex-start"
                sx={{ animation: `${fadeInUp} 0.5s ease-out 0.05s both` }}
            >
                {/* Left */}
                <Paper
                    elevation={0}
                    sx={{
                        width: { xs: "100%", lg: 400 },
                        flexShrink: 0,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        transition: "box-shadow 0.2s, transform 0.2s",
                        "&:hover": { boxShadow: "0 6px 24px rgba(0,0,0,0.08)" },
                    }}
                >
                    <Box sx={{ p: { xs: 3, sm: 3.5 } }}>
                        <EmployeeDetails enrollee={enrollee} mounted={mounted} />
                        <SectionDivider />
                        <EmpCertificationLists enrollee={enrollee} />
                        <SectionDivider />
                        <EmpTopCoursesList enrollee={enrollee} mounted={mounted} />
                    </Box>
                </Paper>

                {/* Right */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden",
                        transition: "box-shadow 0.2s, transform 0.2s",
                        "&:hover": { boxShadow: "0 6px 24px rgba(0,0,0,0.08)" },
                    }}
                >
                    <PerformanceDetails enrollee={enrollee} mounted={mounted} />
                </Paper>
            </Stack>
        </Box>
    );
}

function SectionDivider() {
    return <Box sx={{ my: 3, height: "1px", bgcolor: "divider" }} />;
}

export default ShowEnrollee;

ShowEnrollee.layout = (page) => (
    <MentorLayout auth={page.props.auth} activeTab="Enrollees">
        {page}
    </MentorLayout>
);
