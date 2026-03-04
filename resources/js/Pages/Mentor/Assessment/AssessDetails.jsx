import React, { useEffect, useState } from "react";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const sx = {
    focusedColorFieldText: {
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#166534",
                boxShadow: '0 6px 20px #1665341f, 0 0 0 2px #1665341f'
            },
        },
    },
};

function AssessDetails({ data, onSetData, courseData }) {
    const courseOptions = courseData.courses.map((course) => ({
        title: course.title,
        id: course.id,
    }));

    const assignOptions = (() => {
        const course = courseData.courses.find(
            (course) => course.id === data.course_id
        );
        if (!course) return [];

        if (data.assessmentable_type === "syllabus") {
            return course.syllabuses.map((s) => ({ label: s.title, id: s.id }));
        } else {
            return course.syllabuses.flatMap((s) =>
                s.lessons.map((l) => ({
                    label: l.title,
                    id: l.id,
                    groupTitle: s.title,
                }))
            );
        }
    })();

    const handlePlacementChange = (type) => {
        onSetData("assessmentable_type", type);
        onSetData("assessmentable_id", "");
    };

    return (
        <Box
            backgroundColor="#ffffff"
            border="thin solid"
            borderRadius="24px"
            padding="24px"
            borderColor="#E2E8F0"
            display="flex"
            flexDirection="column"
            gap="16px"
        >
            <Typography
                color="#166534"
                fontWeight="bold"
                display="flex"
                gap="8px"
                alignItems="center"
            >
                <InfoOutlineIcon />
                Assessment Details
            </Typography>
            {/* Assessment title */}
            <Stack spacing={0.5}>
                <Typography fontSize="14px">Assessment Title</Typography>
                <TextField
                    size="small"
                    sx={sx.focusedColorFieldText}
                    value={data.title}
                    fullWidth
                    onChange={(e) => onSetData("title", e.target.value)}
                />
            </Stack>
            {/* Description */}
            <Stack spacing={0.5}>
                <Typography fontSize="14px">Description</Typography>
                <TextField
                    size="small"
                    sx={sx.focusedColorFieldText}
                    value={data.description}
                    fullWidth
                    onChange={(e) => onSetData("description", e.target.value)}
                />
            </Stack>
            {/* Course association & assign to*/}
            <Stack
                direction={{ xs: "column", md: "row" }}
                gap="16px"
                alignItems="center"
            >
                <Stack width={{ xs: "100%", md: "481px" }} spacing={0.5}>
                    <Typography fontSize="14px">Course Association</Typography>
                    <Autocomplete
                        size="small"
                        sx={sx.focusedColorFieldText}
                        value={
                            courseOptions.find(
                                (c) => c.id === data.course_id
                            ) ?? null
                        }
                        options={courseOptions}
                        getOptionLabel={(option) => option.title}
                        onChange={(e, value) => {
                            onSetData("course_id", value?.id ?? null);
                            onSetData("assessmentable_id", null);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
                <Stack width={{ xs: "100%", md: "481px" }} spacing={0.5}>
                    <Stack
                        direction="row"
                        gap="12px"
                        alignItems="end"
                        justifyContent="space-between"
                    >
                        <Typography fontSize="14px">Assign To</Typography>

                        <ButtonGroup
                            aria-label="Placement type"
                            sx={{
                                "& .MuiButton-root": {
                                    fontSize: "10px",
                                    paddingY: "0px",
                                },
                            }}
                        >
                            <Button
                                variant={
                                    data.assessmentable_type === "syllabus"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() =>
                                    handlePlacementChange("syllabus")
                                }
                                sx={{
                                    borderColor: "green",
                                    color:
                                        data.assessmentable_type === "syllabus"
                                            ? "white"
                                            : "green",
                                    backgroundColor:
                                        data.assessmentable_type === "syllabus"
                                            ? "green"
                                            : "none",
                                    fontWeight:
                                        data.assessmentable_type ===
                                            "syllabus" && "bold",
                                }}
                            >
                                Syllabus
                            </Button>
                            <Button
                                variant={
                                    data.assessmentable_type === "lesson"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => handlePlacementChange("lesson")}
                                sx={{
                                    borderColor: "green",
                                    color:
                                        data.assessmentable_type === "lesson"
                                            ? "white"
                                            : "green",
                                    backgroundColor:
                                        data.assessmentable_type === "lesson"
                                            ? "green"
                                            : "none",
                                    fontWeight:
                                        data.assessmentable_type === "lesson" &&
                                        "bold",
                                }}
                            >
                                Lesson
                            </Button>
                        </ButtonGroup>
                    </Stack>
                    <Autocomplete
                        key={data.assessmentable_type}
                        size="small"
                        disabled={!data.course_id}
                        options={assignOptions}
                        onChange={(e, value) => {
                            onSetData("assessmentable_id", value?.id ?? "");
                        }}
                        groupBy={
                            data.assessmentable_type === "lesson"
                                ? (assignOptions) => assignOptions.groupTitle
                                : undefined
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={
                                    data.course_id
                                        ? null
                                        : "Choose associated course first"
                                }
                            />
                        )}
                        sx={{ width: "100%", ...sx.focusedColorFieldText }}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}

export default AssessDetails;
