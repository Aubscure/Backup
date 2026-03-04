import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import Box from "@mui/material/Box";
import QuestionItem from "../Pages/Mentor/Assessment/QuestionItem";

function SortableQuestionItem({
    question,
    index,
    onDeleteQuestion,
    updateQuestion,
    onUpdatePoints,
    deleteOption,
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: question.temp_id });

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
    };

    return (
        <Box ref={setNodeRef} style={style}>
            <QuestionItem
                key={question.temp_id}
                question={question}
                index={index}
                onDeleteQuestion={onDeleteQuestion}
                updateQuestion={updateQuestion}
                onUpdatePoints={onUpdatePoints}
                deleteOption={deleteOption}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </Box>
    );
}

export default SortableQuestionItem;
