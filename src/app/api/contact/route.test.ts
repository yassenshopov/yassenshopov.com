import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSend = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = { send: mockSend };
    },
  };
});

async function callRoute(body: unknown) {
  const { POST } = await import('./route');
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(request);
}

const validPayload = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'Hello, this is a test message for the contact form.',
  topic: 'collab',
  company: '',
};

beforeEach(() => {
  vi.resetModules();
  mockSend.mockReset();
});

describe('POST /api/contact', () => {
  it('returns 400 for invalid JSON', async () => {
    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: 'not json',
    });
    const res = await POST(request);
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const res = await callRoute({ ...validPayload, email: '' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 400 when message is too short', async () => {
    const res = await callRoute({ ...validPayload, message: 'Hi' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/too short/i);
  });

  it('silently accepts honeypot submissions (returns ok)', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    const res = await callRoute({ ...validPayload, company: 'SpamBot Inc' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockSend).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });

  it('returns 503 when RESEND_API_KEY is not set', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const res = await callRoute(validPayload);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/not configured/i);
    vi.unstubAllEnvs();
  });

  it('returns 200 on successful send', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    mockSend.mockResolvedValue({ error: null });
    const res = await callRoute(validPayload);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();
    vi.unstubAllEnvs();
  });

  it('returns 502 when Resend returns an error object', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    mockSend.mockResolvedValue({ error: { message: 'Invalid API key' } });
    const res = await callRoute(validPayload);
    expect(res.status).toBe(502);
    vi.unstubAllEnvs();
  });

  it('returns 500 when Resend throws', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    mockSend.mockRejectedValue(new Error('network failure'));
    const res = await callRoute(validPayload);
    expect(res.status).toBe(500);
    vi.unstubAllEnvs();
  });
});
