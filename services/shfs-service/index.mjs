import http from 'node:http';

const HOST = process.env.SHFS_HOST ?? '127.0.0.1';
const PORT = Number(process.env.SHFS_PORT ?? 6868);

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    const body = JSON.stringify({
      service: 'shfs',
      version: '1.0.0-foundation',
      port: PORT,
      state: 'READY',
      integrity: 'UNVERIFIED'
    });
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(body);
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`SHFS service listening on http://${HOST}:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`SHFS received ${signal}; shutting down`);
  server.close(() => process.exit(0));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
