let test=document.createElement('script');
test.src='https://WebGPT-cse.servleteer.repl.co/search-parent.js';
test.onload = async function(){

await searchAPIWebletReady.promise;
let list=await searchAPISend('donkey');
const list_length=list.length;
  for(let i=0;i<list_length;i++){
let txt = await (await fetch('https://WebGPT-cse.servleteer.repl.co/webscraper?'+encodeURIComponent(list[i]))).text();
    console.log(txt);
  }

}
  
document.body.appendChild(test);