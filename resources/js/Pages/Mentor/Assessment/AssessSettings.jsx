import React from "react";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FormControlLabel } from "@mui/material";

function AssessSettings({ data, onSetData, onSubmit }) {
    return (
        <Card
            sx={{
                borderRadius: "24px",
                transition: "transform 0.4s ease",
                "&:hover": { transform: "scale(1.02)" },
            }}
        >
            <Box backgroundColor="#2B7C30">
                <Stack
                    direction="row"
                    gap="12px"
                    padding="24px"
                    justifyContent="end"
                >
                    <Button
                        onClick={(e) => onSubmit(e, true)}
                        variant="contained"
                        startIcon={<SaveAsOutlinedIcon />}
                        size="medium"
                        sx={{
                            backgroundColor: "#E7F3EF",
                            color: "#000000",
                            fontWeight: "bold",
                            borderRadius: "16px",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#ecfdf5",
                                transform: "scale(1.02)",
                            },
                        }}
                    >
                        Draft
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={(e) => onSubmit(e, false)}
                        startIcon={<SaveOutlinedIcon />}
                        size="medium"
                        sx={{
                            backgroundColor: "#E7F3EF",
                            color: "#000000",
                            fontWeight: "bold",
                            borderRadius: "16px",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#ecfdf5",
                                transform: "scale(1.02)",
                            },
                        }}
                    >
                        Create Assessment
                    </Button>
                </Stack>
            </Box>
            <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
                {/* Passing grade selection */}
                <Box>
                    <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
                        Passing Grade (%)
                    </Typography>
                    <ToggleButtonGroup
                        value={data.passing_grade}
                        exclusive
                        fullWidth
                        size="small"
                        onChange={(e, newPassingGrade) => {
                            if (newPassingGrade !== null) {
                                onSetData("passing_grade", newPassingGrade);
                            }
                        }}
                        sx={{
                            "& .MuiToggleButton-root": {
                                color: "black",
                                borderColor: "#EAB308",
                                "&:hover": {
                                    backgroundColor: "#FFECBD",
                                },
                                "&.Mui-selected": {
                                    color: "white",
                                    backgroundColor: "#EAB308",
                                    fontWeight: "bold",
                                    borderColor: "#EAB308",
                                    "&:hover": {
                                        backgroundColor: "#EAB308",
                                    },
                                },
                            },
                        }}
                    >
                        <ToggleButton value={60} aria-label="60">
                            60%
                        </ToggleButton>
                        <ToggleButton value={70} aria-label="70">
                            70%
                        </ToggleButton>
                        <ToggleButton value={80} aria-label="80">
                            80%
                        </ToggleButton>
                        <ToggleButton value={90} aria-label="90">
                            90%
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                {/* Time limit */}
                <Stack>
                    <Stack
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="end"
                    >
                        <Typography
                            sx={{ fontSize: "14px", fontWeight: "bold" }}
                        >
                            Time Limit
                        </Typography>
                        <Switch
                            checked={data.has_time_limit}
                            onChange={(e) =>
                                onSetData("has_time_limit", e.target.checked)
                            }
                            sx={{
                                "& .MuiSwitch-switchBase": {
                                    "& .MuiSwitch-thumb": {
                                        color: "#f0f0f0",
                                    },
                                    "&.Mui-checked + .MuiSwitch-track": {
                                        backgroundColor: "#2B7C30",
                                        color: "#f0f0f0",
                                        opacity: 0.9,
                                    },
                                },
                            }}
                        />
                    </Stack>
                    <Stack direction="row" gap="8px">
                        <TextField
                            value={data.time_limit_hrs}
                            disabled={!data.has_time_limit}
                            slotProps={{
                                input: {
                                    min: 0,
                                    max: 23,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            hrs
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            size="small"
                            onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                if (value <= 23) {
                                    onSetData("time_limit_hrs", value);
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "24px",
                                    "& fieldset": {
                                        borderRadius: "24px",
                                    },
                                },
                            }}
                        />
                        <TextField
                            value={data.time_limit_mins}
                            disabled={!data.has_time_limit}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            mins
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            size="small"
                            onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                if (value <= 59) {
                                    onSetData("time_limit_mins", value);
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "24px",
                                    "& fieldset": {
                                        borderRadius: "24px",
                                    },
                                },
                            }}
                        />
                        <TextField
                            value={data.time_limit_secs}
                            disabled={!data.has_time_limit}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            secs
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            size="small"
                            onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                if (value <= 59) {
                                    onSetData("time_limit_secs", value);
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "24px",
                                    "& fieldset": {
                                        borderRadius: "24px",
                                    },
                                },
                            }}
                        />
                    </Stack>
                </Stack>
                {/* Behavior and results */}
                <Box>
                    <Typography
                        marginBottom="16px"
                        color="#94A3B8"
                        fontWeight="bold"
                        fontSize="14px"
                    >
                        Behavior
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={data.is_randomized}
                                onChange={(e) =>
                                    onSetData("is_randomized", e.target.checked)
                                }
                                sx={{
                                    "& .MuiSwitch-switchBase": {
                                        color: "#f0f0f0",
                                        "&.Mui-checked + .MuiSwitch-track": {
                                            color: "#f0f0f0",
                                            backgroundColor: "#2B7C30",
                                            opacity: 0.9,
                                        },
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography
                                lineHeight="18px"
                                fontSize="14px"
                                fontWeight="bold"
                            >
                                Randomize Questions
                                <br />
                                <Typography component="span" fontSize="12px">
                                    Order of questions changes randomly
                                </Typography>
                            </Typography>
                        }
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

export default AssessSettings;
