// Replaces window.fetch with a tiny fake server keyed by "METHOD url".
// Unknown routes return 404, just like the real API.
export function mockFetch(routes) {
  const fetchMock = vi.fn(async (url, options = {}) => {
    const method = options.method ?? "GET";
    const handler = routes[`${method} ${url}`];

    if (!handler) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    const { status = 200, body } = handler(options);
    return new Response(JSON.stringify(body), { status });
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
