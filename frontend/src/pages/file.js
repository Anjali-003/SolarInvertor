// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// // Configuration
// const PORT = 3003;
// // Replace 'example.pdf' with your actual filename on the server
// const FILE_NAME = 'example.pdf'; 

// const server = http.createServer((req, reqResponse) => {
//     // Resolve the absolute path of the file on the server
//     const filePath = path.join(__dirname, FILE_NAME);

//     // Check if the file exists before trying to read it
//     fs.stat(filePath, (err, stats) => {
//         if (err || !stats.isFile()) {
//             reqResponse.writeHead(404, { 'Content-Type': 'text/plain' });
//             reqResponse.end('404 Not Found: The requested file does not exist on the server.');
//             return;
//         }

//         // Set headers so the laptop browser knows it is receiving a file download
//         reqResponse.writeHead(200, {
//             'Content-Type': 'application/octet-stream', // Generic binary file type
//             'Content-Length': stats.size,
//             'Content-Disposition': `attachment; filename="${FILE_NAME}"` // Forces browser download
//         });

//         // Create a readable stream and pipe it directly to the network response
//         const fileStream = fs.createReadStream(filePath);
//         fileStream.pipe(reqResponse);
//     });
// });

// // Start the server
// server.listen(PORT, () => {
//     console.log(`Server is running! Download your file at: http://<YOUR_SERVER_IP>:${PORT}`);
// });


























// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const PORT = 3003;
// const FILE_NAME = 'addmisionformofsiddu.pdf';

// const server = http.createServer((req, res) => {
//     const filePath = path.join(__dirname, FILE_NAME);

//     fs.stat(filePath, (err, stats) => {
//         if (err || !stats.isFile()) {
//             res.writeHead(404, {
//                 'Content-Type': 'text/plain'
//             });

//             res.end('404 Not Found');
//             return;
//         }

//         res.writeHead(200, {
//             'Content-Type': 'application/pdf',
//             'Content-Length': stats.size,
//             'Content-Disposition': `attachment; filename="${FILE_NAME}"`
//         });

//         const fileStream = fs.createReadStream(filePath);

//         fileStream.on('error', (err) => {
//             console.error('File stream error:', err);

//             if (!res.headersSent) {
//                 res.writeHead(500);
//             }

//             res.end();
//         });

//         fileStream.pipe(res);
//     });
// });

// server.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on port ${PORT}`);
// });