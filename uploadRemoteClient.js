const fs = require('fs');
const http = require('http');

const path = process.argv[2];
if (!fs.existsSync(path)) process.exit();

const post_data = fs.readFileSync(path).toString();
const post_options = {
    host: '108.4.212.129',
    port: '8000',
    path: '/remote',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(post_data)
    }
};

const post_req = http.request(post_options, res => {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
    });
});

post_req.write(post_data);
post_req.end();
