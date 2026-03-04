import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { STATUS_META } from "@/Components/Mentor/Enrollees/enrolleeData";

// ── Syllabus row — animated progress, uniform colors ─────────────────────────
function SyllabusRow({ s, index, parentExpanded }) {
    const [width, setWidth] = useState(0);
    const pct = Math.min(Math.max(s.progress ?? 0, 0), 100);

    useEffect(() => {
        if (!parentExpanded) { setWidth(0); return; }
        const t = setTimeout(() => setWidth(pct), 80 + index * 60);
        return () => clearTimeout(t);
    }, [parentExpanded, pct, index]);

    // Mirrors Index ProgressCell color thresholds
    const barColor =
        pct === 100 ? "#16a34a" :
        pct >= 60   ? "#1a7309" :
        pct >= 30   ? "#d97706" :
                      "#e5e7eb";

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 1.2,
                px: 2,
                borderRadius: 1.5,
                transition: "background 0.15s ease",
                animation: parentExpanded ? `fadeSlideUp 0.35s ease ${index * 0.06}s both` : "none",
                "&:hover": { bgcolor: "#f9fafb" },
            }}
        >
            {/* Dot */}
            <Box
                sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: barColor,
                    flexShrink: 0,
                }}
            />

            {/* Name — body2 like Index table cells */}
            <Typography
                variant="body2"
                sx={{ color: "#374151", minWidth: "130px", fontWeight: 500 }}
            >
                {s.name}
            </Typography>

            {/* Bar — height 7, borderRadius 4, bgcolor #f3f4f6 matches Index exactly */}
            <Box sx={{ flex: 1, height: 7, borderRadius: 4, bgcolor: "#f3f4f6", overflow: "hidden" }}>
                <Box
                    sx={{
                        height: "100%",
                        width: `${width}%`,
                        bgcolor: barColor,
                        borderRadius: 4,
                        transition: "width 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)",
                    }}
                />
            </Box>

            {/* Pct — matches Index ProgressCell caption */}
            <Typography variant="caption" fontWeight={600} sx={{ color: "#374151", minWidth: 30, textAlign: "right" }}>
                {pct}%
            </Typography>
        </Box>
    );
}

// ── Metric badge ──────────────────────────────────────────────────────────────
function MetricBadge({ label, value, color }) {
    return (
        <Box>
            <Typography
                variant="caption"
                sx={{
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontSize: "0.62rem",
                    lineHeight: 1,
                    display: "block",
                }}
            >
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: color ?? "#111827", lineHeight: 1.4 }}>
                {value}
            </Typography>
        </Box>
    );
}

// ── Status chip — exact same style as Index EnrolleeTable StatusChip ──────────
function StatusChip({ status }) {
    const key  = status?.toLowerCase();
    const meta = STATUS_META[key] ?? { label: status ?? "—", color: "#6b7280", bg: "#f1f5f9" };
    return (
        <Chip
            label={meta.label.toUpperCase()}
            size="small"
            sx={{
                bgcolor: meta.bg,
                color: meta.color,
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.06em",
                border: `1px solid ${meta.color}30`,
                borderRadius: 1.5,
                height: 22,
                "& .MuiChip-label": { px: 1 },
            }}
        />
    );
}

