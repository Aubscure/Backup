import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SortableSequence from "@/Components/SortableSequence";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function SequenceEditor({
    temp_id,
    questionData,
    onUpdateQuestion,
    onDeleteOption,
}) {
    const { question_text, items = [] } = questionData;

    const handleTextChange = (e) => {
        onUpdateQuestion(temp_id, { question_text: e.target.value });
    };

    const addItem = () => {
        onUpdateQuestion(temp_id, {
            items: [...items, { id: crypto.randomUUID(), text: "" }],
        });
    };

    const updateItemText = (id, newText) => {
        onUpdateQuestion(temp_id, {
            items: items.map((i) =>
                i.id === id ? { ...i, text: newText } : i
            ),
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        onUpdateQuestion(temp_id, {
            items: arrayMove(items, oldIndex, newIndex),
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    return (
        <Card sx={{ px: 3, py: 3, boxShadow: "none" }}>
            <TextField
                value={question_text}
                onChange={handleTextChange}
                placeholder="What is the question?"
                variant="standard"
                fullWidth
            />

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Stack spacing={1} mt={2}>
                        {items.map((item) => (
                            <SortableSequence
                                key={item.id}
                                id={item.id}
                                text={item.text}
                                onChange={(val) => updateItemText(item.id, val)}
                            />
                        ))}
                    </Stack>
                </SortableContext>
            </DndContext>
            <Button onClick={addItem} sx={{ mt: 2 }} fullWidth>
                <AddIcon sx={{ color: "#2B7C30" }} />
            </Button>
        </Card>
    );
}

export default SequenceEditor;
