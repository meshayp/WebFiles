const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const url = require('url');

const server = http.createServer((req, res) => {
    

    console.log(`request`);

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    //res.writeHead(200, {'Content-Type': 'text/html'});

    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);

    if (queryObject.dir)
    {
        console.log(queryObject.dir);

        const directories = fs.readdirSync(queryObject.dir, {withFileTypes: true}).filter(c => c.isDirectory()).map(i => i.name);

        const files = fs.readdirSync(queryObject.dir, {withFileTypes: true}).filter(c => !c.isDirectory()).map(i => ({ 'name' : i.name, 'stat' : null }));

        let obj = { files : files, dirs : directories, base : queryObject.dir};

        console.log(obj);

        //res.write( JSON.stringify(obj) );
        //res.write( obj );

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
    }
    
    if (queryObject.file)
    {
        let extName = path.extname(queryObject.file);
        let contentType = 'text/html';

        switch (extName) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
        }

        console.log(`File path: ${queryObject.file}`);
        console.log(`Content-Type: ${contentType}`)

        res.writeHead(200, {'Content-Type': contentType});

        const readStream = fs.createReadStream(queryObject.file);
        readStream.pipe(res);
    }
	
	if (queryObject.fileInfo)
    {
		let info = fs.statSync(queryObject.fileInfo);
		
		console.log(info);
		
		res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(info));
	}
});

server.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.log(`Error: ${err}`)
    } else {
        console.log(`Server listening at port ${port}...`);
    }
});