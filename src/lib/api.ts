import axios from 'axios';

const baseURL = import.meta.env.DEV ? 'http://localhost:8001' : '/api';

export const api = axios.create({ baseURL });

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}${normalized}`;
}
