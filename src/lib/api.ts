import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management functions
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  },
  
  setToken: (token: string, remember: boolean = false): void => {
    if (remember) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  },
  
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  },
  
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenManager.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Auth
  login: '/auth/login',
  logout: '/auth/logout',
  
  // Services
  services: '/services',
  serviceById: (id: number) => `/services/${id}`,
  
  // Packages
  packages: '/packages',
  packageById: (id: number) => `/packages/${id}`,
  
  // Contracts
  contracts: '/contracts',
  contractById: (id: number) => `/contracts/${id}`,
  
  // Reports
  adminMetrics: '/reports/performance/admin',
  agentMetrics: (userId: string) => `/reports/performance/agent/${userId}`,
};

// API service functions
export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await api.post(apiEndpoints.login, { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post(apiEndpoints.logout);
    tokenManager.removeToken();
    return response.data;
  },
  
  // Services
  getServices: async () => {
    const response = await api.get(apiEndpoints.services);
    return response.data;
  },
  
  createService: async (serviceData: any) => {
    const response = await api.post(apiEndpoints.services, serviceData);
    return response.data;
  },
  
  updateService: async (id: number, serviceData: any) => {
    const response = await api.put(apiEndpoints.serviceById(id), serviceData);
    return response.data;
  },
  
  deleteService: async (id: number) => {
    const response = await api.delete(apiEndpoints.serviceById(id));
    return response.data;
  },
  
  // Packages
  getPackages: async () => {
    const response = await api.get(apiEndpoints.packages);
    return response.data;
  },
  
  createPackage: async (packageData: any) => {
    const response = await api.post(apiEndpoints.packages, packageData);
    return response.data;
  },
  
  updatePackage: async (id: number, packageData: any) => {
    const response = await api.put(apiEndpoints.packageById(id), packageData);
    return response.data;
  },
  
  deletePackage: async (id: number) => {
    const response = await api.delete(apiEndpoints.packageById(id));
    return response.data;
  },
  
  // Contracts
  getContracts: async () => {
    const response = await api.get(apiEndpoints.contracts);
    return response.data;
  },
  
  createContract: async (contractData: any) => {
    const response = await api.post(apiEndpoints.contracts, contractData);
    return response.data;
  },
  
  updateContract: async (id: number, contractData: any) => {
    const response = await api.put(apiEndpoints.contractById(id), contractData);
    return response.data;
  },
  
  // Reports
  getAdminMetrics: async () => {
    const response = await api.get(apiEndpoints.adminMetrics);
    return response.data;
  },
  
  getAgentMetrics: async (userId: string) => {
    const response = await api.get(apiEndpoints.agentMetrics(userId));
    return response.data;
  },
};

export default api;
