import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(credentials) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = null;
    }

    if (!response.ok) {
      const msg = data && data.message ? data.message : 'Login gagal';
      throw new Error(msg);
    }

    if (!data || !data.user || !data.accessToken) {
      throw new Error('Respon server tidak valid');
    }

    // store access token (refresh token is httpOnly cookie)
    localStorage.setItem('kjpp_access', data.accessToken);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    // notify server to revoke refresh token (cookie)
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    localStorage.removeItem('kjpp_access');
    setUser(null);
  }

  async function refreshAccessToken() {
    const res = await fetch('/api/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Refresh failed');
    const data = await res.json();
    if (data && data.accessToken) {
      localStorage.setItem('kjpp_access', data.accessToken);
      return data.accessToken;
    }
    throw new Error('Refresh response invalid');
  }

  // helper to make authenticated requests with auto-refresh
  async function authFetch(input, init = {}) {
    const access = localStorage.getItem('kjpp_access');
    init.headers = init.headers || {};
    if (access) init.headers['Authorization'] = `Bearer ${access}`;
    init.credentials = 'include';

    let res = await fetch(input, init);
    if (res.status === 401) {
      try {
        const newAccess = await refreshAccessToken();
        init.headers['Authorization'] = `Bearer ${newAccess}`;
        res = await fetch(input, init);
      } catch (err) {
        // failed refresh
        logout();
        throw err;
      }
    }
    return res;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user), authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
