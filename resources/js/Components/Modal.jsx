import { Dialog, DialogContent, Fade } from '@mui/material';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthMap = {
        sm: 'sm',
        md: 'sm',
        lg: 'md',
        xl: 'md',
        '2xl': 'sm',
    };

    return (
        <Dialog
            open={show}
            onClose={close}
            maxWidth={maxWidthMap[maxWidth] || 'sm'}
            fullWidth
            TransitionComponent={Fade}
        >
            {children}
        </Dialog>
    );
}
