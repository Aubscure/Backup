import { keyframes } from '@mui/system';

export const fadeInUp      = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
export const slideInRight  = keyframes`from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}`;
export const scaleIn       = keyframes`from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}`;
export const shimmerBg     = keyframes`0%{background-position:-600px 0}100%{background-position:600px 0}`;
export const spinSlow      = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
export const checkBounce   = keyframes`0%{transform:scale(0)}60%{transform:scale(1.25)}80%{transform:scale(0.9)}100%{transform:scale(1)}`;
export const ripple        = keyframes`0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.4);opacity:0}`;
export const accentBarSlide= keyframes`from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}`;
