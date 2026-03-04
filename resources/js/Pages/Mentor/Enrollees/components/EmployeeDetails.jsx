import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import { getFullName, getInitials, formatEnrolledDate } from "@/Utils/enrolleeUtils";

function EmployeeDetails({ enrollee, mounted }) {
    const [avatarHovered, setAvatarHovered] = useState(false);

    const fullName   = getFullName(enrollee);
    const initials   = getInitials(enrollee);
    const email      = enrollee?.email ?? "—";
    const enrolledAt = formatEnrolledDate(enrollee?.enrolled_at);
    const avatarBg   = enrollee?.avatar_color ?? "#1a7309";  // matches Index avatar_color default

    // Derive quick stats
    const certCount   = (enrollee?.certificates ?? []).length;
    const courseCount = (enrollee?.course_performance ?? []).length;
    const avgProgress = (() => {
        const cp = enrollee?.course_performance ?? [];
        if (!cp.length) return 0;
        return Math.round(cp.reduce((acc, c) => acc + (c.progress ?? 0), 0) / cp.length);
    })();

    // Palette mirrors Index stat card icon colors
    const stats = [
        { label: "Certificates", value: certCount,         color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Courses",      value: courseCount,        color: "#1a7309", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Avg Progress", value: `${avgProgress}%`, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    ];

    return (
        <Box>
            {/* ── Avatar + Name row ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
                {/* Avatar with pulse + gradient ring — keep interactions */}
                <Box
                    sx={{ position: "relative", flexShrink: 0 }}
                    onMouseEnter={() => setAvatarHovered(true)}
                    onMouseLeave={() => setAvatarHovered(false)}
                >
                    {/* Pulse ring */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: "-6px",
                            borderRadius: "50%",
                            border: "2px solid #16a34a",   // ← Index green
                            animation: "pulse-ring 2.5s ease-out infinite",
                            pointerEvents: "none",
                        }}
                    />
                    {/* Rotating gradient ring on hover */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: "-3px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1a7309, #16a34a, #2563eb)",
                            zIndex: 0,
                            transition: "transform 0.4s ease",
                            transform: avatarHovered ? "rotate(180deg) scale(1.05)" : "rotate(0deg) scale(1)",
                        }}
                    />
                    <Avatar
                        sx={{
                            width: 88,
                            height: 88,
                            bgcolor: avatarBg,
                            fontSize: "1.8rem",
                            fontWeight: 700,          // ← matches Index fontWeight 700
                            position: "relative",
                            zIndex: 1,
                            outline: "3px solid #fff",
                            transition: "transform 0.3s ease",
                            transform: avatarHovered ? "scale(1.06)" : "scale(1)",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.1)",  // ← subtle, matches Index card shadow
                        }}
                    >
                        {initials}
                    </Avatar>

                    {/* Verified badge */}
                    <Tooltip title="Verified Enrollee" placement="right">
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 2, right: 2, zIndex: 2,
                                bgcolor: "#fff",
                                borderRadius: "50%",
                                width: 22, height: 22,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                            }}
                        >
                            <VerifiedIcon sx={{ fontSize: 17, color: "#1a7309" }} />
                        </Box>
                    </Tooltip>
                </Box>

                {/* Name + meta */}
                <Box sx={{ minWidth: 0 }}>
                    {/* h4 fontWeight 700 #111827 — exact Index heading style */}
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            color: "#111827",
                            lineHeight: 1.2,
                            letterSpacing: "-0.3px",
                            animation: mounted ? "fadeSlideUp 0.5s ease 0.15s both" : "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {fullName}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.5,
                        animation: mounted ? "fadeSlideUp 0.5s ease 0.25s both" : "none" }}>
                        <EmailOutlinedIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                        <Typography variant="caption" sx={{ color: "text.secondary",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {email}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.5,
                        animation: mounted ? "fadeSlideUp 0.5s ease 0.32s both" : "none" }}>
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Enrolled since:{" "}
                            <Box component="span" sx={{ fontWeight: 600, color: "#374151" }}>
                                {enrolledAt}
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* ── Quick Stat Pills — styled like Index stat cards ── */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1.5,
                    animation: mounted ? "fadeSlideUp 0.5s ease 0.4s both" : "none",
                }}
            >
                {stats.map((s, i) => (
                    <Box
                        key={s.label}
                        className="stat-pill"
                        sx={{
                            bgcolor: s.bg,
                            border: "1px solid",
                            borderColor: s.border,
                            borderRadius: 2.5,          // ← matches Index card borderRadius 3
                            p: "10px 8px",
                            textAlign: "center",
                            cursor: "default",
                            animation: mounted ? `counterUp 0.4s ease ${0.45 + i * 0.07}s both` : "none",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ color: s.color, lineHeight: 1 }}
                        >
                            {s.value}
                        </Typography>
                        <Typography
                            variant="caption"
                            fontWeight={600}
                            sx={{
                                color: "text.secondary",
                                mt: 0.4,
                                display: "block",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                fontSize: "0.62rem",
                            }}
                        >
                            {s.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default EmployeeDetails;