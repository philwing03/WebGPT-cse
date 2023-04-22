import fetch from 'node-fetch';
import http from 'http';
import addCorsHeaders from './cors-headers.mjs';
import fileFromRequest from './static-files.mjs';
import sleep from './sleep.mjs';
import { webscraper, wsPackage } from './webscraper.mjs';
//import wsPackage from './webscraper.mjs';

const hostTarget = 'cse.google.com';
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
//https://WebGPT-cse.servleteer.repl.co/cse?cx=7f6418896a2455016

let app = http.createServer(onRequest);

app.listen(3000);

async function onRequest(req, res) {
  try {
    if (req.url == '/ping') {
      res.statusCode = 200;
      return res.end();
    }

    let path = req.url.replaceAll('*', '');
    let pat = path.split('?')[0].split('#')[0];
    if (path.length < 4) {
      res.setHeader('location', 'https://WebGPT-cse.servleteer.repl.co/cse?cx=7f6418896a2455016');
      res.statusCode = 302;
      return res.end();
    }

    if (pat == '/search-api.js') {

      return fileFromRequest(req, res);

    }
    if (pat == '/search-parent.js') {

      return fileFromRequest(req, res);

    }
    if (pat == '/cse-wiki.css') {

      return fileFromRequest(req, res);

    }

    if (req.url.indexOf('/webscraper?') == 0) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.end(await wsPackage(req, res));

    }

    req.headers.host = hostTarget;
    req.headers.referer = hostTarget;


    let bdy = "";
    req.on('readable', function() {
      bdy += req.read();
    });
    req.on('end', async function() {
      /* finish reading the body of the request*/

      /* start copying over the other parts of the request */
      let options = {
        method: req.method,
        headers: req.headers
      };
      /* fetch throws an error if you send a body with a GET request even if it is empty */
      if ((req.method != 'GET') && (req.method != 'HEAD') && (bdy.length > 0)) {
        options = {
          method: req.method,
          headers: req.headers,
          body: bdy
        };
      }
      /* finish copying over the other parts of the request */


      try {
        /* fetch from your desired target */
        let response = await fetch('https://' + hostTarget + path, options);

        /* if there is a problem try redirecting to the original */
        if (response.status > 399) {
          res.setHeader('location', 'https://' + hostTarget + path);
          res.statusCode = 302;
          return res.end();
        }

        /* copy over response headers  */
        for (let [key, value] of response.headers.entries()) {
          res.setHeader(key, value);
        }
        for (let [key, value] of response.headers.keys()) {
          if (key.length > 1) {
            res.removeHeader(key);
            res.setHeader(key, value);
          }
        }

        res.removeHeader('content-encoding');
        res.removeHeader('content-length');
        res.setHeader('user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1');
        res = addCorsHeaders(res);
        /* check to see if the response is not a text format */
        let ct = response.headers.get('content-type');

        if ((ct) && (ct.indexOf('image') == -1) && (ct.indexOf('video') == -1) && (ct.indexOf('audio') == -1)) {


          /* Copy over target response and return */
          let resBody = await response.text();

          return res.end(resBody.replace('<head>', '<head><link rel="stylesheet" href="./cse-wiki.css"><script src="search-api.js"></script>'));


        } else {

          /* if not a text response then redirect straight to target */
          res.setHeader('location', 'https://' + hostTarget + path);
          res.statusCode = 301;
          return res.end();

        }
      } catch (e) {
        res.setHeader('location', 'https://' + hostTarget + path);
        res.statusCode = 301;
        return res.end();

      }
    });

  } catch (e) {
    res.statusCode = 500;
    res.end('500 ' + e.message);
  }
}

void async function automaticRestart() {

  while (true) {
    await sleep(MINUTE);
    if (!app.listening) {
      app.listen(3000);
    }

  }

}?.();