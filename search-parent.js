globalThis.searchAPIMap = {};
globalThis.searchAPIWebletReady = {};
searchAPIWebletReady.promise = new Promise((resolve) => {
  searchAPIWebletReady.resolve = resolve;
});


addEventListener("message", (event) => {
  if (!event.data.includes('search-api')) return;

  if (event.data.includes('search-api-weblet-ready')) {

    globalThis.searchAPISend = async function(txt) {
      await searchAPIWebletReady.promise;
      let searchID = 'searchID' + new Date().getTime();
      searchAPIMap[searchID] = {};
      searchAPIMap[searchID].promise = new Promise((resolve) => {
        searchAPIMap[searchID].resolve = resolve;
      });
      document.getElementById('search-api').contentWindow.postMessage(searchID + 'search-api' + txt, '*');
      return await searchAPIMap[searchID].promise;
    }
    searchAPIWebletReady.resolve();

  }

  if (event.data.includes('search-api-result')) {
    let res = event.data.split('search-api-result');
    let URLlist = JSON.parse(res[1]);
    searchAPIMap[res[0]].resolve(URLlist);
    console.log(URLlist);
  }



});
let searchAPI = document.createElement('iframe');
searchAPI.id = 'search-api';
searchAPI.src = 'https://webgpt-cse.servleteer.repl.co/cse?cx=7f6418896a2455016';
searchAPI.style.visibility = 'hidden';
searchAPI.style.opacity = '0';
searchAPI.style.maxHeight = '0px';
searchAPI.style.height = '0px';
searchAPI.style.transform = 'scale(0,0)';
searchAPI.style.position = 'absolute';
searchAPI.style.zIndex = '-99';
document.body.appendChild(searchAPI);
