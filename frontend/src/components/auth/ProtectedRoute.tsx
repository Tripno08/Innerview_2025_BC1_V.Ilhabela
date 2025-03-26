import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, error, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se não estiver carregando e não estiver autenticado, redireciona para login
    if (!isLoading && !isAuthenticated) {
      navigate(fallbackPath);
    }

    // Se estiver autenticado mas não tiver permissão, redireciona
    if (!isLoading && isAuthenticated && requiredRole && !hasPermission(requiredRole)) {
      navigate('/acesso-negado');
    }
  }, [isLoading, isAuthenticated, requiredRole, hasPermission, navigate, fallbackPath]);

  // Se estiver carregando, mostra um loader
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Se houver um erro, mostra mensagem
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: 2
        }}
      >
        <Alert severity="error" sx={{ width: '100%', maxWidth: 500, mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate(fallbackPath)}>
          Voltar para Login
        </Button>
      </Box>
    );
  }

  // Se estiver autenticado e tiver a permissão necessária (se especificada), renderiza os filhos
  if (isAuthenticated && (!requiredRole || hasPermission(requiredRole))) {
    return <>{children}</>;
  }

  // Caso ainda esteja processando a verificação de permissão
  return null;
} 