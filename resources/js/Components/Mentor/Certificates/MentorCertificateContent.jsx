// Components/Mentor/Certificates/MentorCertificateContent.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleIcon      from '@mui/icons-material/CheckCircle';
import VerifiedIcon         from '@mui/icons-material/Verified';

// ─── Constants ────────────────────────────────────────────────────────────────
export const CERT_W = 650;
export const CERT_H = 470;

export const PALETTES = [
{ id: 'sunset', primary: '#7a1f3d', secondary: '#ff9f1c', bg: '#fff4ec', border: '#5a162d', label: 'Sunset Bloom' },

{ id: 'sapphire', primary: '#0f3057', secondary: '#f4d35e', bg: '#eef4fb', border: '#0a223d', label: 'Sapphire Gold' },

{ id: 'jade', primary: '#0b6e4f', secondary: '#f2c14e', bg: '#edf9f4', border: '#084c38', label: 'Jade Amber' },

{ id: 'lavender', primary: '#5a189a', secondary: '#ffb3c6', bg: '#f8f1ff', border: '#3c096c', label: 'Lavender Blush' },

{ id: 'copper', primary: '#7c2d12', secondary: '#4cc9f0', bg: '#fdf2ec', border: '#5b1f0e', label: 'Copper Sky' },

{ id: 'arctic', primary: '#1d3557', secondary: '#a8dadc', bg: '#f1f6fb', border: '#14213d', label: 'Arctic Blue' },

{ id: 'olive', primary: '#3a5a40', secondary: '#dda15e', bg: '#f6f9f4', border: '#2b4630', label: 'Olive Sand' },

{ id: 'plum', primary: '#580f41', secondary: '#f77fbe', bg: '#fff0fa', border: '#3f0a2e', label: 'Plum Candy' },

{ id: 'lagoon', primary: '#006d77', secondary: '#ffddd2', bg: '#edfafa', border: '#004f56', label: 'Lagoon Coral' },

{ id: 'scarlet', primary: '#8b0000', secondary: '#00b4d8', bg: '#fff3f3', border: '#600000', label: 'Scarlet Cyan' },

{ id: 'indigo', primary: '#2b2d6e', secondary: '#ffcb77', bg: '#f2f3ff', border: '#1c1e4a', label: 'Indigo Honey' },

{ id: 'mint', primary: '#2f9e44', secondary: '#c77dff', bg: '#f2fff6', border: '#1f6f30', label: 'Mint Orchid' },

{ id: 'espresso', primary: '#3c2f2f', secondary: '#f4a261', bg: '#f8f5f2', border: '#2a1f1f', label: 'Espresso Cream' },

{ id: 'ruby', primary: '#9d0208', secondary: '#00f5d4', bg: '#fff5f5', border: '#6a0105', label: 'Ruby Aqua' },

{ id: 'skyline', primary: '#264653', secondary: '#e9c46a', bg: '#f1f7f9', border: '#1b323b', label: 'Skyline Gold' },

{ id: 'violet', primary: '#432371', secondary: '#f72585', bg: '#f6f2ff', border: '#2e184f', label: 'Violet Punch' },

{ id: 'pine', primary: '#1b4332', secondary: '#ffd166', bg: '#edf6f1', border: '#102c21', label: 'Pine Harvest' },

{ id: 'coral', primary: '#b23a48', secondary: '#3a86ff', bg: '#fff2f4', border: '#7f2732', label: 'Coral Wave' },

{ id: 'storm', primary: '#2b2d42', secondary: '#ef233c', bg: '#f4f6fb', border: '#1c1e2d', label: 'Storm Red' },

{ id: 'honey', primary: '#805b10', secondary: '#3a86ff', bg: '#fff9ec', border: '#5c410b', label: 'Honey Blue' },
];

export const TEMPLATES = ['Classic', 'Modern', 'Minimal', 'Elegant'];

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeInUp  = keyframes`from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}`;
const fadeInDown= keyframes`from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn    = keyframes`from{opacity:0}to{opacity:1}`;
const scaleIn   = keyframes`from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}`;
const sealPulse = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(200,168,75,0.45)}50%{box-shadow:0 0 0 8px rgba(200,168,75,0)}`;
const lineGrow  = keyframes`from{transform:scaleX(0)}to{transform:scaleX(1)}`;
const iconSpin  = keyframes`from{transform:rotate(-30deg) scale(0.5);opacity:0}to{transform:rotate(0deg) scale(1);opacity:1}`;
const slideInLeft = keyframes`from{opacity:0;transform:translateX(0px)}to{opacity:1;transform:translateX(0)}`;
const slideInRight= keyframes`from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}`;
const glowPulse = keyframes`0%,100%{text-shadow:0 0 8px rgba(200,168,75,0.3)}50%{text-shadow:0 0 20px rgba(200,168,75,0.7),0 0 40px rgba(200,168,75,0.3)}`;
const borderGlow= keyframes`0%,100%{box-shadow:inset 0 0 15px rgba(200,168,75,0.1)}50%{box-shadow:inset 0 0 35px rgba(200,168,75,0.25)}`;
const cornerAppear = keyframes`from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}`;
const accentBarSlide = keyframes`from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}`;
const nameWrite = keyframes`from{opacity:0;transform:skewX(-8deg) translateX(-20px);letter-spacing:-2px}to{opacity:1;transform:skewX(0deg) translateX(0);letter-spacing:normal}`;

