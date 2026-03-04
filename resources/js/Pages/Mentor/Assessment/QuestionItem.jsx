import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import McqEditor from "./McqEditor";
import TextField from "@mui/material/TextField";
import TrueFalseEditor from "./TrueFalseEditor";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import SequenceEditor from "./SequenceEditor";

function QuestionItem({
    question,
    index,
    onDeleteQuestion,
    updateQuestion,
    onUpdatePoints,
    deleteOption,
    dragHandleProps
}) {
    return (
        <Stack
            sx={{
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
        >
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    backgroundColor: "#F8FAFC",
                    px: 3,
                    py: 1.5,
                    borderBottom: "1px solid #E5E7EB",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <DragIndicatorOutlinedIcon {...dragHandleProps} sx={{ fontSize: "16px", cursor: "grab" }} />
                    <Typography
                        fontWeight={600}
                        fontSize="14px"
                        color="#6B7280"
                    >
                        {question.type === "multiple choice" &&
                            "Multiple Choice"}
                        {question.type === "true or false" && "True or False"}
                        {question.type === "sequence" && "Sequence"}
                    </Typography>
                </Box>
                <Button
                    onClick={() => onDeleteQuestion(question.temp_id)}
                    sx={{
                        minWidth: "auto",
                        color: "#0D1B17",
                    }}
                >
                    <DeleteOutlinedIcon />
                </Button>
            </Stack>
            {/* Editor */}
            <Box sx={{ p: 3, backgroundColor: "white" }}>
                {question.type === "multiple choice" && (
                    <McqEditor
                        temp_id={question.temp_id}
                        questionData={question.data}
                        onUpdateQuestion={updateQuestion}
                        onDeleteOption={deleteOption}
                    />
                )}
                {question.type === "true or false" && (
                    <TrueFalseEditor
                        temp_id={question.temp_id}
                        questionData={question.data}
                        onUpdateQuestion={updateQuestion}
                    />
                )}
                {question.type === "sequence" && (
                    <SequenceEditor
                        temp_id={question.temp_id}
                        questionData={question.data}
                        onUpdateQuestion={updateQuestion}
                        onDeleteOption={deleteOption}
                    />
                )}
            </Box>
            {/* Footer */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                gap={1}
                sx={{
                    px: 3,
                    py: 1.5,
                    borderTop: "1px solid #E5E7EB",
                    backgroundColor: "#FAFAFA",
                }}
            >
                <Typography fontSize={14}>Points:</Typography>
                <TextField
                    value={question.points}
                    type="number"
                    onChange={(e) =>
                        onUpdatePoints(question.temp_id, e.target.value)
                    }
                    InputProps={{
                        min: 0,
                        max: 100,
                    }}
                    size="small"
                    sx={{
                        width: "80px",
                        "& .MuiOutlinedInput-root": {
                            height: "32px",
                        },
                    }}
                />
            </Stack>
        </Stack>
    );
}

export default QuestionItem;
