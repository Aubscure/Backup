import React from "react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineOutlined from "@mui/icons-material/RemoveCircleOutlineOutlined";

function McqEditor({
    temp_id,
    questionData,
    onUpdateQuestion,
    onDeleteOption,
}) {
    const { question_text, options = [], answer = [] } = questionData;

    const handleTextChange = (e) => {
        onUpdateQuestion(temp_id, { question_text: e.target.value });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        onUpdateQuestion(temp_id, { options: newOptions });
    };

    const handleCheck = (index) => {
        let newAnswer;
        if (answer.includes(index)) {
            newAnswer = answer.filter((i) => i !== index);
        } else {
            newAnswer = [...answer, index];
        }
        onUpdateQuestion(temp_id, { answer: newAnswer });
    };

    const addOption = () => {
        onUpdateQuestion(temp_id, { options: [...options, ""] });
    };

    const handleDeleteOption = (temp_id, index) => {
        onDeleteOption(temp_id, index);
    };

    return (
        <Card sx={{ paddingX: "24px", paddingY: "24px", boxShadow: "none" }}>
            <TextField
                value={question_text}
                onChange={handleTextChange}
                placeholder="What is the question?"
                variant="standard"
                fullWidth
            />
            <Stack sx={{ marginTop: "16px", gap: "4px" }}>
                {options.map((option, index) => (
                    <Stack
                        key={index}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Checkbox
                            checked={answer.includes(index)}
                            onChange={() => handleCheck(index)}
                        />
                        <TextField
                            value={option}
                            size="small"
                            onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                            }
                            fullWidth
                        />
                        <Button
                            onClick={() => handleDeleteOption(temp_id, index)}
                            sx={{ minWidth: "auto", color: "#0D1B17" }}
                        >
                            <RemoveCircleOutlineOutlined />
                        </Button>
                    </Stack>
                ))}
                <Button size="small" onClick={addOption}>
                    <AddIcon sx={{ color: "#2B7C30" }} />
                </Button>
            </Stack>
        </Card>
    );
}

export default McqEditor;