// ─── AnimDivider helper ───────────────────────────────────────────────────────
function AnimDivider({ color, delay = 0 }) {
    return (
        <Box sx={{ display:'flex', alignItems:'center' }}>
            <Box sx={{ flex:1, height:1, bgcolor:color, animation:`${lineGrow} 0.8s ease ${delay}s both`, transformOrigin:'left' }}/>
            <Box sx={{ width:7, height:7, borderRadius:'50%', bgcolor:color, mx:1.5, flexShrink:0, animation:`${scaleIn} 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay+0.2}s both` }}/>
            <Box sx={{ flex:1, height:1, bgcolor:color, animation:`${lineGrow} 0.8s ease ${delay+0.1}s both`, transformOrigin:'right' }}/>
        </Box>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CertificateContent({
    template       = 'minimal',
    palette        = 'sunset',
    studentName    = 'Jane Doe',
    courseName     = 'Advanced Project Management Strategies',
    instructorName = 'Alex Morgan',
    dateLabel      = 'April 19, 2024',
    certId         = 'CRT-2024-8882-XJ',
}) {
    const pal = PALETTES.find(p => p.id === palette) || PALETTES[0];
    const tpl = (template || 'minimal').toLowerCase();

    // ── CLASSIC ──────────────────────────────────────────────────────────────
    if (tpl === 'classic') return (
            <Box sx={{
                boxSizing: 'border-box', // Add this line
                width:CERT_W, minHeight:CERT_H,
                background:`linear-gradient(145deg,#fdf6e3 0%,#f9eecc 40%,#fdf6e3 100%)`,
                border:`4px solid ${pal.primary}`, outline:`2px solid ${pal.secondary}`, outlineOffset:'-12px',
                boxShadow:`inset 0 0 60px rgba(0,0,0,0.06),0 8px 40px rgba(0,0,0,0.18)`,
                p:'32px 48px', fontFamily:'"Georgia","Times New Roman",serif',
                position:'relative', animation:`${fadeIn} 0.5s ease both`,
            }}>
            <Box sx={{position:'absolute',inset:0,pointerEvents:'none',opacity:0.04,
                background:'repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(0,0,0,0.3) 28px,rgba(0,0,0,0.3) 29px)'}}/>
            <Box sx={{position:'absolute',inset:14,border:`1.5px solid ${pal.secondary}`,pointerEvents:'none',opacity:0.6}}/>
            {['topleft','topright','bottomleft','bottomright'].map((pos,i)=>(
                <Box key={pos} sx={{
                    position:'absolute',width:32,height:32,
                    ...(pos.includes('top')?{top:6}:{bottom:6}),
                    ...(pos.includes('left')?{left:6}:{right:6}),
                    borderTop:   pos.includes('top')   ?`3px solid ${pal.secondary}`:'none',
                    borderBottom:pos.includes('bottom')?`3px solid ${pal.secondary}`:'none',
                    borderLeft:  pos.includes('left')  ?`3px solid ${pal.secondary}`:'none',
                    borderRight: pos.includes('right') ?`3px solid ${pal.secondary}`:'none',
                    animation:`${cornerAppear} 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.08+i*0.07}s both`,
                }}/>
            ))}
            <Box sx={{display:'flex',justifyContent:'center',gap:1,mb:1,animation:`${fadeIn} 0.4s ease 0.1s both`}}>
                {[...Array(7)].map((_,i)=>(
                    <Box key={i} sx={{width:i===3?8:5,height:i===3?8:5,borderRadius:'50%',bgcolor:pal.secondary,opacity:0.7,mt:i===3?0:0.4}}/>
                ))}
            </Box>
            <Box sx={{textAlign:'center',mb:1,animation:`${fadeInDown} 0.5s ease 0.15s both`}}>
                <Box sx={{display:'inline-flex',alignItems:'center',justifyContent:'center',
                    width:56,height:56,borderRadius:'50%',
                    background:`radial-gradient(circle,${pal.primary}dd,${pal.primary})`,
                    border:`3px solid ${pal.secondary}`,
                    boxShadow:`0 4px 16px ${pal.primary}55,inset 0 1px 0 rgba(255,255,255,0.2)`,
                    mb:0.75,animation:`${iconSpin} 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both`,
                }}>
                    <WorkspacePremiumIcon sx={{color:pal.secondary,fontSize:32}}/>
                </Box>
                <Typography sx={{fontSize:10,letterSpacing:6,color:pal.primary,textTransform:'uppercase',fontFamily:'sans-serif',fontWeight:700,display:'block'}}>
                    ✦ ManPro ✦
                </Typography>
            </Box>
            <Box sx={{position:'relative',my:1.5,animation:`${fadeInUp} 0.5s ease 0.3s both`}}>
                <Box sx={{position:'absolute',left:-48,top:'50%',transform:'translateY(-50%)',width:56,height:32,
                    background:`linear-gradient(90deg,transparent,${pal.primary})`,
                    clipPath:'polygon(0 50%,12px 0,100% 0,100% 100%,12px 100%)'}}/>
                <Box sx={{position:'absolute',right:-48,top:'50%',transform:'translateY(-50%)',width:56,height:32,
                    background:`linear-gradient(270deg,transparent,${pal.primary})`,
                    clipPath:'polygon(100% 50%,calc(100% - 12px) 0,0 0,0 100%,calc(100% - 12px) 100%)'}}/>
                <Box sx={{bgcolor:pal.primary,py:0.9,px:4,textAlign:'center',mx:1,
                    clipPath:'polygon(8px 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,8px 100%,0 50%)'}}>
                    <Typography sx={{fontSize:16,fontWeight:800,color:pal.secondary,letterSpacing:5,textTransform:'uppercase',fontFamily:'sans-serif'}}>
                        Certificate of Completion
                    </Typography>
                </Box>
            </Box>
            <AnimDivider color={pal.secondary} delay={0.4}/>
            <Typography sx={{textAlign:'center',fontSize:9,letterSpacing:4,color:'#888',textTransform:'uppercase',mt:1.5,mb:0.75,fontFamily:'sans-serif',animation:`${fadeIn} 0.4s ease 0.5s both`}}>
                This is to certify that
            </Typography>
            <Box sx={{textAlign:'center',mb:0.5,animation:`${nameWrite} 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.55s both`}}>
                <Typography sx={{fontSize:38,fontStyle:'italic',color:pal.primary,lineHeight:1.1}}>{studentName}</Typography>
                <Box sx={{display:'flex',justifyContent:'center',mt:0.25}}>
                    <Box sx={{height:2,width:'55%',background:`linear-gradient(90deg,transparent,${pal.secondary},transparent)`,borderRadius:2}}/>
                </Box>
            </Box>
            <Typography sx={{textAlign:'center',fontSize:10,color:'#666',mb:1,fontFamily:'sans-serif',animation:`${fadeIn} 0.4s ease 0.68s both`}}>
                has successfully completed the prescribed course of study in
            </Typography>
            <Box sx={{textAlign:'center',mb:1,animation:`${fadeInUp} 0.5s ease 0.76s both`}}>
                <Box sx={{display:'inline-block',border:`2px solid ${pal.secondary}`,px:3,py:0.6,position:'relative',
                    '&::before':{content:'""',position:'absolute',inset:-6,border:`1px solid ${pal.secondary}44`}}}>
                    <Typography sx={{fontSize:15,fontWeight:700,color:pal.primary,letterSpacing:2,textTransform:'uppercase'}}>{courseName}</Typography>
                </Box>
            </Box>
            <Typography sx={{textAlign:'center',fontSize:10,color:'#777',fontStyle:'italic',mb:1.5,fontFamily:'sans-serif',animation:`${fadeIn} 0.4s ease 0.84s both`}}>
                Demonstrating excellence in leadership and strategic planning.
            </Typography>
            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',animation:`${fadeInUp} 0.5s ease 1s both`}}>
                <Box sx={{textAlign:'center',minWidth:120}}>
                    <Typography sx={{fontSize:12,fontWeight:700,color:pal.primary,fontStyle:'italic'}}>{dateLabel}</Typography>
                    <Box sx={{width:100,height:'1px',borderBottom:`1.5px solid ${pal.primary}44`,mt:0.5,mx:'auto'}}/>
                    <Typography sx={{fontSize:8,letterSpacing:2.5,color:'#999',textTransform:'uppercase',mt:0.25}}>Date Issued</Typography>
                </Box>
                <Box sx={{textAlign:'center'}}>
                    <Box sx={{width:60,height:60,borderRadius:'50%',mx:'auto',
                        background:`radial-gradient(circle at 35% 35%,${pal.secondary}ee,${pal.secondary}88)`,
                        border:`3px solid ${pal.secondary}`,
                        boxShadow:`0 4px 16px ${pal.secondary}66,inset 0 1px 0 rgba(255,255,255,0.4)`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        animation:`${scaleIn} 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.05s both`,
                    }}>
                        <Box sx={{textAlign:'center'}}>
                            <CheckCircleIcon sx={{color:pal.primary,fontSize:28,display:'block',mx:'auto'}}/>
                            <Typography sx={{fontSize:6,letterSpacing:0.5,color:pal.primary,fontWeight:700,lineHeight:1,mt:0.25}}>VERIFIED</Typography>
                        </Box>
                    </Box>
                    <Typography sx={{fontSize:7.5,color:'#aaa',letterSpacing:0.5,mt:0.5}}>ID: {certId}</Typography>
                </Box>
                <Box sx={{textAlign:'center',minWidth:130}}>
                    <Typography sx={{fontSize:16,fontStyle:'italic',color:pal.primary,fontWeight:600}}>{instructorName}</Typography>
                    <Box sx={{width:110,height:'1px',borderBottom:`1.5px solid ${pal.primary}44`,mt:0.5,mx:'auto'}}/>
                    <Typography sx={{fontSize:8,letterSpacing:2.5,color:'#999',textTransform:'uppercase',mt:0.25}}>Course Mentor</Typography>
                </Box>
            </Box>
            <Box sx={{display:'flex',justifyContent:'center',gap:1,mt:1.25,animation:`${fadeIn} 0.4s ease 1.1s both`}}>
                {[...Array(7)].map((_,i)=>(
                    <Box key={i} sx={{width:i===3?8:5,height:i===3?8:5,borderRadius:'50%',bgcolor:pal.secondary,opacity:0.7,mt:i===3?0:0.4}}/>
                ))}
            </Box>
        </Box>
    );

    // ── MODERN ───────────────────────────────────────────────────────────────
    if (tpl === 'modern') return (
        <Box sx={{width:CERT_W,minHeight:CERT_H,bgcolor:'#fff',fontFamily:'"Helvetica Neue","Arial",sans-serif',position:'relative',overflow:'hidden',animation:`${fadeIn} 0.4s ease both`}}>
            <Box sx={{position:'absolute',top:0,right:0,bottom:0,width:'42%',
                background:`linear-gradient(160deg,${pal.primary} 0%,${pal.primary}ee 60%,${pal.primary}bb 100%)`,
                clipPath:'polygon(18% 0,100% 0,100% 100%,0% 100%)',
                animation:`${slideInRight} 0.55s cubic-bezier(0.65,0,0.35,1) 0.05s both`}}/>
            <Box sx={{position:'absolute',top:0,right:0,width:'42%',height:80,
                background:`linear-gradient(90deg,transparent,${pal.secondary}44)`,
                clipPath:'polygon(18% 0,100% 0,100% 100%)',animation:`${fadeIn} 0.6s ease 0.4s both`}}/>
            <Box sx={{position:'absolute',right:28,top:32,width:40,height:40,border:`2px solid ${pal.secondary}66`,borderRadius:'50%',animation:`${fadeIn} 0.5s ease 0.5s both`}}/>
            <Box sx={{position:'absolute',right:52,top:56,width:16,height:16,border:`2px solid ${pal.secondary}44`,borderRadius:'50%',animation:`${fadeIn} 0.5s ease 0.6s both`}}/>
            <Box sx={{position:'relative',zIndex:1,pl:5,pr:'44%',pt:4,pb:3}}>
                <Box sx={{height:5,bgcolor:pal.secondary,mb:3,width:60,animation:`${accentBarSlide} 0.6s cubic-bezier(0.65,0,0.35,1) 0.2s both`}}/>
                <Box sx={{display:'flex',alignItems:'center',gap:1.5,mb:3,animation:`${slideInLeft} 0.5s ease 0.25s both`}}>
                    <Box sx={{width:40,height:40,borderRadius:'4px',bgcolor:pal.primary,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <WorkspacePremiumIcon sx={{color:'white',fontSize:22}}/>
                    </Box>
                    <Box>
                        <Typography sx={{fontSize:10,letterSpacing:3,color:pal.primary,textTransform:'uppercase',fontWeight:800}}>ManPro</Typography>
                        <Typography sx={{fontSize:8,letterSpacing:2,color:'#bbb',textTransform:'uppercase'}}>Expert Hub</Typography>
                    </Box>
                </Box>
                <Typography sx={{fontSize:9,letterSpacing:4,color:pal.secondary,textTransform:'uppercase',fontWeight:700,mb:0.5,animation:`${fadeIn} 0.4s ease 0.32s both`}}>Certificate</Typography>
                <Typography sx={{fontSize:34,fontWeight:900,color:pal.primary,lineHeight:1,mb:0.5,animation:`${fadeInUp} 0.5s ease 0.36s both`,letterSpacing:-1}}>of Completion</Typography>
                <Box sx={{height:1,bgcolor:'#e0e0e0',mb:2.5,animation:`${accentBarSlide} 0.5s ease 0.42s both`}}/>
                <Typography sx={{fontSize:8.5,letterSpacing:3,color:'#bbb',textTransform:'uppercase',mb:0.5,animation:`${fadeIn} 0.4s ease 0.48s both`}}>Awarded to</Typography>
                <Typography sx={{fontSize:32,fontStyle:'italic',color:pal.primary,lineHeight:1.1,mb:0.4,fontFamily:'"Georgia",serif',animation:`${nameWrite} 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.54s both`}}>{studentName}</Typography>
                <Typography sx={{fontSize:9.5,color:'#999',mb:1,animation:`${fadeIn} 0.4s ease 0.66s both`}}>For successfully completing</Typography>
                <Box sx={{display:'inline-flex',alignItems:'center',gap:1,mb:1.5,animation:`${fadeInUp} 0.5s ease 0.72s both`}}>
                    <Box sx={{width:3,minHeight:18,bgcolor:pal.secondary,borderRadius:2,flexShrink:0}}/>
                    <Typography sx={{fontSize:13,fontWeight:800,color:pal.primary,textTransform:'uppercase',letterSpacing:1.2}}>{courseName}</Typography>
                </Box>
                <Typography sx={{fontSize:9.5,color:'#aaa',fontStyle:'italic',display:'block',mb:2,animation:`${fadeIn} 0.4s ease 0.8s both`}}>
                    Demonstrating excellence in leadership and strategic planning.
                </Typography>
                <Box sx={{display:'flex',gap:3,animation:`${fadeInUp} 0.5s ease 0.9s both`,pt:1.5,borderTop:'1px solid #f0f0f0'}}>
                    <Box>
                        <Typography sx={{fontSize:11,fontWeight:700,color:pal.primary}}>{dateLabel}</Typography>
                        <Typography sx={{fontSize:7.5,letterSpacing:1.5,color:'#ccc',textTransform:'uppercase'}}>Date Issued</Typography>
                    </Box>
                    <Box sx={{width:1,bgcolor:'#f0f0f0',flexShrink:0}}/>
                    <Box>
                        <Typography sx={{fontSize:11,fontWeight:700,color:pal.secondary,fontStyle:'italic'}}>{instructorName}</Typography>
                        <Typography sx={{fontSize:7.5,letterSpacing:1.5,color:'#ccc',textTransform:'uppercase'}}>Course Mentor</Typography>
                    </Box>
                    <Box sx={{width:1,bgcolor:'#f0f0f0',flexShrink:0}}/>
                    <Box>
                        <Typography sx={{fontSize:9,fontWeight:600,color:'#aaa'}}>{certId}</Typography>
                        <Typography sx={{fontSize:7.5,letterSpacing:1.5,color:'#ccc',textTransform:'uppercase'}}>Certificate ID</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{position:'absolute',zIndex:1,right:0,top:0,bottom:0,width:'42%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pr:4,pl:2}}>
                <Box sx={{width:90,height:90,borderRadius:'50%',mb:2,border:`3px solid ${pal.secondary}88`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',animation:`${scaleIn} 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.8s both`,'&::before':{content:'""',position:'absolute',inset:6,border:`1px solid ${pal.secondary}44`,borderRadius:'50%'}}}>
                    <VerifiedIcon sx={{color:pal.secondary,fontSize:44}}/>
                </Box>
                <Typography sx={{fontSize:9.5,letterSpacing:3,color:`${pal.secondary}cc`,textTransform:'uppercase',textAlign:'center',mb:0.5}}>Officially</Typography>
                <Typography sx={{fontSize:15,fontWeight:800,color:pal.secondary,letterSpacing:1,textTransform:'uppercase',textAlign:'center'}}>Certified</Typography>
                <Typography sx={{fontSize:7.5,color:`${pal.secondary}66`,letterSpacing:1,mt:2,textAlign:'center'}}>ID: {certId}</Typography>
            </Box>
        </Box>
    );

    // ── ELEGANT ──────────────────────────────────────────────────────────────
    if (tpl === 'elegant') return (
        <Box sx={{
            boxSizing: 'border-box', // Add this line
            width:CERT_W,minHeight:CERT_H,
            background:`radial-gradient(ellipse at 50% 0%,${pal.primary}ee 0%,${pal.primary} 60%)`,
            p:'36px 52px',fontFamily:'"Georgia","Times New Roman",serif',
            border:`1px solid ${pal.secondary}66`,position:'relative',overflow:'hidden',
            animation:`${fadeIn} 0.5s ease both,${borderGlow} 4s ease 1s infinite`,
        }}>
            <Box sx={{position:'absolute',inset:8,border:`1px solid ${pal.secondary}55`,pointerEvents:'none'}}/>
            <Box sx={{position:'absolute',inset:14,border:`1px solid ${pal.secondary}22`,pointerEvents:'none'}}/>
            <Box sx={{position:'absolute',inset:0,pointerEvents:'none',background:`radial-gradient(ellipse 70% 45% at 50% 0%,${pal.secondary}18 0%,transparent 70%)`}}/>
            <Box sx={{position:'absolute',bottom:0,left:0,right:0,height:120,pointerEvents:'none',background:'linear-gradient(to top,rgba(0,0,0,0.3),transparent)'}}/>
            {['tl','tr','bl','br'].map((pos,i)=>(
                <Box key={pos} sx={{position:'absolute',...(pos.includes('t')?{top:18}:{bottom:18}),...(pos.includes('l')?{left:18}:{right:18}),width:36,height:36,animation:`${cornerAppear} 0.45s cubic-bezier(0.34,1.56,0.64,1) ${0.1+i*0.07}s both`}}>
                    <Box sx={{width:'100%',height:'100%',position:'relative',
                        '&::before':{content:'""',position:'absolute',top:0,...(pos.includes('l')?{left:0}:{right:0}),width:16,height:'100%',borderTop:`2px solid ${pal.secondary}`,...(pos.includes('l')?{borderLeft:`2px solid ${pal.secondary}`}:{borderRight:`2px solid ${pal.secondary}`})},
                        '&::after':{content:'""',position:'absolute',...(pos.includes('t')?{top:0}:{bottom:0}),...(pos.includes('l')?{left:0}:{right:0}),width:'100%',height:16,borderTop:pos.includes('t')?`2px solid ${pal.secondary}`:'none',borderBottom:pos.includes('b')?`2px solid ${pal.secondary}`:'none',...(pos.includes('l')?{borderLeft:`2px solid ${pal.secondary}`}:{borderRight:`2px solid ${pal.secondary}`})},
                    }}/>
                    <Box sx={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%) rotate(45deg)',width:7,height:7,bgcolor:pal.secondary,boxShadow:`0 0 8px ${pal.secondary}`}}/>
                </Box>
            ))}
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',mb:1,animation:`${fadeInDown} 0.5s ease 0.15s both`}}>
                <Box sx={{display:'flex',alignItems:'center',gap:1.5,mb:0.75}}>
                    <Box sx={{height:1,width:60,bgcolor:pal.secondary,opacity:0.4}}/>
                    <Box sx={{transform:'rotate(45deg)',width:10,height:10,bgcolor:pal.secondary,boxShadow:`0 0 12px ${pal.secondary}`}}/>
                    <Box sx={{height:1,width:60,bgcolor:pal.secondary,opacity:0.4}}/>
                </Box>
                <Box sx={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:58,height:58,borderRadius:'50%',border:`2px solid ${pal.secondary}`,boxShadow:`0 0 20px ${pal.secondary}44,inset 0 0 20px rgba(0,0,0,0.2)`,mb:0.75,animation:`${iconSpin} 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both`}}>
                    <WorkspacePremiumIcon sx={{color:pal.secondary,fontSize:32}}/>
                </Box>
                <Typography sx={{fontSize:10,letterSpacing:6,color:pal.secondary,textTransform:'uppercase',fontFamily:'sans-serif',fontWeight:700,animation:`${glowPulse} 3s ease 2s infinite`}}>ManPro</Typography>
            </Box>
            <Box sx={{display:'flex',alignItems:'center',gap:2,mb:1.25,animation:`${fadeIn} 0.5s ease 0.35s both`}}>
                <Box sx={{flex:1,height:'1px',background:`linear-gradient(90deg,transparent,${pal.secondary}88)`}}/>
                <Box sx={{display:'flex',gap:0.75,alignItems:'center'}}>{[6,8,10,8,6].map((s,i)=><Box key={i} sx={{width:s,height:s,transform:'rotate(45deg)',bgcolor:pal.secondary,opacity:0.6+(i===2?0.4:0)}}/>)}</Box>
                <Box sx={{flex:1,height:'1px',background:`linear-gradient(90deg,${pal.secondary}88,transparent)`}}/>
            </Box>
            <Typography sx={{textAlign:'center',fontSize:22,fontWeight:700,color:pal.secondary,letterSpacing:8,textTransform:'uppercase',mb:1.25,animation:`${fadeInUp} 0.55s ease 0.42s both`,textShadow:`0 0 30px ${pal.secondary}55`}}>
                Certificate of Completion
            </Typography>
            <Box sx={{display:'flex',alignItems:'center',gap:2,mb:1.5,animation:`${fadeIn} 0.5s ease 0.52s both`}}>
                <Box sx={{flex:1,height:'1px',background:`linear-gradient(90deg,transparent,${pal.secondary}55)`}}/>
                <Box sx={{width:8,height:8,transform:'rotate(45deg)',bgcolor:pal.secondary,opacity:0.8}}/>
                <Box sx={{flex:1,height:'1px',background:`linear-gradient(90deg,${pal.secondary}55,transparent)`}}/>
            </Box>
            <Typography sx={{textAlign:'center',fontSize:8.5,letterSpacing:4,color:'rgba(255,255,255,0.45)',textTransform:'uppercase',mb:0.75,fontFamily:'sans-serif',animation:`${fadeIn} 0.4s ease 0.6s both`}}>
                This Certificate Is Proudly Presented To
            </Typography>
            <Typography sx={{textAlign:'center',fontSize:36,fontStyle:'italic',color:'#fff',mb:0.5,animation:`${nameWrite} 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.65s both`,textShadow:'0 2px 20px rgba(0,0,0,0.4)'}}>
                {studentName}
            </Typography>
            <Typography sx={{textAlign:'center',fontSize:10,color:'rgba(255,255,255,0.55)',mb:1,fontFamily:'sans-serif',animation:`${fadeIn} 0.4s ease 0.8s both`}}>
                For successfully completing the comprehensive online course
            </Typography>
            <Typography sx={{textAlign:'center',fontSize:15,fontWeight:700,color:pal.secondary,letterSpacing:3,textTransform:'uppercase',mb:0.75,animation:`${fadeInUp} 0.5s ease 0.87s both`,textShadow:`0 0 20px ${pal.secondary}44`}}>
                {courseName}
            </Typography>
            <Typography sx={{textAlign:'center',fontSize:9.5,color:'rgba(255,255,255,0.45)',fontStyle:'italic',mb:1.5,fontFamily:'sans-serif',animation:`${fadeIn} 0.4s ease 0.94s both`}}>
                Demonstrating excellence in leadership and strategic planning.
            </Typography>
            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',animation:`${fadeInUp} 0.5s ease 1.05s both`}}>
                <Box sx={{textAlign:'center'}}>
                    <Typography sx={{fontSize:12,fontWeight:600,color:pal.secondary,fontStyle:'italic'}}>{dateLabel}</Typography>
                    <Box sx={{width:90,height:1,background:`linear-gradient(90deg,transparent,${pal.secondary}66,transparent)`,mt:0.5,mx:'auto'}}/>
                    <Typography sx={{fontSize:7.5,letterSpacing:2.5,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',mt:0.25}}>Date Issued</Typography>
                </Box>
                <Box sx={{textAlign:'center'}}>
                    <Box sx={{width:52,height:52,borderRadius:'50%',border:`2px solid ${pal.secondary}`,boxShadow:`0 0 20px ${pal.secondary}44,inset 0 0 16px rgba(0,0,0,0.3)`,display:'flex',alignItems:'center',justifyContent:'center',mx:'auto',animation:`${scaleIn} 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.1s both`}}>
                        <CheckCircleIcon sx={{color:pal.secondary,fontSize:28}}/>
                    </Box>
                    <Typography sx={{fontSize:7.5,letterSpacing:1,color:'rgba(255,255,255,0.3)',mt:0.5}}>ID: {certId}</Typography>
                </Box>
                <Box sx={{textAlign:'center'}}>
                    <Typography sx={{fontSize:15,fontStyle:'italic',color:pal.secondary,fontWeight:600}}>{instructorName}</Typography>
                    <Box sx={{width:100,height:1,background:`linear-gradient(90deg,transparent,${pal.secondary}66,transparent)`,mt:0.5,mx:'auto'}}/>
                    <Typography sx={{fontSize:7.5,letterSpacing:2.5,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',mt:0.25}}>Course Mentor</Typography>
                </Box>
            </Box>
        </Box>
    );

    // ── MINIMAL (default) ────────────────────────────────────────────────────
    return (
        <Box sx={{width:CERT_W,minHeight:CERT_H,bgcolor:'#ffffff',fontFamily:'"Helvetica Neue","Arial",sans-serif',position:'relative',overflow:'hidden',border:'1px solid #e8e8e8',animation:`${fadeIn} 0.5s ease both`}}>
            <Box sx={{position:'absolute',top:0,left:0,bottom:0,width:6,bgcolor:pal.primary,animation:`${fadeIn} 0.4s ease 0.1s both`}}/>
            <Box sx={{position:'absolute',top:0,left:6,right:0,height:3,bgcolor:pal.secondary,animation:`${accentBarSlide} 0.6s ease 0.12s both`}}/>
            <Box sx={{pl:7,pr:5,pt:4,pb:4}}>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:4,animation:`${fadeInDown} 0.5s ease 0.18s both`}}>
                    <Box sx={{display:'flex',alignItems:'center',gap:1.5}}>
                        <Box sx={{width:34,height:34,bgcolor:pal.primary,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <WorkspacePremiumIcon sx={{color:'white',fontSize:18}}/>
                        </Box>
                        <Box>
                            <Typography sx={{fontSize:9.5,letterSpacing:3,color:pal.primary,textTransform:'uppercase',fontWeight:800,lineHeight:1.2}}>ManPro</Typography>
                            <Typography sx={{fontSize:7.5,letterSpacing:2,color:'#ccc',textTransform:'uppercase'}}>Expert Hub</Typography>
                        </Box>
                    </Box>
                    <Typography sx={{fontSize:8,letterSpacing:2,color:'#ddd',fontFamily:'monospace',textTransform:'uppercase'}}>№  {certId}</Typography>
                </Box>
                <Box sx={{display:'flex',gap:5}}>
                    <Box sx={{flex:1,minWidth:0}}>
                        <Typography sx={{fontSize:8.5,letterSpacing:4,color:'#bbb',textTransform:'uppercase',mb:0.5,animation:`${fadeIn} 0.4s ease 0.28s both`}}>Certificate of Completion</Typography>
                        <Box sx={{height:.8,bgcolor:pal.secondary,mb:2,width:48,animation:`${accentBarSlide} 0.5s ease 0.32s both`}}/>
                        <Typography sx={{fontSize:8.5,color:'#ccc',letterSpacing:1,mb:0.5,animation:`${fadeIn} 0.4s ease 0.36s both`}}>Awarded to</Typography>
                        <Typography sx={{fontSize:40,fontWeight:900,color:pal.primary,lineHeight:0.95,mb:1.5,letterSpacing:-2,animation:`${nameWrite} 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 0.42s both`}}>
                            {studentName}
                        </Typography>
                        <Typography sx={{fontSize:9,color:'#bbb',mb:0.5,animation:`${fadeIn} 0.4s ease 0.58s both`}}>For successfully completing</Typography>
                        <Typography sx={{fontSize:14,fontWeight:700,color:'#222',letterSpacing:0.5,textTransform:'uppercase',mb:0.5,animation:`${fadeInUp} 0.5s ease 0.64s both`,lineHeight:1.3}}>
                            {courseName}
                        </Typography>
                        <Box sx={{height:2,width:40,bgcolor:pal.secondary,mb:1.5,animation:`${accentBarSlide} 0.4s ease 0.74s both`}}/>
                        <Typography sx={{fontSize:9,color:'#bbb',fontStyle:'italic',mb:2.5,animation:`${fadeIn} 0.4s ease 0.8s both`}}>
                            Demonstrating excellence in leadership and strategic planning.
                        </Typography>
                        <Box sx={{display:'flex',gap:4,animation:`${fadeInUp} 0.5s ease 0.9s both`,borderTop:'1px solid #f0f0f0',pt:1.5}}>
                            <Box>
                                <Typography sx={{fontSize:11,fontWeight:700,color:'#333'}}>{dateLabel}</Typography>
                                <Typography sx={{fontSize:7.5,letterSpacing:2,color:'#ccc',textTransform:'uppercase'}}>Date</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{fontSize:11,fontWeight:700,color:'#333'}}>{instructorName}</Typography>
                                <Typography sx={{fontSize:7.5,letterSpacing:2,color:'#ccc',textTransform:'uppercase'}}>Course Mentor</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{width:120,flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1.5,animation:`${fadeIn} 0.5s ease 0.5s both`}}>
                        <Box sx={{width:80,height:80,borderRadius:'50%',border:`1.5px solid ${pal.primary}`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',animation:`${scaleIn} 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.7s both`,'&::before':{content:'""',position:'absolute',inset:5,borderRadius:'50%',border:`0.5px solid ${pal.primary}33`}}}>
                            <CheckCircleIcon sx={{color:pal.primary,fontSize:32}}/>
                        </Box>
                        <Typography sx={{fontSize:7.5,letterSpacing:3,color:'#ccc',textTransform:'uppercase',textAlign:'center',lineHeight:1.8}}>Verified<br/>& Certified</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{position:'absolute',bottom:0,right:0,width:60,height:60,borderTop:'1px solid #f0f0f0',borderLeft:'1px solid #f0f0f0',animation:`${fadeIn} 0.4s ease 1s both`}}/>
        </Box>
    );
}
