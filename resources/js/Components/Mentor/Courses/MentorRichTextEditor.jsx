import { useEffect, useRef, useState } from 'react';
import {
    Box, Paper, IconButton, Tooltip, Divider, Select, MenuItem,
    FormControl, InputBase, Stack, Popover, TextField, Button,
    keyframes,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Icons
import FormatBoldIcon           from '@mui/icons-material/FormatBold';
import FormatItalicIcon         from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon     from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon  from '@mui/icons-material/FormatStrikethrough';
import FormatListBulletedIcon   from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon   from '@mui/icons-material/FormatListNumbered';
import FormatAlignLeftIcon      from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon    from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon     from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon   from '@mui/icons-material/FormatAlignJustify';
import LinkIcon                 from '@mui/icons-material/Link';
import LinkOffIcon              from '@mui/icons-material/LinkOff';
import UndoIcon                 from '@mui/icons-material/Undo';
import RedoIcon                 from '@mui/icons-material/Redo';
import SubscriptIcon            from '@mui/icons-material/Subscript';
import SuperscriptIcon          from '@mui/icons-material/Superscript';

import InputError from '@/Components/InputError';

// ─── Constants ────────────────────────────────────────────────────────────────
const EASE        = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const GREEN       = '#187604';
const GREEN_LIGHT = alpha('#187604', 0.10);

// ─── Keyframes ────────────────────────────────────────────────────────────────
const toolbarReveal = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const editorReveal = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const rippleBurst = keyframes`
  from { transform: scale(0);   opacity: 0.5; }
  to   { transform: scale(3.6); opacity: 0; }
`;

const popoverIn = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
`;

const focusPulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0   ${alpha(GREEN, 0.15)}; }
  50%      { box-shadow: 0 0 0 5px ${alpha(GREEN, 0)}; }
`;

const undoSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;

const redoSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const linkBounce = keyframes`
  0%         { transform: translateY(0); }
  30%        { transform: translateY(-4px); }
  60%        { transform: translateY(2px); }
  100%       { transform: translateY(0); }
`;

const dividerGlow = keyframes`
  0%,100% { opacity: 0.3; background-color: #bdbdbd; }
  50%      { opacity: 0.8; background-color: ${GREEN}; }
`;

const sizeInputPop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(0.88); }
  70%  { transform: scale(1.10); }
  100% { transform: scale(1); }
