const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    let code;
    try {
      const data = await res.json();
      message = data.error || message;
      code = data.code;
    } catch {
      // response had no JSON body
    }
    const error = new Error(message);
    error.status = res.status;
    error.code = code;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getMe: (token) => request('/me', { token }),
  getChild: (token) => request('/child', { token }),
  saveChild: (token, data) => request('/child', { method: 'PUT', token, body: data }),

  listStories: (token, { bookmarked } = {}) =>
    request(`/stories${bookmarked ? '?bookmarked=true' : ''}`, { token }),
  getStory: (token, id) => request(`/stories/${id}`, { token }),
  generateStory: (token, payload) =>
    request('/stories/generate', { method: 'POST', token, body: payload }),
  continueStory: (token, id) => request(`/stories/${id}/continue`, { method: 'POST', token }),
  toggleBookmark: (token, id, bookmarked) =>
    request(`/stories/${id}`, { method: 'PATCH', token, body: { bookmarked } }),

  getBillingStatus: (token) => request('/billing/status', { token }),
  createCheckout: (token, plan) =>
    request('/billing/checkout', { method: 'POST', token, body: { plan } }),
  simulateSubscribe: (token, plan) =>
    request('/billing/simulate', { method: 'POST', token, body: { plan } }),

  submitFeedback: (token, message) =>
    request('/feedback', { method: 'POST', token, body: { message } }),
};
