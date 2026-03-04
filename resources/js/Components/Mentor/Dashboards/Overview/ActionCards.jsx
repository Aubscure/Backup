import React from 'react';
import { router } from '@inertiajs/react';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Plus, ClipboardCheck, Award } from 'lucide-react';
import { ACTION_CARDS } from '@/Utils/dashboardUtils';   // ← from utils

const ICON_COMPONENTS = { Plus, ClipboardCheck, Award };

export default function ActionCards() {
    const handleClick = (action) => {
        if (action.route) router.visit(route(action.route));
    };

    return (
            <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' }, // 👈 stack on small
                gap: 2,
                width: '100%',
                maxWidth: { xs: '100%', md: 700 },
                justifyContent: { xs: 'stretch', md: 'flex-end' },
            }}
            >

            {ACTION_CARDS.map((action) => {
                const Icon = ICON_COMPONENTS[action.iconKey] ?? Plus;
                return (
                    <Card
                        key={action.label}
                        elevation={0}
                        sx={{
                            flex: { xs: '1 1 100%', md: '1 1 0' },
                            minWidth: 0,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'box-shadow 0.2s, transform 0.15s',
                            '&:hover': {
                                boxShadow: 3,
                                '& .accent-bar': { transform: 'translateX(0)' },
                                '& .action-icon': { transform: 'scale(1.1)' },
                            },
                            '&:active': { transform: 'scale(0.985)' },
                        }}
                    >
                        <CardActionArea onClick={() => handleClick(action)}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, gap: 1.5, p: { xs: 1.5, sm: 2 } }}>
                                <Box
                                    className="action-icon"
                                    sx={{
                                        p: 1, borderRadius: 2, bgcolor: action.iconBg,
                                        display: 'flex', flexShrink: 0, transition: 'transform 0.2s',
                                    }}
                                >
                                    <Icon size={20} color={action.iconColor} />
                                </Box>
                                <Typography
                                    fontWeight={600}
                                    color="text.primary"
                                    variant="body2"
                                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, lineHeight: 1.2, overflow: 'hidden', whiteSpace: 'wrap',  justifyContent: 'center', alignItems: 'center',  }}
                                >
                                    {action.label}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <Box
                            className="accent-bar"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: 4,
                                height: '100%',
                                bgcolor: '#15803d',
                                transform: 'translateX(100%)',
                                transition: 'transform 0.25s ease',
                            }}
                        />
                    </Card>
                );
            })}
        </Box>
    );
}