// ── Main PerformanceDetails ───────────────────────────────────────────────────
function PerformanceDetails({ enrollee, mounted }) {
    const courses = enrollee?.course_performance ?? [];
    const [expanded, setExpanded] = useState(false);
    const [filter, setFilter]     = useState("all");

    const handleChange = (id) => (_e, isExp) => setExpanded(isExp ? id : false);

    const filtered = filter === "all"
        ? courses
        : courses.filter((c) => (c.status ?? "").toLowerCase() === filter);

    // Summary stats — colors mirror Index stat card icon colors
    const totalCourses   = courses.length;
    const ongoingCount   = courses.filter((c) => c.status?.toLowerCase() === "ongoing").length;
    const completedCount = courses.filter((c) => c.status?.toLowerCase() === "completed").length;
    const avgScore       = courses.length
        ? Math.round(
            courses.reduce((acc, c) => {
                const raw = String(c.assessment_score ?? "0").replace(/[^0-9.]/g, "");
                return acc + (parseFloat(raw) || 0);
            }, 0) / courses.length
          )
        : 0;

    const summaryStats = [
        { label: "Total Courses", value: totalCourses,   color: "#1a7309", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Ongoing",       value: ongoingCount,   color: "#d97706", bg: "#fffbeb", border: "#fed7aa" },
        { label: "Completed",     value: completedCount, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Avg Score",     value: `${avgScore}%`, color: "#9333ea", bg: "#fdf4ff", border: "#e9d5ff" },
    ];

    return (
        <Box>
            {/* ── Panel Header — bg white, border-bottom like Index filters bar ── */}
            <Box
                sx={{
                    px: { xs: 2.5, sm: 3 },
                    pt: 3,
                    pb: 2.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                {/* Title row + filter — mirrors Index filter bar layout */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2.5,
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: "#111827" }}>
                            Performance Details
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                            Comprehensive tracking of enrollee progress and scores
                        </Typography>
                    </Box>

                    {/* Filter — matches Index Select borderRadius 2.5 */}
                    <Select
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setExpanded(false); }}
                        size="small"
                        sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#374151",
                            borderRadius: 2.5,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1a7309" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1a7309" },
                            minWidth: 120,
                            height: 36,
                        }}
                    >
                        <MenuItem value="all"       sx={{ fontSize: "0.8rem" }}>All</MenuItem>
                        <MenuItem value="ongoing"   sx={{ fontSize: "0.8rem" }}>Ongoing</MenuItem>
                        <MenuItem value="completed" sx={{ fontSize: "0.8rem" }}>Completed</MenuItem>
                        <MenuItem value="cancelled" sx={{ fontSize: "0.8rem" }}>Cancelled</MenuItem>
                    </Select>
                </Box>

                {/* Summary stat grid — styled like Index stat cards */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 1.5,
                        animation: mounted ? "fadeSlideUp 0.5s ease 0.2s both" : "none",
                    }}
                >
                    {summaryStats.map((s, i) => (
                        <Box
                            key={s.label}
                            className="stat-pill"
                            sx={{
                                bgcolor: s.bg,
                                borderRadius: 2.5,
                                p: "10px 8px",
                                textAlign: "center",
                                border: "1px solid",
                                borderColor: s.border,
                                animation: mounted ? `counterUp 0.4s ease ${0.25 + i * 0.06}s both` : "none",
                                cursor: "default",
                            }}
                        >
                            <Typography variant="h5" fontWeight={700} sx={{ color: s.color, lineHeight: 1 }}>
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

            {/* ── Course list ── */}
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                {filtered.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 6,
                            borderRadius: 2,
                            border: "1px dashed",
                            borderColor: "divider",
                            bgcolor: "#f9fafb",
                            mt: 1,
                        }}
                    >
                        <SchoolOutlinedIcon sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            No courses match this filter.
                        </Typography>
                    </Box>
                ) : (
                    filtered.map((course, i) => (
                        <CourseAccordion
                            key={course.id}
                            course={course}
                            index={i}
                            expanded={expanded === course.id}
                            onChange={handleChange(course.id)}
                            mounted={mounted}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}

// ── Single Course Accordion ───────────────────────────────────────────────────
function CourseAccordion({ course, index, expanded, onChange, mounted }) {
    const syllabus = course.syllabus ?? [];
    const pct      = Math.min(Math.max(course.progress ?? 0, 0), 100);

    // Index ProgressCell thresholds
    const barColor =
        pct === 100 ? "#16a34a" :
        pct >= 60   ? "#1a7309" :
        pct >= 30   ? "#d97706" :
                      "#e5e7eb";

    const [barWidth, setBarWidth] = useState(0);
    const didAnimate = useRef(false);

    useEffect(() => {
        if (mounted && !didAnimate.current) {
            didAnimate.current = true;
            const t = setTimeout(() => setBarWidth(pct), 200 + index * 100);
            return () => clearTimeout(t);
        }
    }, [mounted, pct, index]);

    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            disableGutters
            className="accordion-course"
            sx={{
                mb: 1.5,
                borderRadius: "12px !important",   // slightly softer than 16px, closer to Index borderRadius 3
                border: "1px solid",
                borderColor: expanded ? "#1a730940" : "divider",
                boxShadow: expanded
                    ? "0 6px 24px rgba(0,0,0,0.08) !important"
                    : "none !important",
                overflow: "hidden",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease !important",
                animation: mounted ? `fadeSlideUp 0.45s ease ${0.05 + index * 0.07}s both` : "none",
                "&::before": { display: "none" },
                bgcolor: expanded ? "#f9fafb" : "#ffffff",
                transition: "background 0.2s ease !important",
            }}
        >
            <AccordionSummary
                expandIcon={
                    /* Expand icon button — green when expanded, grey when not */
                    <Box
                        sx={{
                            width: 26,
                            height: 26,
                            borderRadius: 1.5,
                            bgcolor: expanded ? "#1a7309" : "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.2s ease",
                            flexShrink: 0,
                        }}
                    >
                        <ExpandMoreOutlinedIcon
                            sx={{
                                fontSize: 17,
                                color: expanded ? "#fff" : "#6b7280",
                                transition: "transform 0.3s ease",
                                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        />
                    </Box>
                }
                sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 1.75,
                    "&.MuiAccordionSummary-root": { minHeight: "auto" },
                    "& .MuiAccordionSummary-content": { my: 0, mr: 1.5, minWidth: 0 },
                }}
            >
                <Box sx={{ width: "100%", minWidth: 0 }}>
                    {/* Title + Status */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.75, flexWrap: "wrap" }}>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                color: "#111827",
                                flex: 1,
                                minWidth: 0,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {course.title}
                        </Typography>
                        <StatusChip status={course.status} />
                    </Box>

                    {/* Mini progress bar — height 7 borderRadius 4 #f3f4f6 = Index exact */}
                    <Box
                        sx={{
                            height: 7,
                            borderRadius: 4,
                            bgcolor: "#f3f4f6",
                            overflow: "hidden",
                            mb: 1.25,
                        }}
                    >
                        <Box
                            sx={{
                                height: "100%",
                                width: `${barWidth}%`,
                                bgcolor: barColor,
                                borderRadius: 4,
                                transition: "width 0.9s cubic-bezier(0.34, 1.3, 0.64, 1)",
                            }}
                        />
                    </Box>

                    {/* Metrics */}
                    <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, flexWrap: "wrap", alignItems: "center" }}>
                        <MetricBadge label="Syllabus"   value={syllabus.length}               color="#374151" />
                        <MetricBadge label="Progress"   value={`${pct}%`}                     color={barColor === "#e5e7eb" ? "#9ca3af" : barColor} />
                        <MetricBadge label="Score"      value={course.assessment_score ?? "—"} color="#9333ea" />
                        <MetricBadge label="Assessment" value={course.assessment ?? "—"}       color="#d97706" />
                    </Box>
                </Box>
            </AccordionSummary>

            {/* Syllabus rows */}
            <AccordionDetails
                sx={{
                    px: { xs: 1, sm: 2 },
                    pt: 0,
                    pb: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                {syllabus.length === 0 ? (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", textAlign: "center", py: 2 }}>
                        No syllabus data available for this course.
                    </Typography>
                ) : (
                    <Box sx={{ pt: 0.5 }}>
                        {syllabus.map((s, si) => (
                            <SyllabusRow key={s.id} s={s} index={si} parentExpanded={expanded} />
                        ))}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}

export default PerformanceDetails;