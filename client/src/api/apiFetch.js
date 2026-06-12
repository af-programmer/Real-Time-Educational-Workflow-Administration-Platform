import useAuthStore from '../store/authStore';

const BASE_URL = '/api';
const DEFAULT_TIMEOUT = 30000;

async function request(method, url, { data, params, headers = {}, responseType, timeout = DEFAULT_TIMEOUT } = {}) {
  const token = useAuthStore.getState().token;

  let fullUrl = BASE_URL + url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) {
        if (Array.isArray(v)) {
          v.forEach((item) => searchParams.append(k, item));
        } else {
          searchParams.set(k, String(v));
        }
      }
    });
    const qs = searchParams.toString();
    if (qs) fullUrl += '?' + qs;
  }

  const reqHeaders = { ...headers };
  if (token) reqHeaders['Authorization'] = `Bearer ${token}`;

  let body;
  if (data instanceof FormData) {
    delete reqHeaders['Content-Type'];
    body = data;
  } else if (data !== undefined) {
    body = JSON.stringify(data);
    if (!reqHeaders['Content-Type']) reqHeaders['Content-Type'] = 'application/json';
  }

  const controller = new AbortController();
  let timeoutId;
  if (timeout > 0) {
    timeoutId = setTimeout(() => controller.abort(), timeout);
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: reqHeaders,
      body,
      signal: timeout > 0 ? controller.signal : undefined,
    });

    let responseData;
    if (responseType === 'blob') {
      responseData = await response.blob();
    } else if (responseType === 'arraybuffer') {
      responseData = await response.arrayBuffer();
    } else {
      const ct = response.headers.get('content-type') || '';
      responseData = ct.includes('application/json') ? await response.json() : await response.text();
    }

    if (!response.ok) {
      if (response.status === 401 && !url.includes('/auth/login')) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      const err = new Error(responseData?.message || `HTTP Error ${response.status}`);
      err.status = response.status;
      err.data = responseData;
      throw err;
    }

    return { data: responseData };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

const apiFetch = {
  get: (url, options = {}) => request('GET', url, options),
  post: (url, data, options = {}) => request('POST', url, { ...options, data }),
  put: (url, data, options = {}) => request('PUT', url, { ...options, data }),
  patch: (url, data, options = {}) => request('PATCH', url, { ...options, data }),
  delete: (url, options = {}) => request('DELETE', url, options),
};

export default apiFetch;
