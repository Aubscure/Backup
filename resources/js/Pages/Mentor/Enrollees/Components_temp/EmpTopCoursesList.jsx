import React, { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

// Progress color logic — mirrors Index ProgressCell thresholds exactly
function progressColor(pct) {
    if (pct === 100) return { bar: "#16a34a", track: "#dcfce7" };
    if (pct >= 60)   return { bar: "#1a7309", track: "#dcfce7" };
    if (pct >= 30)   return { bar: "#d97706", track: "#fef3c7" };
    return             { bar: "#e5e7eb",  track: "#f3f4f6" };
}

// Icon initials bg/color — mirrors Index avatar_color variety
const ICON_BG   = ["#eff6ff", "#fdf4ff", "#fefce8", "#f0fdf4"];
const ICON_TEXT = ["#2563eb", "#9333ea", "#ca8a04", "#1a7309"];

function CourseBar({ course, index, animate }) {
    const pct    = Math.min(Math.max(course.progress ?? 0, 0), 100);
    const colors = progressColor(pct);
    const [width, setWidth] = useState(0);
    const didAnimate = useRef(false);

    useEffect(() => {
        if (animate && !didAnimate.current) {
            didAnimate.current = true;
            const timer = setTimeout(() => setWidth(pct), 100 + index * 120);
            return () => clearTimeout(timer);
        }
    }, [animate, pct, index]);

    const shortLabel = (course.title ?? "")
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <Box
            className="course-bar-wrap"
            sx={{
                mb: 2.5,
                animation: animate ? `fadeSlideUp 0.4s ease ${0.05 + index * 0.1}s both` : "none",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.75 }}>
                {/* Course icon */}
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 1.5,
                        bgcolor: ICON_BG[index % ICON_BG.length],
                        color: ICON_TEXT[index % ICON_TEXT.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        flexShrink: 0,
                        border: "1px solid",
                        borderColor: `${ICON_TEXT[index % ICON_TEXT.length]}22`,
                    }}
                >
                    {shortLabel || "C"}
                </Box>

                <Tooltip title={course.title} placement="top">
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                            flex: 1,
                            color: "#111827",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {course.title}
                    </Typography>
                </Tooltip>

                {/* Pct — matches Index ProgressCell caption fontWeight 600 */}
                <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ color: "#374151", minWidth: 30, textAlign: "right" }}
                >
                    {pct}%
                </Typography>
            </Box>

            {/* Animated bar — height 7, borderRadius 4, bgcolor #f3f4f6 matches Index */}
            <Box
                sx={{
                    height: 7,
                    borderRadius: 4,
                    bgcolor: "#f3f4f6",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        width: `${width}%`,
                        bgcolor: colors.bar,
                        borderRadius: 4,
                        transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        position: "relative",
                        // Glowing dot at the tip — kept for immersion
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            bgcolor: colors.bar,
                            boxShadow: `0 0 5px ${colors.bar}`,
                            opacity: width > 0 ? 1 : 0,
                            transition: "opacity 0.3s ease 0.6s",
                        },
                    }}
                />
            </Box>
        </Box>
    );
}

function EmpTopCoursesList({ enrollee, mounted }) {
    const courses = enrollee?.top_courses ?? [];

    return (
        <Box>
            {/* Header — caption uppercase like Index table headers */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                        color: "#111827",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontSize: "0.75rem",
                    }}
                >
                    Top Courses
                </Typography>
                {courses.length > 0 && (
                    <Box sx={{ px: 1, py: 0.15, borderRadius: 1.5, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#1a7309" }}>
                            {courses.length} active
                        </Typography>
                    </Box>
                )}
            </Box>

            {courses.length === 0 ? (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 3,
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "divider",
                        bgcolor: "#f9fafb",
                    }}
                >
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        No course progress yet.
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {courses.map((course, i) => (
                        <CourseBar key={course.id} course={course} index={i} animate={mounted} />
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default EmpTopCoursesList;