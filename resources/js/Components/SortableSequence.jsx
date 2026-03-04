import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import IconButton from "@mui/material/IconButton";

function SortableSequence({ id, text, onChange }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    };

    return (
        <Box ref={setNodeRef} style={style}>
            <IconButton
                {...listeners}
                {...attributes}
                size="small"
                sx={{ cursor: "grab", flexShrink: 0 }}
            >
                <DragIndicatorOutlinedIcon />
            </IconButton>
            <TextField
                value={text}
                onChange={(e) => onChange(e.target.value)}
                size="small"
                fullWidth
                onPointerDown={(e) => e.stopPropagation()}
            />
        </Box>
    );
}

export default SortableSequence;
