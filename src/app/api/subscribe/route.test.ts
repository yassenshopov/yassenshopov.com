import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();

async function callRoute(body: unknown) {
  const { POST } = await import('./route');
  const request = new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return POST(request);
}

beforeEach(() => {
  vi.resetModules();
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('POST /api/subscribe', () => {
  it('returns 400 for invalid JSON', async () => {
    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: 'not json',
    });
    const res = await POST(request);
    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid email', async () => {
    const res = await callRoute({ email: 'not-an-email' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/valid email/i);
  });

  it('silently accepts honeypot submissions without calling Kit', async () => {
    vi.stubEnv('KIT_API_KEY', 'test-key');
    const res = await callRoute({ email: 'bot@example.com', website: 'spam.com' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 503 when KIT_API_KEY is not set', async () => {
    vi.stubEnv('KIT_API_KEY', '');
    const res = await callRoute({ email: 'reader@example.com' });
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/not configured/i);
  });

  it('creates the subscriber and adds them to the form on success', async () => {
    vi.stubEnv('KIT_API_KEY', 'test-key');
    mockFetch.mockResolvedValue(new Response('{}', { status: 200 }));

    const res = await callRoute({ email: 'reader@example.com' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const [createUrl, createInit] = mockFetch.mock.calls[0];
    expect(createUrl).toBe('https://api.kit.com/v4/subscribers');
    expect(JSON.parse(createInit.body)).toEqual({
      email_address: 'reader@example.com',
      state: 'inactive',
    });

    const [formUrl, formInit] = mockFetch.mock.calls[1];
    expect(formUrl).toBe('https://api.kit.com/v4/forms/7879940/subscribers');
    expect(JSON.parse(formInit.body)).toEqual({ email_address: 'reader@example.com' });
  });

  it('returns 502 when creating the subscriber fails', async () => {
    vi.stubEnv('KIT_API_KEY', 'test-key');
    mockFetch.mockResolvedValue(new Response('{"errors":["nope"]}', { status: 401 }));

    const res = await callRoute({ email: 'reader@example.com' });
    expect(res.status).toBe(502);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('returns 502 when adding to the form fails', async () => {
    vi.stubEnv('KIT_API_KEY', 'test-key');
    mockFetch
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{"errors":["Not Found"]}', { status: 404 }));

    const res = await callRoute({ email: 'reader@example.com' });
    expect(res.status).toBe(502);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('returns 500 when Kit is unreachable', async () => {
    vi.stubEnv('KIT_API_KEY', 'test-key');
    mockFetch.mockRejectedValue(new Error('network failure'));

    const res = await callRoute({ email: 'reader@example.com' });
    expect(res.status).toBe(500);
  });
});
