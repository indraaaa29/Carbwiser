const http = require('http'), fs = require('fs'), path = require('path'), https = require('https');

http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  
  if (url === '/api/recommend' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c).on('end', () => {
      const apiKey = process.env.ANTHROPIC_API_KEY || req.headers['x-api-key'] || '';
      const apiReq = https.request('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }, apiRes => {
        res.writeHead(apiRes.statusCode, apiRes.headers);
        apiRes.pipe(res);
      });
      apiReq.on('error', e => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      });
      apiReq.write(body);
      apiReq.end();
    });
  } else {
    const filePath = path.join(__dirname, 'dist', url.split('?')[0]);
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        const fallback = path.join(__dirname, 'dist', 'index.html');
        fs.stat(fallback, (fErr) => {
          if (fErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found. Please build the project first.');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            fs.createReadStream(fallback).pipe(res);
          }
        });
      } else {
        const ext = path.extname(filePath);
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.svg': 'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      }
    });
  }
}).listen(3000, () => console.log('CarbWiser production server running at http://localhost:3000'));
