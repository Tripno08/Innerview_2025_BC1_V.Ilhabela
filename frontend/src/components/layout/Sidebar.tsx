import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Box, Collapse, ListSubheader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TimelineIcon from '@mui/icons-material/Timeline';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';

interface IMenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  subItems?: IMenuItem[];
}

interface IMenuSection {
  title: string;
  items: IMenuItem[];
}

const menuSections: IMenuSection[] = [
  {
    title: 'Principal',
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardIcon />,
        subItems: [
          {
            title: 'Visão Geral',
            path: '/dashboard',
            icon: <DashboardIcon />,
          },
          {
            title: 'Análise de Desempenho',
            path: '/dashboard/performance',
            icon: <ShowChartIcon />,
          }
        ]
      },
    ],
  },
  {
    title: 'Gestão',
    items: [
      {
        title: 'Estudantes',
        path: '/students',
        icon: <PeopleIcon />,
      },
      {
        title: 'Sistema RTI/MTSS',
        path: '/rti',
        icon: <PsychologyIcon />,
        subItems: [
          {
            title: 'Visão Geral',
            path: '/rti',
            icon: <DashboardIcon />,
          },
          {
            title: 'Classificação',
            path: '/rti/classificacao',
            icon: <CategoryIcon />,
          },
          {
            title: 'Monitoramento',
            path: '/rti/monitoramento',
            icon: <TimelineIcon />,
          },
          {
            title: 'Progresso',
            path: '/rti/progresso',
            icon: <ShowChartIcon />,
          },
          {
            title: 'Visualizações',
            path: '/rti/visualizacoes',
            icon: <AssessmentIcon />,
          },
          {
            title: 'Movimento',
            path: '/rti/movimento',
            icon: <TimelineIcon />,
          },
          {
            title: 'Tomada de Decisão',
            path: '/rti/decisao',
            icon: <AssessmentIcon />,
          }
        ]
      },
      {
        title: 'Intervenções',
        path: '/interventions',
        icon: <SchoolIcon />,
        subItems: [
          {
            title: 'Acompanhamento',
            path: '/interventions/progress',
            icon: <TimelineIcon />,
          },
          {
            title: 'Eficácia',
            path: '/interventions/efficacy',
            icon: <ShowChartIcon />,
          },
          {
            title: 'Análise de Impacto',
            path: '/interventions/impact',
            icon: <AssessmentIcon />,
          },
          {
            title: 'Planejamento',
            path: '/interventions/planning',
            icon: <CalendarTodayIcon />,
          },
        ],
      },
      {
        title: 'Rastreios e Avaliações',
        path: '/rastreios-avaliacoes',
        icon: <FactCheckIcon />,
        subItems: [
          {
            title: 'Instrumentos',
            path: '/rastreios-avaliacoes/instrumentos',
            icon: <CategoryIcon />,
          },
          {
            title: 'Aplicações',
            path: '/rastreios-avaliacoes/aplicacoes',
            icon: <MenuBookIcon />,
          },
          {
            title: 'Avaliações Externas',
            path: '/rastreios-avaliacoes/avaliacoes',
            icon: <MedicalInformationIcon />,
          },
        ],
      },
      {
        title: 'Equipes',
        path: '/equipes',
        icon: <PeopleIcon />,
        subItems: [
          {
            title: 'Lista de Equipes',
            path: '/equipes',
            icon: <PeopleIcon />,
          },
          {
            title: 'Nova Equipe',
            path: '/equipes/nova',
            icon: <AddIcon />,
          }
        ]
      },
    ],
  },
  {
    title: 'Relatórios',
    items: [
      {
        title: 'Análises',
        path: '/reports',
        icon: <AssessmentIcon />,
      },
    ],
  },
  {
    title: 'IA Analytics',
    items: [
      {
        title: 'IA Analytics',
        path: '/ai-analytics',
        icon: <PsychologyIcon />,
        subItems: [
          {
            title: 'Previsão de Desempenho',
            path: '/ai-analytics/student-prediction',
            icon: <ShowChartIcon />,
          },
          {
            title: 'Recomendações',
            path: '/ai-analytics/recommendations',
            icon: <TipsAndUpdatesIcon />,
          },
        ],
      },
    ],
  },
  {
    title: 'Sistema',
    items: [
      {
        title: 'Configurações',
        path: '/settings',
        icon: <SettingsIcon />,
      },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const pathname = location.pathname;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const handleClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const handleSubMenuToggle = (path: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Verificar automaticamente se um menu deve estar aberto baseado no pathname atual
  const isPathInSubmenu = (item: IMenuItem) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => pathname.startsWith(subItem.path));
  };

  const MenuItemComponent = ({ item }: { item: IMenuItem }) => {
    const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);

    return (
      <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton
          onClick={handleClick}
          sx={{
            py: 1,
            pl: 3,
            borderRadius: '0 24px 24px 0',
            mr: 1,
            backgroundColor: isActive ? 'primary.light' : 'transparent',
            color: isActive ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              backgroundColor: isActive ? 'primary.light' : 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ color: isActive ? 'primary.contrastText' : 'text.secondary', minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
        </ListItemButton>
      </Link>
    );
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Innerview Ilhabela
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 2 }}>
        {menuSections.map((section, index) => (
          <Box key={section.title}>
            {index > 0 && <Divider />}
            <Box sx={{ pt: 2, pb: 1, pl: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {section.title}
              </Typography>
            </Box>
            <List 
              component="div" 
              disablePadding
              subheader={
                <ListSubheader component="div" sx={{ display: 'none' }}>
                  {section.title}
                </ListSubheader>
              }
            >
              {section.items.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubMenuOpen = openSubMenus[item.path] || isPathInSubmenu(item);

                return (
                  <Box key={item.path}>
                    {hasSubItems ? (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton 
                            selected={pathname === item.path}
                            onClick={() => handleSubMenuToggle(item.path)}
                          >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                            {isSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                        </ListItem>
                        
                        <Collapse in={isSubMenuOpen} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            <ListItem disablePadding>
                              <Link to={item.path} style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
                                <ListItemButton sx={{ pl: 4 }} selected={pathname === item.path}>
                                  <ListItemText primary="Visão Geral" />
                                </ListItemButton>
                              </Link>
                            </ListItem>
                            
                            {item.subItems && item.subItems.map(subItem => (
                              <ListItem key={subItem.path} disablePadding>
                                <Link to={subItem.path} style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
                                  <ListItemButton sx={{ pl: 4 }} selected={pathname === subItem.path}>
                                    <ListItemIcon>{subItem.icon}</ListItemIcon>
                                    <ListItemText primary={subItem.title} />
                                  </ListItemButton>
                                </Link>
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </>
                    ) : (
                      <ListItem disablePadding>
                        <Link to={item.path} style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
                          <ListItemButton selected={pathname === item.path}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    )}
                  </Box>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 2 }}>
        <ListItemButton
          sx={{
            py: 1,
            pl: 3,
            borderRadius: '0 24px 24px 0',
            mr: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar; 