import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

function ensureZipFiles() {
  const codeZip = '/tmp/tdex-code-only.zip';
  const fullZip = '/tmp/tdex-source.zip';
  if (fs.existsSync(codeZip) && fs.existsSync(fullZip)) {
    return;
  }
  const pyScript = `
import zipfile, os
files = ["package.json", "index.html", "vite.config.ts", "tsconfig.json", "server.ts", "metadata.json", "firestore.rules", "firebase-blueprint.json", "security_spec.md", "WINDOWS_SETUP.md", ".env.example", ".gitignore"]
with zipfile.ZipFile("/tmp/tdex-code-only.zip", "w", zipfile.ZIP_DEFLATED) as zf:
    for f in files:
        if os.path.exists(f): zf.write(f, f)
    for folder in ["src", "scripts"]:
        if os.path.exists(folder):
            for root, _, filenames in os.walk(folder):
                for fn in filenames:
                    if not fn.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif")):
                        full = os.path.join(root, fn)
                        zf.write(full, full)
with zipfile.ZipFile("/tmp/tdex-source.zip", "w", zipfile.ZIP_DEFLATED) as zf:
    for f in files:
        if os.path.exists(f): zf.write(f, f)
    for folder in ["src", "scripts", "public"]:
        if os.path.exists(folder):
            for root, _, filenames in os.walk(folder):
                for fn in filenames:
                    full = os.path.join(root, fn)
                    zf.write(full, full)
`;
  execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`);
}

function downloadZipPlugin(): Plugin {
  return {
    name: 'download-zip-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const url = req.url.split('?')[0];

        let targetFile = '';
        let downloadName = '';

        if (url === '/download-code' || url === '/tdex-code-only.zip') {
          targetFile = '/tmp/tdex-code-only.zip';
          downloadName = 'tdex-code-for-chatgpt.zip';
        } else if (url === '/download-full' || url === '/tdex-project.zip' || url === '/tdex-source.zip') {
          targetFile = '/tmp/tdex-source.zip';
          downloadName = 'tdex-complete-project.zip';
        }

        if (targetFile) {
          try {
            ensureZipFiles();
          } catch (e) {
            console.error('Failed to build zip:', e);
          }
          if (fs.existsSync(targetFile)) {
            const stat = fs.statSync(targetFile);
            res.writeHead(200, {
              'Content-Type': 'application/zip',
              'Content-Disposition': `attachment; filename="${downloadName}"`,
              'Content-Length': stat.size,
              'Cache-Control': 'no-store',
            });
            fs.createReadStream(targetFile).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), downloadZipPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
