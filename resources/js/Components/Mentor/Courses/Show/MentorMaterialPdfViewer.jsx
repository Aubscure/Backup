/**
 * Components/Mentor/Courses/Show/MentorMaterialPdfViewer.jsx
 * RESPONSIVE: xs/sm breakpoints added — md/lg/xl behaviour is unchanged.
 *
 * Changes on xs/sm:
 *  • Dialog is near-fullscreen on xs (fullWidth + tall PaperProps height).
 *  • Top-bar zoom controls are hidden on xs to save space; page nav stays.
 *  • Minimized tray is full-width on xs instead of a 380px floating corner card.
 *  • Font sizes and button sizes scaled down slightly.
 */

import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Stack,
    CircularProgress,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import CloseRoundedIcon            from '@mui/icons-material/CloseRounded';
import ChevronLeftRoundedIcon      from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon     from '@mui/icons-material/ChevronRightRounded';
import ZoomInRoundedIcon           from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon          from '@mui/icons-material/ZoomOutRounded';
import FitScreenRoundedIcon        from '@mui/icons-material/FitScreenRounded';
import MinimizeRoundedIcon         from '@mui/icons-material/MinimizeRounded';
import OpenInFullRoundedIcon       from '@mui/icons-material/OpenInFullRounded';
import CloseFullscreenRoundedIcon  from '@mui/icons-material/CloseFullscreenRounded';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const ZOOM_STEP    = 0.2;
const ZOOM_MIN     = 0.6;
const ZOOM_MAX     = 2.5;
const ZOOM_DEFAULT = 1.0;

