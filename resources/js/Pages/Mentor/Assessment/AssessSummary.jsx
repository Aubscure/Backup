import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

function AssessSummary({ data }) {
    const totalQuestions = data.questions.length;
    const totalPoints = data.questions.reduce(
        (sum, q) => sum + Number(q.points || 0),
        0
    );
    const formatPerQuestionTime = () => {
        if (!data.has_time_limit) return "No time limit";
        if (totalQuestions === 0) return "—";

        const totalSeconds =
            Number(data.time_limit_hrs || 0) * 3600 +
            Number(data.time_limit_mins || 0) * 60 +
            Number(data.time_limit_secs || 0);

        if (totalSeconds === 0) return "0 sec";

        const perQuestion = Math.floor(totalSeconds / totalQuestions);

        const mins = Math.floor(perQuestion / 60);
        const secs = perQuestion % 60;

        if (mins > 0 && secs > 0) return `${mins} min ${secs} sec`;
        if (mins > 0) return `${mins} min`;
        return `${secs} sec`;
    };

    return (
        <Card
            sx={{
                borderRadius: "24px",
                padding: "24px",
                backgroundColor: "#ecfdf5",
                borderColor: "#E2E8F0",
                transition: "transform 0.4s ease",
                "&:hover": {
                    transform: "scale(1.02)",
                }
            }}
        >
            <Typography align="center" fontWeight="bold" paddingBottom="16px">
                Assessment Summary
            </Typography>
            <Stack gap="8px">
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Total Questions</Typography>
                    <Typography>{totalQuestions} Questions</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Total Points</Typography>
                    <Typography>{totalPoints} Points</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Estimated Time / Question</Typography>
                    <Typography>{formatPerQuestionTime()}</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}

export default AssessSummary;