`;

// ─── Animated IconButton ──────────────────────────────────────────────────────
function ToolBtn({ title, icon: Icon, onClick, onMouseDown, spinVariant }) {
    const [hovered,  setHovered]  = useState(false);
    const [pressed,  setPressed]  = useState(false);
    const [rippling, setRippling] = useState(false);

    const handleClick = (e) => {
        setPressed(true);
        setRippling(true);
        setTimeout(() => { setPressed(false); setRippling(false); }, 400);
        onClick && onClick(e);
    };

    // Pick spin style for undo / redo buttons
    const spinAnim =
        spinVariant === 'undo' ? `${undoSpin} 0.38s ${EASE_SPRING} both` :
        spinVariant === 'redo' ? `${redoSpin} 0.38s ${EASE_SPRING} both` :
        spinVariant === 'link' ? `${linkBounce} 0.4s ${EASE_SPRING} both` :
        undefined;

    return (
        <Tooltip title={title} placement="top" arrow>
            <Box
                sx={{ position: 'relative', display: 'inline-flex', borderRadius: 1.5 }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {rippling && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 1.5,
                        bgcolor: alpha(GREEN, 0.35),
                        animation: `${rippleBurst} 0.4s ease-out forwards`,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }} />
                )}
                <IconButton
                    size="small"
                    onMouseDown={onMouseDown}
                    onClick={handleClick}
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        borderRadius: 1.5,
                        transition: `background 200ms ${EASE}, transform 220ms ${EASE_SPRING}, box-shadow 220ms ${EASE}`,
                        bgcolor: hovered ? GREEN_LIGHT : 'transparent',
                        transform: pressed ? 'scale(0.88)' : hovered ? 'scale(1.10)' : 'scale(1)',
                        boxShadow: hovered ? `0 3px 10px ${alpha(GREEN, 0.18)}` : 'none',
                        '& svg': {
                            transition: `color 180ms ${EASE}`,
                            color: hovered ? GREEN : 'action.active',
                            animation: pressed && spinAnim ? spinAnim : 'none',
                        },
                    }}
                >
                    <Icon fontSize="small" />
                </IconButton>
            </Box>
        </Tooltip>
    );
}

// ─── Animated Divider ─────────────────────────────────────────────────────────
function ToolDivider({ editorFocused }) {
    return (
        <Divider
            orientation="vertical"
            flexItem
            sx={{
                mx: 0.5,
                height: 24,
                alignSelf: 'center',
                animation: editorFocused ? `${dividerGlow} 3s ease-in-out infinite` : 'none',
                transition: `background-color 400ms ${EASE}, opacity 300ms ${EASE}`,
            }}
        />
    );
}

// ─── Animated Select Wrapper ──────────────────────────────────────────────────
function ToolSelect({ value, onChange, children, minWidth, sx: extraSx = {} }) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);

    return (
        <FormControl
            variant="standard"
            size="small"
            sx={{ minWidth, ...extraSx }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Select
                value={value}
                onChange={onChange}
                disableUnderline
                displayEmpty
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                sx={{
                    fontSize: '0.875rem',
                    borderRadius: 1.5,
                    transition: `background 200ms ${EASE}, box-shadow 200ms ${EASE}`,
                    bgcolor: hovered ? GREEN_LIGHT : 'transparent',
                    boxShadow: hovered ? `0 2px 8px ${alpha(GREEN, 0.12)}` : 'none',
                    '& .MuiSelect-select': {
                        py: 0.5,
                        px: 1,
                        color: hovered ? GREEN : 'text.primary',
                        transition: `color 180ms ${EASE}`,
                    },
                    '& .MuiSelect-icon': {
                        transition: `transform 280ms ${EASE_SPRING}, color 180ms ${EASE}`,
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: hovered ? GREEN : 'action.active',
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: 2,
                            mt: 0.5,
                            boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
                            animation: `${popoverIn} 0.22s ${EASE_SPRING} both`,
                            '& .MuiMenuItem-root': {
                                fontSize: '0.875rem',
                                borderRadius: 1,
                                mx: 0.5,
                                transition: `background 160ms ${EASE}, padding-left 160ms ${EASE}`,
                                '&:hover': {
                                    bgcolor: GREEN_LIGHT,
                                    color: GREEN,
                                    pl: 2.5,
                                },
                                '&.Mui-selected': {
                                    bgcolor: alpha(GREEN, 0.12),
                                    color: GREEN,
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: alpha(GREEN, 0.18) },
                                },
                            },
                        },
                    },
                }}
            >
                {children}
            </Select>
        </FormControl>
    );
}

// ─── Font Size Input ──────────────────────────────────────────────────────────
function FontSizeInput({ value, onChange }) {
    const [focused, setFocused] = useState(false);
    const [popped,  setPopped]  = useState(false);

    const handleChange = (e) => {
        setPopped(true);
        setTimeout(() => setPopped(false), 350);
        onChange(e);
    };

    return (
        <Tooltip title="Font Size (1-7)" placement="top" arrow>
            <InputBase
                value={value}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                type="number"
                inputProps={{ min: 1, max: 7, style: { textAlign: 'center', padding: 2 } }}
                sx={{
                    width: 40,
                    border: '1.5px solid',
                    borderColor: focused ? GREEN : 'grey.300',
                    borderRadius: 1.5,
                    fontSize: '0.875rem',
                    ml: 0.5,
                    fontWeight: focused ? 700 : 400,
                    color: focused ? GREEN : 'text.primary',
                    transition: `border-color 200ms ${EASE}, box-shadow 200ms ${EASE}, color 180ms ${EASE}`,
                    boxShadow: focused ? `0 0 0 3px ${alpha(GREEN, 0.12)}` : 'none',
                    animation: popped ? `${sizeInputPop} 0.32s ${EASE_SPRING}` : 'none',
                }}
            />
        </Tooltip>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Enter description...',
    minHeight = 120,
    error,
    sx = {},
}) {
    const editorRef       = useRef(null);
    const savedSelection  = useRef(null);

    const [fontName,  setFontName]  = useState('Arial');
    const [fontSize,  setFontSize]  = useState('3');
    const [blockType, setBlockType] = useState('p');
    const [anchorEl,  setAnchorEl]  = useState(null);
    const [linkUrl,   setLinkUrl]   = useState('');

    // Track focus state for reactive toolbar styling
    const [editorFocused,   setEditorFocused]   = useState(false);
    const [toolbarHovered,  setToolbarHovered]  = useState(false);
    const [charCount,       setCharCount]       = useState(0);

    // Sync external value
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML);
            setCharCount(editorRef.current.innerText.length);
        }
        saveSelection();
    };

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (editorRef.current?.contains(range.commonAncestorContainer)) {
                savedSelection.current = range;
            }
        }
    };

    const restoreSelection = () => {
        if (savedSelection.current) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedSelection.current);
        }
    };

    const applyFormat = (command, val = null) => {
        if (document.activeElement !== editorRef.current) restoreSelection();
        document.execCommand(command, false, val);
        editorRef.current?.focus();
        handleInput();
    };

    const preventFocusLoss = (e) => e.preventDefault();

    const handleBlockChange = (e) => { setBlockType(e.target.value); applyFormat('formatBlock', e.target.value); };
    const handleFontChange  = (e) => { setFontName(e.target.value);  applyFormat('fontName', e.target.value); };
    const handleFontSizeChange = (e) => {
        const size = e.target.value;
        setFontSize(size);
        if (size && size >= 1 && size <= 7) applyFormat('fontSize', size);
    };

    const handleLinkClick  = (e) => { preventFocusLoss(e); setAnchorEl(e.currentTarget); };
    const handleLinkClose  = ()  => { setAnchorEl(null); setLinkUrl(''); };
    const applyLink        = ()  => { if (linkUrl) applyFormat('createLink', linkUrl); handleLinkClose(); };
    const removeLink       = ()  => applyFormat('unlink');

    const isActive = editorFocused || toolbarHovered;

    return (
        <Box sx={{ ...sx }}>

            {/* ── Toolbar ── */}
            <Paper
                variant="outlined"
                onMouseEnter={() => setToolbarHovered(true)}
                onMouseLeave={() => setToolbarHovered(false)}
                sx={{
                    p: 1,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    bgcolor: isActive ? '#fafffe' : 'grey.50',
                    borderColor: error ? 'error.main' : isActive ? GREEN : 'grey.300',
                    borderBottom: '1px solid',
                    borderBottomColor: error ? 'error.main' : isActive ? alpha(GREEN, 0.3) : 'grey.300',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                    animation: `${toolbarReveal} 0.4s ${EASE} both`,
                    transition: `background 280ms ${EASE}, border-color 280ms ${EASE}, box-shadow 280ms ${EASE}`,
                    boxShadow: isActive
                        ? `0 2px 12px ${alpha(GREEN, 0.08)}, inset 0 -1px 0 ${alpha(GREEN, 0.15)}`
                        : '0 1px 4px rgba(0,0,0,0.04)',
                    // Left accent bar that appears on focus
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0, top: '15%', bottom: '15%',
                        width: 3,
                        borderRadius: '0 3px 3px 0',
                        bgcolor: GREEN,
                        transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin: 'center',
                        transition: `transform 300ms ${EASE_SPRING}`,
                    },
                }}
            >
                {/* History */}
                <Stack direction="row" spacing={0.5}>
                    <ToolBtn title="Undo (Ctrl+Z)" icon={UndoIcon} onClick={() => applyFormat('undo')} onMouseDown={preventFocusLoss} spinVariant="undo" />
                    <ToolBtn title="Redo (Ctrl+Y)" icon={RedoIcon} onClick={() => applyFormat('redo')} onMouseDown={preventFocusLoss} spinVariant="redo" />
                </Stack>

                <ToolDivider editorFocused={isActive} />

                {/* Headings */}
                <ToolSelect value={blockType} onChange={handleBlockChange} minWidth={100}>
                    <MenuItem value="p">Paragraph</MenuItem>
                    <MenuItem value="h1"><Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Heading 1</Box></MenuItem>
                    <MenuItem value="h2"><Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Heading 2</Box></MenuItem>
                    <MenuItem value="h3"><Box component="span" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Heading 3</Box></MenuItem>
                    <MenuItem value="blockquote"><Box component="span" sx={{ fontStyle: 'italic', color: 'grey.600' }}>Quote</Box></MenuItem>
                    <MenuItem value="pre"><Box component="span" sx={{ fontFamily: 'monospace' }}>Code</Box></MenuItem>
                </ToolSelect>

                <ToolDivider editorFocused={isActive} />

                {/* Font Family */}
                <ToolSelect value={fontName} onChange={handleFontChange} minWidth={90}>
                    <MenuItem value="Arial"           sx={{ fontFamily: 'Arial' }}>Arial</MenuItem>
                    <MenuItem value="Georgia"         sx={{ fontFamily: 'Georgia' }}>Georgia</MenuItem>
                    <MenuItem value="Verdana"         sx={{ fontFamily: 'Verdana' }}>Verdana</MenuItem>
                    <MenuItem value="Times New Roman" sx={{ fontFamily: 'Times New Roman' }}>Times</MenuItem>
                    <MenuItem value="Courier New"     sx={{ fontFamily: 'Courier New' }}>Courier</MenuItem>
                </ToolSelect>

                {/* Font Size */}
                <FontSizeInput value={fontSize} onChange={handleFontSizeChange} />

                <ToolDivider editorFocused={isActive} />

                {/* Basic Formatting */}
                <Stack direction="row" spacing={0}>
                    <ToolBtn title="Bold (Ctrl+B)"  icon={FormatBoldIcon}          onClick={() => applyFormat('bold')}          onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Italic (Ctrl+I)" icon={FormatItalicIcon}       onClick={() => applyFormat('italic')}        onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Underline (Ctrl+U)" icon={FormatUnderlinedIcon} onClick={() => applyFormat('underline')}   onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Strikethrough"  icon={FormatStrikethroughIcon} onClick={() => applyFormat('strikeThrough')} onMouseDown={preventFocusLoss} />
                </Stack>

                <ToolDivider editorFocused={isActive} />

                {/* Indexes */}
                <Stack direction="row" spacing={0}>
                    <ToolBtn title="Subscript"   icon={SubscriptIcon}   onClick={() => applyFormat('subscript')}   onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Superscript" icon={SuperscriptIcon} onClick={() => applyFormat('superscript')} onMouseDown={preventFocusLoss} />
                </Stack>

                <ToolDivider editorFocused={isActive} />

                {/* Alignment */}
                <Stack direction="row" spacing={0}>
                    <ToolBtn title="Align Left"   icon={FormatAlignLeftIcon}    onClick={() => applyFormat('justifyLeft')}   onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Align Center" icon={FormatAlignCenterIcon}  onClick={() => applyFormat('justifyCenter')} onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Align Right"  icon={FormatAlignRightIcon}   onClick={() => applyFormat('justifyRight')}  onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Justify"      icon={FormatAlignJustifyIcon} onClick={() => applyFormat('justifyFull')}   onMouseDown={preventFocusLoss} />
                </Stack>

                <ToolDivider editorFocused={isActive} />

                {/* Lists */}
                <Stack direction="row" spacing={0}>
                    <ToolBtn title="Bullet List"   icon={FormatListBulletedIcon} onClick={() => applyFormat('insertUnorderedList')} onMouseDown={preventFocusLoss} />
                    <ToolBtn title="Numbered List" icon={FormatListNumberedIcon} onClick={() => applyFormat('insertOrderedList')}   onMouseDown={preventFocusLoss} />
                </Stack>

                <ToolDivider editorFocused={isActive} />

                {/* Links */}
                <Stack direction="row" spacing={0}>
                    <ToolBtn title="Insert Link" icon={LinkIcon}    onClick={handleLinkClick} onMouseDown={preventFocusLoss} spinVariant="link" />
                    <ToolBtn title="Remove Link" icon={LinkOffIcon} onClick={removeLink}      onMouseDown={preventFocusLoss} />
                </Stack>

                {/* Live char counter — far right */}
                {charCount > 0 && (
                    <Box
                        sx={{
                            ml: 'auto',
                            mr: 0.5,
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: alpha(GREEN, 0.07),
                            border: `1px solid ${alpha(GREEN, 0.15)}`,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: alpha(GREEN, 0.8),
                            fontVariantNumeric: 'tabular-nums',
                            transition: `opacity 200ms ${EASE}`,
                            userSelect: 'none',
                        }}
                    >
                        {charCount} chars
                    </Box>
                )}
            </Paper>

            {/* ── Editable Area ── */}
            <Box
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyUp={saveSelection}
                onMouseUp={saveSelection}
                onFocus={() => setEditorFocused(true)}
                onBlur={() => setEditorFocused(false)}
                data-placeholder={placeholder}
                sx={{
                    minHeight,
                    width: '100%',
                    maxWidth: '100%',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    border: '1.5px solid',
                    borderColor: error ? 'error.main' : editorFocused ? GREEN : 'grey.300',
                    borderTop: 0,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    px: 2,
                    py: 1.5,
                    fontSize: '0.875rem',
                    bgcolor: 'common.white',
                    fontFamily: fontName,
                    animation: `${editorReveal} 0.45s ${EASE} 0.05s both`,
                    transition: `border-color 240ms ${EASE}, box-shadow 260ms ${EASE}`,
                    boxShadow: editorFocused
                        ? `0 4px 20px ${alpha(GREEN, 0.1)}, 0 0 0 3px ${alpha(GREEN, 0.08)}`
                        : '0 2px 6px rgba(0,0,0,0.03)',
                    '&:focus': {
                        outline: 'none',
                        borderColor: GREEN,
                        borderTop: `1.5px solid ${GREEN}`,
                        marginTop: '-1.5px',
                    },
                    '&:empty:before': {
                        content: 'attr(data-placeholder)',
                        color: 'grey.400',
                        pointerEvents: 'none',
                        fontStyle: 'italic',
                    },
                    '& ul, & ol': { pl: 3 },
                    '& blockquote': {
                        borderLeft: `4px solid ${alpha(GREEN, 0.5)}`,
                        margin: '1em 0',
                        paddingLeft: '1em',
                        color: 'grey.700',
                        bgcolor: alpha(GREEN, 0.025),
                        borderRadius: '0 6px 6px 0',
                    },
                    '& pre': {
                        bgcolor: 'grey.100',
                        p: 1,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                    },
                    '& a': {
                        color: GREEN,
                        textDecorationColor: alpha(GREEN, 0.4),
                        transition: `color 180ms ${EASE}`,
                    },
                }}
            />

            <InputError message={error} sx={{ mt: 1 }} />

            {/* ── Link Popover ── */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleLinkClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{
                    sx: {
                        borderRadius: 2.5,
                        boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
                        border: `1px solid ${alpha(GREEN, 0.2)}`,
                        animation: `${popoverIn} 0.24s ${EASE_SPRING} both`,
                        overflow: 'visible',
                        // Arrow pointer
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -6, left: 16,
                            width: 12, height: 12,
                            bgcolor: 'background.paper',
                            border: `1px solid ${alpha(GREEN, 0.2)}`,
                            borderRight: 'none',
                            borderBottom: 'none',
                            transform: 'rotate(45deg)',
                        },
                    },
                }}
            >
                <Box
                    component="form"
                    onSubmit={(e) => { e.preventDefault(); applyLink(); }}
                    sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}
                >
                    <TextField
                        autoFocus
                        size="small"
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        sx={{
                            minWidth: 250,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                transition: `box-shadow 220ms ${EASE}`,
                                '&.Mui-focused fieldset': { borderColor: GREEN },
                                '&.Mui-focused': {
                                    boxShadow: `0 0 0 3px ${alpha(GREEN, 0.1)}`,
                                },
                            },
                            '& label.Mui-focused': { color: GREEN },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        sx={{
                            bgcolor: GREEN,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            transition: `transform 220ms ${EASE_SPRING}, box-shadow 220ms ${EASE}, background 180ms ${EASE}`,
                            '&:hover': {
                                bgcolor: '#166534',
                                transform: 'translateY(-2px) scale(1.04)',
                                boxShadow: `0 6px 18px ${alpha(GREEN, 0.32)}`,
                            },
                            '&:active': {
                                transform: 'scale(0.97)',
                            },
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
}
