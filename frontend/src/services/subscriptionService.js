// frontend/src/services/subscriptionService.js

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get token
function getToken(passedToken) {
  if (passedToken) return passedToken;
  return localStorage.getItem("token");
}

export async function createPaymentIntent(payload) {
  const token = getToken();
  const res = await fetch(`${API}/subscriptions/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function createSubscription(payload) {
  const token = getToken();
  const res = await fetch(`${API}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Corrected function to check subscription status.
// Call: checkSubscription(testId, token?)
export async function checkSubscription(testId, passedToken) {
  const token = getToken(passedToken);
  const res = await fetch(`${API}/subscriptions/check-status/${testId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data; // expected { isSubscribed: true/false }
}