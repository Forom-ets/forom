import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// =============================================================================
// SUPERMOD CONFIG PLUGIN
// Dev-only plugin that writes supermoderator settings back to forom-config.ts
// so changes are permanently baked into the source and every future build.
// =============================================================================

function generateConfigContent(
  categoryLabels: Record<string, string>,
  questionLabels: Record<string, string>,
): string {
  const catLines = Object.entries(categoryLabels)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
    .join('\n')
  const qLines = Object.entries(questionLabels)
    .map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`)
    .join('\n')
  return `// =============================================================================
// FOROM CONFIGURATION — Managed by the supermoderator via the Settings panel.
// Run the dev server as 'xylo', open Settings, and click Save to update these
// values permanently. They are baked into every build of this project, so any
// user who downloads and runs it will see the supermoderator's configuration.
// =============================================================================

export const DEFAULT_CATEGORY_LABELS: Record<string, string> = {
${catLines}
}

export const DEFAULT_QUESTION_LABELS: Record<string, string> = {
${qLines}
}
`
}

function supermodConfigPlugin(): Plugin {
  return {
    name: 'supermod-config',
    apply: 'serve', // development only — never runs in production builds
    configureServer(server) {
      server.middlewares.use('/api/config/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body) as unknown
            if (
              typeof parsed !== 'object' || parsed === null ||
              !('categoryLabels' in parsed) || !('questionLabels' in parsed)
            ) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'Invalid payload shape' }))
              return
            }

            const { categoryLabels, questionLabels } = parsed as {
              categoryLabels: Record<string, string>
              questionLabels: Record<string, string>
            }

            // Only allow single uppercase letter keys (A-J) or digit keys (0-9).
            // Values must be strings of at most 100 characters.
            const allValues = Object.values({ ...categoryLabels, ...questionLabels })
            if (
              Object.keys(categoryLabels).some(k => !/^[A-J]$/.test(k)) ||
              Object.keys(questionLabels).some(k => !/^[0-9]$/.test(k)) ||
              allValues.some(v => typeof v !== 'string' || v.length > 100)
            ) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'Invalid key or value' }))
              return
            }

            const configPath = path.resolve(__dirname, 'src/data/forom-config.ts')
            fs.writeFileSync(configPath, generateConfigContent(categoryLabels, questionLabels), 'utf-8')

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: String(e) }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), supermodConfigPlugin()],
  server: {
    allowedHosts: ['forom.prodv2.cedille.club', 'forom.etsmtl.ca'],
  },
})
