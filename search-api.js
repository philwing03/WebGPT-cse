console.log('search-api');


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


window.addEventListener("DOMContentLoaded", (event) => {


  addEventListener("message", async (event) => {
    if (!event.data.includes('search-api')) return;
    console.log(event);

    let backoff = 100;
    while (!document.querySelector('input[name="search"]')) {
      await sleep(backoff);
      backoff = backoff * 1.1;

    }
    document.querySelector('a[title="Clear search box"]').click();
    let req = event.data.split('search-api');
    document.querySelector('input[name="search"]').value = req[1];

    document.querySelector('button.gsc-search-button').click();

    if (document.querySelector('a.gs-title')) {
      let href = document.querySelector('a.gs-title').href;
      let backoff = 100;
      let countBackOff = 0;
      backoff = 100;
      while ((document.querySelector('a.gs-title').href == href) && (countBackOff < 100)) {
        await sleep(backoff);
        backoff = backoff * 1.1;
        countBackOff++;
      }
    } else {
      let countBackOff = 0;
      let backoff = 100;
      while ((document.querySelectorAll('a.gs-title').length < 2) && (!document.querySelector('.gse-loading-fade')) && (countBackOff < 100)) {
        await sleep(backoff);
        if (document.querySelector('.gs-no-results-result')) {
          document.querySelector('input[name="search"]').value = document.querySelector('input[name="search"]').value.replaceAll('"', '');
          document.querySelector('button.gsc-search-button').click();
        }
        backoff = backoff * 1.1;
        countBackOff++;
      }

    }
    console.log(document.querySelectorAll('a').length);

    let links = document.querySelectorAll('a.gs-title');
    if (links.length < 2) { links = document.querySelectorAll('a'); }
    const links_length = links.length;
    let linkURLs = [];
    for (let i = 0; i < links_length; i++) {
      let url = links[i].href.toString();
      if ((url.length > 1) && (linkURLs.indexOf(url) == -1)) {
        linkURLs.push(url);
      }
    }


    if (window != window.top) {
      document.querySelector('a[title="Clear search box"]').click();
      window.parent.postMessage(req[0] + 'search-api-result' + JSON.stringify(linkURLs), '*');

    }



  });

  if (window != window.top) {
    window.parent.postMessage('search-api-weblet-ready', '*');
  }

});