export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load | Rare Signs Apparel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <style>
      :root { color-scheme: dark; }
      body { font: 15px/1.6 system-ui, -apple-system, sans-serif; background: #0a0a0a; color: #f5f5f4; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
      .card { max-width: 28rem; width: 100%; padding: 2rem 1rem; }
      .logo { height: 56px; width: auto; margin-bottom: 1.5rem; }
      .eyebrow { color: #a3e635; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 0.75rem; }
      h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 0.75rem; }
      p { color: #a1a1aa; margin: 0 0 1.75rem; }
      .actions { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.65rem 1.25rem; border-radius: 0.4rem; font: inherit; font-size: 0.875rem; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: transform 0.2s ease, background 0.2s ease; }
      .primary { background: #a3e635; color: #0a0a0a; }
      .primary:hover { transform: translateY(-2px); }
      .secondary { background: transparent; color: #f5f5f4; border-color: #3f3f46; }
      .secondary:hover { background: #18181b; }
      .wa { display: inline-block; margin-top: 1.25rem; color: #a1a1aa; font-size: 0.85rem; font-weight: 500; text-decoration: none; }
      .wa:hover { color: #f5f5f4; text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="card">
      <img class="logo" src="/brand/rare-signs-mark.png" alt="Rare Signs Apparel" />
      <p class="eyebrow">Something went wrong</p>
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. Try again in a moment, or reach us on WhatsApp and we'll help you directly.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
      <a class="wa" href="https://wa.me/923337408106?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20custom%20sportswear%20order.">Chat with us on WhatsApp</a>
    </div>
  </body>
</html>`;
}
