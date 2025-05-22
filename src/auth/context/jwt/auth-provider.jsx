import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';


const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('access_token');

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const user = response.data?.data;

        if (response.data?.success) {
          dispatch({
            type: 'INITIAL',
            payload: {
              user: {
                ...user,
                accessToken,
              },
            },
          });
        } else {
          localStorage.removeItem('accessToken');
          dispatch({
            type: 'INITIAL',
            payload: {
              user: null,
            },
          });
        }
      } else {
        localStorage.removeItem('accessToken');
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      router.push('/auth/jwt/login');
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (phone, password) => {
    const data = {
      phone,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const accessToken = response?.data?.data?.token;

    localStorage.setItem('access_token', accessToken);
    initialize();

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          accessToken,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data) => {
    const response = await axios.post(endpoints.auth.register, data);

    const accessToken = response?.data?.data?.token;

    localStorage.setItem('access_token', accessToken);

    initialize();

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          accessToken,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    localStorage.removeItem('access_token');
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      initialize
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
