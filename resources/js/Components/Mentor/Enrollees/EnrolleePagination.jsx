import React from 'react';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function EnrolleePagination({
    currentPage,
    totalPages,
    totalCount,
    perPage,
    onPageChange,
}) {
    const from = (currentPage - 1) * perPage + 1;
    const to   = Math.min(currentPage * perPage, totalCount);

    // Build page numbers: show first, last, current ±1, with ellipsis
    const pageNums = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const set = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(p => p >= 1 && p <= totalPages));
        const sorted = [...set].sort((a, b) => a - b);
        const result = [];
        sorted.forEach((p, i) => {
            if (i > 0 && p - sorted[i - 1] > 1) result.push('…');
            result.push(p);
        });
        return result;
    };

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1.5} sx={{ pt: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Showing{' '}
                <Box component="span" fontWeight={600} color="#111827">{from}–{to}</Box>
                {' '}of{' '}
                <Box component="span" fontWeight={600} color="#111827">{totalCount.toLocaleString()}</Box>
                {' '}enrollees
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center">
                <IconButton
                    size="small"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    sx={{ border: '1px solid #e5e7eb', borderRadius: 1.5, width: 30, height: 30 }}
                >
                    <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </IconButton>

                {pageNums().map((p, i) =>
                    p === '…' ? (
                        <Typography key={`ellipsis-${i}`} variant="caption" sx={{ px: 0.5, color: 'text.disabled' }}>…</Typography>
                    ) : (
                        <Box
                            key={p}
                            onClick={() => onPageChange(p)}
                            sx={{
                                width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 1.5, cursor: 'pointer',
                                bgcolor: p === currentPage ? '#1a7309' : 'transparent',
                                color: p === currentPage ? 'white' : '#374151',
                                fontWeight: p === currentPage ? 700 : 500,
                                fontSize: '0.8rem',
                                border: '1px solid',
                                borderColor: p === currentPage ? '#1a7309' : '#e5e7eb',
                                transition: 'all 0.15s',
                                '&:hover': p !== currentPage ? { bgcolor: '#f3f4f6' } : {},
                            }}
                        >
                            {p}
                        </Box>
                    )
                )}

                <IconButton
                    size="small"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    sx={{ border: '1px solid #e5e7eb', borderRadius: 1.5, width: 30, height: 30 }}
                >
                    <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Stack>
        </Stack>
    );
}