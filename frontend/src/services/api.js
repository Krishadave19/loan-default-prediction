import { API_BASE_URL } from '../utils/constants';

async function request(path, options = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      let message = body.detail || body.message || `Request failed with status ${response.status}`;
      if (Array.isArray(body.detail)) {
        message = body.detail
          .map((item) => {
            const field = item.loc ? item.loc[item.loc.length - 1] : 'field';
            return `${field}: ${item.msg}`;
          })
          .join('; ');
      }
      throw new Error(message);
    }

    return response.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Unable to connect to backend at ${API_BASE_URL}. Ensure the FastAPI server is running.`
      );
    }
    throw err;
  }
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
};

