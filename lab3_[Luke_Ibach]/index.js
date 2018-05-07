'use strict';

const Hapi=require('hapi');
const vision=require('vision');

const https = require('https');
//trivai url, to change the amount of questions delivered, just change the number on the und of the url
const url = "https://opentdb.com/api.php?amount=40&type=multiple"

// Create a server with a host and port
const server=Hapi.server({
    host: 'localhost',
    port:8000
});

// Add the index.html route

https.get(url, res => {
    res.setEncoding("UTF-8");
    let body = "";
    res.on("data", data => {
        body += data;        
    });
    var n;

    var data = res.on("end", () => {
        //This statement gets rid of all the unwanted character references globally.
        n = body.replace(/&quot;|&#039;|&amp;|&shy;|&eacute;|&lsquo;|&rsquo;|&Uuml;|&oacute;|&scaron;|&atilde;/g,"");
        body = n;
        //after all of the unwanted character references have been remove, put the string in json format.
        body = JSON.parse(body);

        server.route({
            
            method: 'GET',
            path: '/',
            handler: function(req,h) {
                return h.view('index', {dataOutput : body});
            }
        });

        server.route({

            method: 'GET',
            path: '/content',
            handler: function(req,h) {
                return h.view('content', {dataOutput : body});
            }
        });
    });

});


// Start the server
async function start() {

    await server.register(vision);

    server.views({
        engines: {
            html: require('handlebars')

        },
        relativeTo: __dirname
    })

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at: ', server.info.uri);
};

start();






