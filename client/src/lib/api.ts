// API utility functions for authenticated requests

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

// Get the stored JWT token
export function getAuthToken(): string | null {
  return localStorage.getItem('userToken');
}

// Get the stored user data
export function getUserData(): any | null {
  const userData = localStorage.getItem('userData');
  const parsed = userData ? JSON.parse(userData) : null;
  console.log('API: getUserData - data exists:', !!parsed, parsed);
  return parsed;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  console.log('API: isAuthenticated check - token exists:', !!token);
  return !!token;
}

// Clear authentication data
export function clearAuth(): void {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
}

// Make authenticated API request
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    } else {
      // Handle authentication errors
      if (response.status === 401) {
        clearAuth();
        window.location.href = '/login';
      }
      
      return {
        success: false,
        message: data.message || 'Request failed',
        errors: data.errors,
      };
    }
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Convenience methods for common HTTP methods
export const api = {
  get: <T = any>(url: string) => apiRequest<T>(url, { method: 'GET' }),
  
  post: <T = any>(url: string, data?: any) => 
    apiRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T = any>(url: string, data?: any) => 
    apiRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T = any>(url: string) => apiRequest<T>(url, { method: 'DELETE' }),
};

// Auth-specific API calls
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      return { success: true, data };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    institution?: string;
    yearOfStudy?: string;
  }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      return { success: true, data };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  },

  getCurrentUser: () => api.get('/api/auth/me'),
};