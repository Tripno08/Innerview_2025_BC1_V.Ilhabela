import { ReactNode, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Toolbar from '@mui/material/Toolbar';
import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface IAppLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: IAppLayoutProps) {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header com controles de usuário */}
      <Header 
        title={title}
        drawerOpen={open}
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
      />
      
      {/* Sidebar / Navegação lateral */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ pl: 1 }}>
            Innerview Ilhabela
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <Sidebar open={open} onClose={handleDrawerToggle} />
      </Drawer>
      
      {/* Conteúdo principal */}
      <Main open={open}>
        <Toolbar /> {/* Espaçamento para compensar a altura da AppBar */}
        <Box component="div" sx={{ mt: 2 }}>
          {children}
        </Box>
      </Main>
    </Box>
  );
} 