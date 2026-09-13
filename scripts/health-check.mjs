import http from 'node:http';

const port = Number(process.env.SHFS_PORT ?? 6868);
const req = http.get({ host: '127.0.0.1', port, path: '/health', timeout: 3000 }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    process.stdout.write(data + '\n');
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});
req.on('timeout', () => req.destroy(new Error('timeout')));
req.on('error', (err) => { console.error(`SHFS health check failed: ${err.message}`); process.exit(1); });
