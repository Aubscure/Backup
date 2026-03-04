import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Icon palette — uses Index icon bg/color conventions
const CERT_PALETTE = [
    { bg: "#f0fdf4", color: "#1a7309", border: "#bbf7d0" },  // green — primary Index color
    { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },  // blue
    { bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },  // purple — Index cert icon color
    { bg: "#fff7ed", color: "#d97706", border: "#fed7aa" },  // amber — Index ongoing color
];

function CertRow({ cert, index, visible }) {
    const palette = CERT_PALETTE[index % CERT_PALETTE.length];

    return (
        <Box
            className="cert-row"
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1.5,
                animation: visible ? `fadeSlideUp 0.4s ease ${index * 0.07}s both` : "none",
            }}
        >
            {/* Icon — keep rotation hover interaction */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: palette.border,
                    borderRadius: 2,              // ← matches Index chip borderRadius 1.5–2
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    bgcolor: palette.bg,
                    color: palette.color,
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "rotate(-8deg) scale(1.1)" },
                }}
            >
                <WorkspacePremiumIcon sx={{ fontSize: 18 }} />
            </Box>

            {/* Text */}
            <Box sx={{ minWidth: 0 }}>
                <Tooltip title={cert.title} placement="top">
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            color: "#111827",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {cert.title}
                    </Typography>
                </Tooltip>
                <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.2, display: "block" }}>
                    {cert.issued_at}
                </Typography>
            </Box>

            {/* Issued badge — matches Index Chip style */}
            <Box
                sx={{
                    ml: "auto",
                    flexShrink: 0,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1.5,
                    bgcolor: palette.bg,
                    border: "1px solid",
                    borderColor: palette.border,
                }}
            >
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: palette.color, letterSpacing: "0.06em" }}>
                    ISSUED
                </Typography>
            </Box>
        </Box>
    );
}

function EmpCertificationLists({ enrollee }) {
    const certs    = enrollee?.certificates ?? [];
    const [showAll, setShowAll] = useState(false);
    const visible  = certs.slice(0, 3);
    const overflow = certs.slice(3);
    const hasMore  = overflow.length > 0;

    return (
        <Box>
            {/* ── Header ── */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    {/* Section label — uppercase caption like Index table headers */}
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
                        Certificates
                    </Typography>
                    {certs.length > 0 && (
                        <Box
                            sx={{
                                px: 1,
                                py: 0.15,
                                borderRadius: 1.5,
                                bgcolor: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                            }}
                        >
                            <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#16a34a" }}>
                                {certs.length}
                            </Typography>
                        </Box>
                    )}
                </Box>
                {hasMore && (
                    <Button
                        size="small"
                        onClick={() => setShowAll((p) => !p)}
                        endIcon={
                            <KeyboardArrowDownIcon
                                sx={{
                                    transition: "transform 0.3s ease",
                                    transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
                                    fontSize: "16px !important",
                                }}
                            />
                        }
                        sx={{
                            color: "#1a7309",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": { bgcolor: "#f0fdf4" },
                            borderRadius: 1.5,
                            px: 1,
                        }}
                    >
                        {showAll ? "Show Less" : `+${overflow.length} more`}
                    </Button>
                )}
            </Box>

            {/* ── Certs ── */}
            {certs.length === 0 ? (
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
                    <WorkspacePremiumIcon sx={{ fontSize: 28, color: "text.disabled", mb: 0.5 }} />
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                        No certificates issued yet.
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {visible.map((cert, i) => (
                        <CertRow key={cert.id} cert={cert} index={i} visible />
                    ))}
                    <Collapse in={showAll} timeout={400}>
                        <Box>
                            {overflow.map((cert, i) => (
                                <CertRow key={cert.id} cert={cert} index={visible.length + i} visible={showAll} />
                            ))}
                        </Box>
                    </Collapse>
                </Box>
            )}
        </Box>
    );
}

export default EmpCertificationLists;