export default function MentorMaterialPdfViewer({ open, onClose, url, title }) {
    const theme   = useTheme();
    const isXs    = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm    = useMediaQuery(theme.breakpoints.only('sm'));
    const isSmall = isXs || isSm;           // xs or sm — use condensed UI

    const [numPages,    setNumPages]    = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale,       setScale]       = useState(ZOOM_DEFAULT);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // ── PDF callbacks ──────────────────────────────────────────────────────
    const onDocumentLoadSuccess = useCallback(({ numPages }) => {
        setNumPages(numPages);
        setCurrentPage(1);
        setLoading(false);
        setError(false);
    }, []);

    const onDocumentLoadError = useCallback(() => {
        setLoading(false);
        setError(true);
    }, []);

    // ── Navigation ─────────────────────────────────────────────────────────
    const goToPrev = () => setCurrentPage(p => Math.max(1, p - 1));
    const goToNext = () => setCurrentPage(p => Math.min(numPages, p + 1));

    // ── Zoom ───────────────────────────────────────────────────────────────
    const zoomIn    = () => setScale(s => Math.min(ZOOM_MAX, +(s + ZOOM_STEP).toFixed(1)));
    const zoomOut   = () => setScale(s => Math.max(ZOOM_MIN, +(s - ZOOM_STEP).toFixed(1)));
    const zoomReset = () => setScale(ZOOM_DEFAULT);

    // ── Window controls ────────────────────────────────────────────────────
    const toggleMaximize = () => {
        setIsMaximized(p => !p);
        setIsMinimized(false);
    };

    const toggleMinimize = () => {
        setIsMinimized(p => !p);
        setIsMaximized(false);
    };

    const handleClose = () => {
        setIsMaximized(false);
        setIsMinimized(false);
        onClose();
    };

    // ── Reset on open ──────────────────────────────────────────────────────
    const handleEnter = () => {
        setNumPages(null);
        setCurrentPage(1);
        setScale(ZOOM_DEFAULT);
        setLoading(true);
        setError(false);
        setIsMaximized(false);
        setIsMinimized(false);
    };

    // ── Minimized tray positioning ─────────────────────────────────────────
    // xs: full-width bottom bar; sm+: original 380px corner float
    const minimizedStyles = isXs
        ? {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            m: 0,
            width: '100%',
            maxWidth: '100%',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
          }
        : {
            position: 'fixed',
            bottom: 24,
            right: 24,
            m: 0,
            width: 380,
            maxWidth: 380,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={isMaximized ? false : 'lg'}
            fullWidth
            // xs: always fullScreen when maximized; also near-fullscreen by default
            fullScreen={isMaximized || isXs}
            TransitionProps={{ onEnter: handleEnter }}
            PaperProps={{
                sx: {
                    borderRadius: (isMaximized || isXs) ? 0 : { sm: 2, md: 3 },
                    bgcolor: '#1a1a1a',
                    overflow: 'hidden',
                    height: isMinimized
                        ? 'auto'
                        : isMaximized || isXs
                            ? '100vh'
                            : { sm: '95vh', md: '92vh' },
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'height 0.25s ease, border-radius 0.2s ease, width 0.25s ease',
                    ...(isMinimized ? minimizedStyles : {}),
                },
            }}
        >
            {/* ── Top Bar ─────────────────────────────────────────────────── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // xs: slightly less horizontal padding
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.75, sm: 1 },
                    bgcolor: '#111',
                    borderBottom: isMinimized ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    flexShrink: 0,
                    cursor: isMinimized ? 'pointer' : 'default',
                    userSelect: 'none',
                    // xs: ensure the bar is tall enough for comfortable touch
                    minHeight: { xs: 48, sm: 'auto' },
                }}
                onClick={isMinimized ? toggleMinimize : undefined}
            >
                {/* Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        sx={{
                            color: 'grey.300',
                            maxWidth: isMinimized
                                ? (isXs ? '60vw' : 180)
                                : { xs: 160, sm: 240, md: 320 },
                            fontSize: { xs: '0.78rem', sm: '0.875rem' },
                        }}
                    >
                        {title || 'Document Viewer'}
                    </Typography>
                    {isMinimized && (
                        <Typography variant="caption" sx={{ color: 'grey.600', flexShrink: 0, fontSize: 10 }}>
                            tap to restore
                        </Typography>
                    )}
                </Box>

                {/* Controls */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.25}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Zoom + page nav — hidden when minimized ── */}
                    {!isMinimized && (
                        <>
                            {/* Zoom controls — hidden on xs to give space for page nav */}
                            {!isSmall && (
                                <>
                                    <Tooltip title="Zoom out">
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={zoomOut}
                                                disabled={scale <= ZOOM_MIN}
                                                sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                                            >
                                                <ZoomOutRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Reset zoom">
                                        <Typography
                                            variant="caption"
                                            onClick={zoomReset}
                                            sx={{
                                                color: 'grey.400', minWidth: 40, textAlign: 'center',
                                                cursor: 'pointer', fontWeight: 600,
                                                '&:hover': { color: 'white' },
                                            }}
                                        >
                                            {Math.round(scale * 100)}%
                                        </Typography>
                                    </Tooltip>

                                    <Tooltip title="Zoom in">
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={zoomIn}
                                                disabled={scale >= ZOOM_MAX}
                                                sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                                            >
                                                <ZoomInRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Fit to window">
                                        <IconButton
                                            size="small"
                                            onClick={zoomReset}
                                            sx={{ color: 'grey.400', '&:hover': { color: 'white' }, ml: 0.5 }}
                                        >
                                            <FitScreenRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Box sx={{ width: 1, height: 20, bgcolor: 'rgba(255,255,255,0.12)', mx: 1 }} />
                                </>
                            )}

                            {/* Page navigation — always visible */}
                            <Tooltip title="Previous page">
                                <span>
                                    <IconButton
                                        size="small"
                                        onClick={goToPrev}
                                        disabled={currentPage <= 1}
                                        sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                                    >
                                        <ChevronLeftRoundedIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'grey.400',
                                    minWidth: { xs: 44, sm: 60 },
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.68rem', sm: '0.75rem' },
                                }}
                            >
                                {numPages ? `${currentPage} / ${numPages}` : '—'}
                            </Typography>

                            <Tooltip title="Next page">
                                <span>
                                    <IconButton
                                        size="small"
                                        onClick={goToNext}
                                        disabled={!numPages || currentPage >= numPages}
                                        sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                                    >
                                        <ChevronRightRoundedIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>

                            {/* Separator before window controls — hide on xs */}
                            {!isXs && (
                                <Box sx={{ width: 1, height: 20, bgcolor: 'rgba(255,255,255,0.12)', mx: 1 }} />
                            )}
                        </>
                    )}

                    {/* ── Window controls ── */}

                    {/* Minimize — hide on xs (not meaningful on mobile) */}
                    {!isXs && (
                        <Tooltip title={isMinimized ? 'Restore' : 'Minimize'}>
                            <IconButton
                                size="small"
                                onClick={toggleMinimize}
                                sx={{
                                    color: 'grey.400',
                                    '&:hover': { color: '#fbbf24', bgcolor: 'rgba(251,191,36,0.12)' },
                                }}
                            >
                                <MinimizeRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Maximize — hide on xs (dialog is already fullscreen) */}
                    {!isXs && (
                        <Tooltip title={isMaximized ? 'Restore window' : 'Maximize'}>
                            <IconButton
                                size="small"
                                onClick={toggleMaximize}
                                sx={{
                                    color: 'grey.400',
                                    '&:hover': { color: '#34d399', bgcolor: 'rgba(52,211,153,0.12)' },
                                }}
                            >
                                {isMaximized
                                    ? <CloseFullscreenRoundedIcon fontSize="small" />
                                    : <OpenInFullRoundedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Close — always visible */}
                    <Tooltip title="Close">
                        <IconButton
                            size="small"
                            onClick={handleClose}
                            sx={{
                                color: 'grey.400',
                                // xs: slightly larger tap target
                                p: { xs: '6px', sm: '4px' },
                                '&:hover': { color: '#f87171', bgcolor: 'rgba(248,113,113,0.12)' },
                            }}
                        >
                            <CloseRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* ── PDF Canvas Area ────────────────────────────────────────── */}
            {!isMinimized && (
                <DialogContent
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        // xs: tighter padding so the PDF page has more width
                        py: { xs: 1.5, sm: 2, md: 3 },
                        px: { xs: 0.5, sm: 1, md: 2 },
                        bgcolor: '#2a2a2a',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {loading && !error && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 8 }}>
                            <CircularProgress size={36} sx={{ color: 'success.main' }} />
                            <Typography variant="body2" color="grey.500">Loading document…</Typography>
                        </Box>
                    )}

                    {error && (
                        <Box sx={{ textAlign: 'center', mt: 8, px: 2 }}>
                            <Typography variant="body1" color="error.light" fontWeight={600}>
                                Failed to load document
                            </Typography>
                            <Typography variant="body2" color="grey.500" sx={{ mt: 1 }}>
                                The file may be unavailable or inaccessible.
                            </Typography>
                        </Box>
                    )}

                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                    >
                        <Page
                            pageNumber={currentPage}
                            // xs: use width instead of scale so the page fills the dialog
                            width={isXs ? window.innerWidth - 8 : undefined}
                            scale={isXs ? undefined : scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            canvasBackground="#ffffff"
                            loading={null}
                        />
                    </Document>
                </DialogContent>
            )}

            {/* ── Bottom page bar ────────────────────────────────────────── */}
            {!isMinimized && numPages && numPages > 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        // xs: a touch taller for easier tapping
                        py: { xs: 1.25, sm: 1 },
                        bgcolor: '#111',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        flexShrink: 0,
                    }}
                >
                    <IconButton
                        // xs: medium size for easier touch
                        size={isXs ? 'medium' : 'small'}
                        onClick={goToPrev}
                        disabled={currentPage <= 1}
                        sx={{ color: 'grey.500', '&:hover': { color: 'white' } }}
                    >
                        <ChevronLeftRoundedIcon />
                    </IconButton>

                    <Typography
                        variant="caption"
                        sx={{
                            color: 'grey.400',
                            fontWeight: 600,
                            fontSize: { xs: '0.78rem', sm: '0.75rem' },
                            minWidth: { xs: 64, sm: 80 },
                            textAlign: 'center',
                        }}
                    >
                        Page {currentPage} of {numPages}
                    </Typography>

                    <IconButton
                        size={isXs ? 'medium' : 'small'}
                        onClick={goToNext}
                        disabled={currentPage >= numPages}
                        sx={{ color: 'grey.500', '&:hover': { color: 'white' } }}
                    >
                        <ChevronRightRoundedIcon />
                    </IconButton>
                </Box>
            )}
        </Dialog>
    );
}