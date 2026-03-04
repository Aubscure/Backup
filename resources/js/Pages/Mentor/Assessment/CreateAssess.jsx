import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import AssessDetails from "./AssessDetails";
import AssessSettings from "./AssessSettings";
import AssessSummary from "./AssessSummary";
import CreateQuestion from "./CreateQuestion";
import { useForm, usePage } from "@inertiajs/react";
import MentorLayout from "@/Layouts/MentorLayout";
import { Head } from "@inertiajs/react";

function CreateAssess() {
    const { courseData } = usePage().props;
    const { data, setData, post, transform, processing, errors } = useForm({
        // AssessDetails
        title: "",
        description: "",
        course_id: "",
        assessmentable_id: "",
        assessmentable_type: "syllabus",
        // AssessSettings
        is_draft: true,
        passing_grade: 70,
        has_time_limit: false,
        time_limit_hrs: 0,
        time_limit_mins: 0,
        time_limit_secs: 0,
        is_randomized: false,
        // Question
        questions: [],
    });

    const handleSubmit = (e, isDraft) => {
        transform((data) => ({
            ...data,
            is_draft: isDraft,
            questions: data.questions.map((q) => ({
                ...q,
                data: {
                    ...q.data,
                    ...(q.data.options && {
                        options: q.data.options.filter((o) => o.trim() !== ""),
                    }),
                },
            })),
        }));

        post(route("assessment.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setData({
                    title: "",
                    description: "",
                    course_id: null,
                    assessmentable_id: "",
                    assessmentable_type: "syllabus",
                    is_draft: true,
                    passing_grade: 70,
                    has_time_limit: false,
                    time_limit_hrs: 0,
                    time_limit_mins: 0,
                    time_limit_secs: 0,
                    is_randomized: false,
                    questions: [],
                });
                alert(isDraft ? "Draft saved!" : "Assessment created!");
            },
            onError: (errors) => {
                console.error("Assessment creation issue:", errors);
            },
        });
    };

    const QUESTION_TEMPLATES = {
        "multiple choice": () => ({
            question_text: "",
            options: [],
            answer: "",
        }),
        "true or false": () => ({
            question_text: "",
            answer: null,
        }),
        sequence: () => ({
            question_text: "",
            items: [],
        }),
    };

    const addQuestion = (type) => {
        setData("questions", [
            ...data.questions,
            {
                temp_id: crypto.randomUUID(),
                type,
                points: 1,
                order: data.questions.length + 1,
                data: QUESTION_TEMPLATES[type](),
            },
        ]);
    };

    const deleteQuestion = (temp_id) => {
        setData(
            "questions",
            data.questions
                .filter((q) => q.temp_id !== temp_id)
                .map((q, idx) => ({ ...q, order: idx + 1 }))
        );
    };

    const updateQuestion = (temp_id, newData) => {
        setData(
            "questions",
            data.questions.map((q) =>
                q.temp_id === temp_id
                    ? { ...q, data: { ...q.data, ...newData } }
                    : q
            )
        );
    };

    const updatePoints = (temp_id, newPoints) => {
        const updated = data.questions.map((q) => {
            if (q.temp_id === temp_id) {
                return { ...q, points: newPoints };
            } else {
                return q;
            }
        });
        setData("questions", updated);
    };

    const deleteOption = (temp_id, option_idx) => {
        setData(
            "questions",
            data.questions.map((q) => {
                if (q.temp_id === temp_id) {
                    return {
                        ...q,
                        data: {
                            ...q.data,
                            options: q.data.options.filter(
                                (_, index) => index !== option_idx
                            ),
                        },
                    };
                }
                return q;
            })
        );
    };

    const reorderQuestions = (reordered) => {
        setData("questions", reordered);
    }

    return (
        <Box>
            <Head title="Assessment" />
            <CssBaseline />
            <Box
                sx={{
                    p: { xs: 2, md: 3 },
                    bgcolor: "#f1f4f9",
                    minHeight: "100%",
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        padding: "12px",
                        minWidth: 0,
                    }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        gap="32px"
                        alignItems="flex-start"
                    >
                        <Stack
                            flex={2}
                            gap="24px"
                            sx={{ width: { xs: "100%", md: "50%" } }}
                        >
                            <AssessDetails
                                data={data}
                                onSetData={setData}
                                courseData={courseData}
                            />
                            <CreateQuestion
                                questions={data.questions}
                                addQuestion={addQuestion}
                                deleteQuestion={deleteQuestion}
                                updateQuestion={updateQuestion}
                                updatePoints={updatePoints}
                                deleteOption={deleteOption}
                                reorderQuestions={reorderQuestions}
                            />
                        </Stack>
                        <Stack
                            flex={1}
                            gap="24px"
                            sx={{
                                width: "100%",
                            }}
                        >
                            <AssessSettings
                                data={data}
                                onSetData={setData}
                                onSubmit={handleSubmit}
                            />
                            <AssessSummary data={data} />
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

CreateAssess.layout = (page) => (
    <MentorLayout
        children={page}
        auth={page.props.auth}
        activeTab="Assessment"
    />
);

export default CreateAssess;
