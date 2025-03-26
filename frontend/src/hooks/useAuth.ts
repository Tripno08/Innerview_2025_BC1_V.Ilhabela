import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { IUsuario, ICredenciais } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: IUsuario | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  });
  const navigate = useNavigate();

  // Verificar autenticação ao inicializar o hook
  useEffect(() => {
    const verificarAutenticacao = async () => {
      const isAuthenticated = authService.isAuthenticated();
      const user = authService.getUsuarioAtual();

      if (isAuthenticated && user) {
        // Verificar se o token ainda é válido
        try {
          const isValid = await authService.verificarToken();
          if (isValid) {
            setAuthState({
              isAuthenticated: true,
              user,
              isLoading: false,
              error: null
            });
          } else {
            // Token inválido, redirecionar para login
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: 'Sessão expirada. Por favor, faça login novamente.'
            });
            authService.logout();
          }
        } catch (error: unknown) {
          // Erro ao verificar token
          console.error('Erro ao verificar token:', error);
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Erro ao verificar autenticação.'
          });
          authService.logout();
        }
      } else {
        // Não autenticado
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null
        });
      }
    };

    verificarAutenticacao();
  }, []);

  // Função para login
  const login = useCallback(async (credenciais: ICredenciais) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credenciais);
      setAuthState({
        isAuthenticated: true,
        user: response.usuario,
        isLoading: false,
        error: null
      });
      return true;
    } catch (error) {
      let mensagemErro = 'Erro ao realizar login. Verifique suas credenciais.';
      if (error instanceof Error) {
        mensagemErro = error.message;
      }

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: false,
        error: mensagemErro
      }));
      return false;
    }
  }, []);

  // Função para logout
  const logout = useCallback(() => {
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
    navigate('/login');
  }, [navigate]);

  // Função para verificar permissão
  const hasPermission = useCallback((requiredRole: string | string[]): boolean => {
    if (!authState.isAuthenticated || !authState.user) {
      return false;
    }

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(authState.user.papel);
    }

    return authState.user.papel === requiredRole;
  }, [authState.isAuthenticated, authState.user]);

  // Retorna as funções e estados
  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
    hasPermission
  };
} 