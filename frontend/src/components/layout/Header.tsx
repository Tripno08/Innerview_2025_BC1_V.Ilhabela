import { useState, MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Avatar,
  Box,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

interface IHeaderProps {
  title: string;
  drawerOpen: boolean;
  drawerWidth: number;
  onDrawerToggle: () => void;
}

export default function Header({
  title,
  drawerOpen,
  drawerWidth,
  onDrawerToggle,
}: IHeaderProps) {
  const navigate = useNavigate();
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);

  // Simulação de notificações
  const notifications = [
    { id: 1, message: 'Nova intervenção registrada', read: false },
    { id: 2, message: 'Atualização no status do estudante', read: false },
    { id: 3, message: 'Relatório mensal disponível', read: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Manipuladores de eventos para menus
  const handleNotificationsOpen = (event: MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleMenuAction = (action: string) => {
    handleUserMenuClose();
    
    switch (action) {
      case 'profile':
        // Navegar para perfil
        console.log('Navegando para perfil');
        break;
      case 'settings':
        // Navegar para configurações
        navigate('/settings');
        break;
      case 'help':
        // Abrir ajuda
        console.log('Abrindo ajuda');
        break;
      case 'logout':
        // Fazer logout
        console.log('Realizando logout');
        break;
      default:
        break;
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
        ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
        transition: (theme: any) => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="abrir menu"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {/* Botão de notificações */}
        <Tooltip title="Notificações">
          <IconButton
            color="inherit"
            aria-label="notificações"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        
        {/* Menu de notificações */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Typography variant="subtitle1" sx={{ p: 2, pb: 1 }}>
            Notificações
          </Typography>
          <Divider />
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationsClose}
                sx={{ 
                  py: 1,
                  px: 2,
                  fontWeight: notification.read ? 'normal' : 'bold'
                }}
              >
                {notification.message}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                Nenhuma notificação
              </Typography>
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleNotificationsClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">
              Ver todas
            </Typography>
          </MenuItem>
        </Menu>

        {/* Botão de perfil */}
        <Tooltip title="Perfil">
          <IconButton
            color="inherit"
            aria-label="perfil do usuário"
            onClick={handleUserMenuOpen}
            size="large"
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
        
        {/* Menu de usuário */}
        <Menu
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: { width: 220 },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1">Maria Silva</Typography>
            <Typography variant="body2" color="text.secondary">
              maria.silva@ilhabela.edu.br
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => handleMenuAction('profile')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Meu Perfil
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Configurações
          </MenuItem>
          <MenuItem onClick={() => handleMenuAction('help')}>
            <ListItemIcon>
              <HelpIcon fontSize="small" />
            </ListItemIcon>
            Ajuda
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuAction('logout')}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
} 