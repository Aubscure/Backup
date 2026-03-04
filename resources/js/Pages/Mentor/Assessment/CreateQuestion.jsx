import React, { useState } from "react";
import QuestionType from "./QuestionType";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableQuestionItem from "@/Components/SortableQuestionItem";

function CreateQuestion({
    questions,
    addQuestion,
    deleteQuestion,
    updateQuestion,
    updatePoints,
    deleteOption,
    reorderQuestions,
}) {
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = questions.findIndex(
                (q) => q.temp_id === active.id
            );
            const newIndex = questions.findIndex((q) => q.temp_id === over.id);
            reorderQuestions(arrayMove(questions, oldIndex, newIndex)); // ✅
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    return (
        <Stack width="100%" gap="24px">
            <QuestionType onAddQuestion={addQuestion} />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={questions.map((q) => q.temp_id)}
                    strategy={verticalListSortingStrategy}
                >
                    {questions.map((q, index) => (
                        <SortableQuestionItem
                            key={q.temp_id}
                            question={q}
                            index={index}
                            onDeleteQuestion={deleteQuestion}
                            updateQuestion={updateQuestion}
                            onUpdatePoints={updatePoints}
                            deleteOption={deleteOption}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </Stack>
    );
}

export default CreateQuestion;
