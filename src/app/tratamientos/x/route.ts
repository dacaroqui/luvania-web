const body = "Esta página se retiró. Era una ficha vacía, sin un tratamiento.";

export function GET() {
  return new Response(body, {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

export function HEAD() {
  return new Response(null, { status: 410, headers: { "x-robots-tag": "noindex" } });
}
