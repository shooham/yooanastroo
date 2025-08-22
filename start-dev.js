#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting development servers...');

// Start Vercel dev server for API
const vercelDev = spawn('npx', ['vercel', 'dev', '--listen', '3001'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Wait a bit then start Vite
setTimeout(() => {
  console.log('🎯 Starting Vite dev server...');
  const viteDev = spawn('npm', ['run', 'dev:client'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    vercelDev.kill();
    viteDev.kill();
    process.exit();
  });
}, 3000);

vercelDev.on('error', (err) => {
  console.error('❌ Vercel dev server error:', err);
});