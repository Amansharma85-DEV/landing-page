const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (isFormData: boolean = false) => {
  const headers: Record<string, string> = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const api = {
  get: async (endpoint: string) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'API request failed');
      return data;
    } catch (error: any) {
      console.error(`API GET ${endpoint} Error:`, error);
      throw error;
    }
  },

  post: async (endpoint: string, body: any) => {
    try {
      const isFormData = body instanceof FormData;
      const headers = getHeaders(isFormData);
      
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? body : JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'API request failed');
      return data;
    } catch (error: any) {
      console.error(`API POST ${endpoint} Error:`, error);
      throw error;
    }
  },

  put: async (endpoint: string, body: any) => {
    try {
      const isFormData = body instanceof FormData;
      const headers = getHeaders(isFormData);
      
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: isFormData ? body : JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'API request failed');
      return data;
    } catch (error: any) {
      console.error(`API PUT ${endpoint} Error:`, error);
      throw error;
    }
  },

  delete: async (endpoint: string) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'API request failed');
      return data;
    } catch (error: any) {
      console.error(`API DELETE ${endpoint} Error:`, error);
      throw error;
    }
  }
};

export default api;
