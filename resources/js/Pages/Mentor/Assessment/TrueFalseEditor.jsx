import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

function TrueFalseEditor({ temp_id, questionData, onUpdateQuestion }) {
    return (
        <Card
            sx={{
                paddingX: "24px",
                paddingY: "24px",
                boxShadow: "none",
            }}
        >
            <TextField
                value={questionData.question_text}
                onChange={(e) =>
                    onUpdateQuestion(temp_id, { question_text: e.target.value })
                }
                placeholder="What is the question?"
                variant="standard"
                fullWidth
            />
            <FormControl sx={{ marginTop: "16px", gap: "4px" }}>
                <RadioGroup
                    value={questionData.answer}
                    onChange={(e) =>
                        onUpdateQuestion(temp_id, {
                            answer: e.target.value === "true",
                        })
                    }
                >
                    <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="True"
                    />
                    <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="False"
                    />
                </RadioGroup>
            </FormControl>
        </Card>
    );
}

export default TrueFalseEditor;
