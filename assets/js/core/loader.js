import hook from './hook.js';
import config from './config.js';

function toAbsoluteURL(url) {
  const a = document.createElement("a");
  a.setAttribute("href", url);    // <a href="hoge.html">
  return a.cloneNode(false).href; // -> "http://example.com/hoge.html"
}
  
export function importModule(url) {
  return new Promise((resolve, reject) => {
    const vector = "$importModule$" + Math.random().toString(32).slice(2);
    const script = document.createElement("script");
    const destructor = () => {
      delete window[vector];
      script.onerror = null;
      script.onload = null;
      script.remove();
      URL.revokeObjectURL(script.src);
      script.src = "";
    };
    script.defer = "defer";
    script.type = "module";
    script.onerror = () => {
      reject(new Error(`Failed to import: ${url}`));
      destructor();
    };
    script.onload = () => {
      resolve(window[vector]);
      destructor();
    };
    const absURL = toAbsoluteURL(url);
    const loader = `import * as m from "${absURL}"; window.${vector} = m;`; // export Module
    const blob = new Blob([loader], { type: "text/javascript" });
    script.src = URL.createObjectURL(blob);

    document.head.appendChild(script);
  });
}

function using(arr,callback) {
  let gkey = `/${config.get( 'gameKey')}/`;
  let url = arr.map( x=>x.replace('./',gkey));
  debug(url);
  if ( url.length == 1 ) {
    importModule(url[0]).then( a => {
      callback([a.default]);
    });
  } else if ( url.length == 2 ) {
    importModule(url[0]).then( a => {
      importModule(url[1]).then( b => {
        callback([a.default,b.default]);
      });
    });
  }
}

function load (...args){
  $('.c-loading').attr('class', 'c-loading c-loading--step-3');
  let url = args.map( x=>`/assets/js/modules/${x}.js`);

  if ( url.length == 1 ) {
    importModule(url[0]).then( () => {
      hook.keepAlive('load');
    });
  } else if ( url.length == 2 ) {
    importModule(url[0]).then( () => {
      importModule(url[1]).then( () => {
        hook.keepAlive('load');
      });
    });
  }

}

function getJson(urls, callback, cache = true){
  var requests = urls.map( path => $.getJSON(path) );
  $.when.apply($, requests).then(function(){
    let ret = $.map(arguments, x => x);
    callback(...ret);
  });
}

hook.on( 'load', function(){
  $('.c-loading').attr('class', 'c-loading c-loading--step-4');
});

export default {
  using,
  load,
  getJson,
}