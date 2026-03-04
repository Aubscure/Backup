import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// ── INTERNAL UI HELPERS ──────────────────────────────────────

function AddRowButton({ onClick, label }) {
    return (
        <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Tooltip title={label}>
                <IconButton
                    size="small"
                    onClick={onClick}
                    sx={{
                        bgcolor: '#f0fdf4',
                        color: '#187604',
                        '&:hover': { bgcolor: '#dcfce7' },
                        width: 32, height: 32,
                    }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
    );
}

function RemoveButton({ onClick }) {
    return (
        <Tooltip title="Remove">
            <IconButton
                size="small"
                onClick={onClick}
                sx={{
                    bgcolor: '#fff5f5',
                    color: 'error.main',
                    '&:hover': { bgcolor: '#fee2e2' },
                    width: 28, height: 28,
                }}
            >
                <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
        </Tooltip>
    );
}

function RowCard({ children, onRemove, showRemove }) {
    return (
        <Box
            mb={2}
            p={2}
            sx={{
                bgcolor: '#fafafa',
                borderRadius: 2,
                border: '1px solid #e8e8e8',
                position: 'relative',
            }}
        >
            {showRemove && (
                <Box position="absolute" top={8} right={8} zIndex={10}>
                    <RemoveButton onClick={onRemove} />
                </Box>
            )}
            {children}
        </Box>
    );
}

// ── MAIN COMPONENT ───────────────────────────────────────────

export default function MentorArraySection({
    titleComponent,
    items = [],
    field,
    setData,
    blankItem,
    addLabel,
    renderFields
}) {
    // Add a new empty row
    const addItem = () => {
        setData(field, [...items, blankItem]);
    };

    // Remove a row by index
    const removeItem = (indexToRemove) => {
        setData(field, items.filter((_, i) => i !== indexToRemove));
    };

    // Update specific field in a row
    const updateItem = (index, key, value) => {
        const newItems = items.map((row, i) =>
            i === index ? { ...row, [key]: value } : row
        );
        setData(field, newItems);
    };

    return (
        <Box mb={4}>
            {titleComponent}

            {items.map((item, i) => (
                <RowCard
                    key={i}
                    showRemove={items.length > 1}
                    onRemove={() => removeItem(i)}
                >
                    {renderFields(item, i, updateItem)}
                </RowCard>
            ))}

            <AddRowButton
                label={addLabel}
                onClick={addItem}
            />
        </Box>
    );
}
