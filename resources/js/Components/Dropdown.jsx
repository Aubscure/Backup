import { Link } from '@inertiajs/react';
import { createContext, useContext, useRef, useState } from 'react';
import { Menu, MenuItem, Box, Fade } from '@mui/material';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <DropDownContext.Provider value={{ anchorEl, open, handleOpen, handleClose }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                {children}
            </Box>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { handleOpen } = useContext(DropDownContext);

    return (
        <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
            {children}
        </Box>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = '',
    children,
}) => {
    const { anchorEl, open, handleClose } = useContext(DropDownContext);

    const widthMap = {
        '48': 192,
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: align === 'left' ? 'left' : 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: align === 'left' ? 'left' : 'right',
            }}
            slotProps={{
                paper: {
                    sx: {
                        minWidth: widthMap[width] || 192,
                        mt: 1,
                    },
                },
            }}
        >
            {children}
        </Menu>
    );
};

const DropdownLink = ({ className = '', children, ...props }) => {
    const { handleClose } = useContext(DropDownContext);

    return (
        <MenuItem
            component={Link}
            onClick={handleClose}
            sx={{
                fontSize: '0.875rem',
                py: 1,
                px: 2,
            }}
            {...props}
        >
            {children}
        </MenuItem>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
