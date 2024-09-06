import http from 'http';

const heartEmoji = String.fromCodePoint(0x2764); // Unicode code point for the heart emoji

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8"); // Specify UTF-8 encoding
  res.end("Hello Monika\nMade with ❤️ from Aibuzzz....");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});