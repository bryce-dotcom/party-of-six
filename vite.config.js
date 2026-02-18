import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Claude API proxy plugin - forwards /api/plan-trip to Anthropic's API
// This keeps the API key server-side (never exposed to the browser)
function claudeApiProxy() {
  let apiKey = '';

  return {
    name: 'claude-api-proxy',
    configResolved(config) {
      // Load all env vars (not just VITE_ prefixed ones)
      const env = loadEnv(config.mode, process.cwd(), '');
      apiKey = env.ANTHROPIC_API_KEY || '';
    },
    configureServer(server) {
      server.middlewares.use('/api/plan-trip', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            error: 'ANTHROPIC_API_KEY not configured. Copy .env.example to .env and add your key.'
          }));
          return;
        }

        // Read request body
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 180000); // 3 min timeout

          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: body,
            signal: controller.signal,
          });
          clearTimeout(timeout);

          const data = await response.text();
          console.log('[Claude API] Status:', response.status);
          console.log('[Claude API] Response preview:', data.substring(0, 500));
          // Log the content block types and text lengths
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              parsed.content.forEach((block, i) => {
                if (block.type === 'text') {
                  console.log(`[Claude API] Block ${i}: text (${block.text.length} chars) - starts: "${block.text.substring(0, 100)}"`);
                } else {
                  console.log(`[Claude API] Block ${i}: ${block.type}${block.name ? ' (' + block.name + ')' : ''}`);
                }
              });
              console.log('[Claude API] stop_reason:', parsed.stop_reason);
            }
          } catch {};
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
        } catch (error) {
          console.error('[Claude API] Error:', error.message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.name === 'AbortError' ? 'Request timed out - try again' : error.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    claudeApiProxy(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Party of Six',
        short_name: 'PartyOf6',
        description: 'Plan adventures with your crew',
        theme_color: '#0D0D0D',
        background_color: '#0D0D0D',
        display: 'standalone',
      }
    })
  ],
});
