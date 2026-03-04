import React, { useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Stack from "@mui/material/Stack";

const options = ["multiple choice", "true or false", "sequence"];

function QuestionType({ onAddQuestion }) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedType, setSelectedType] = useState(options[0]);

    const handleClick = () => {
        onAddQuestion(selectedType);
    };

    const handleMenuItemClick = (event, type) => {
        setSelectedType(type);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    return (
        <Stack alignItems="center" justifyContent="center">
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
                sx={{
                    marginTop: "24px",
                    shadow: "none",
                    transition: "transform 0.4s ease",
                    "& .MuiButtonGroup-grouped": { borderColor: "#2B7C30" },
                    "& .MuiSvgIcon-root": {
                        transition: "transform 0.4s ease",
                    },
                    "&:hover": {
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)",
                    },
                }}
            >
                <Button
                    onClick={handleClick}
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: "white",
                        color: "#2B7C30",
                        minWidth: 180,
                        fontWeight: "bold",
                        fontSize: "14px",
                    }}
                >
                    {selectedType}
                </Button>
                <Button
                    size="small"
                    aria-controls={open ? "split-button-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-label="selected question type"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                    sx={{
                        backgroundColor: "white",
                        color: "#2B7C30",
                    }}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === "bottom"
                                    ? "center top"
                                    : "center bottom",
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option) => (
                                        <MenuItem
                                            key={option}
                                            disabled={
                                                option === "drag and drop"
                                            }
                                            selected={option === selectedType}
                                            onClick={(event) =>
                                                handleMenuItemClick(
                                                    event,
                                                    option
                                                )
                                            }
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Stack>
    );
}

export default QuestionType;
