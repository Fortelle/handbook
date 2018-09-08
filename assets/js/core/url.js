import config from './config.js';

const createUrlHash = function ( pagename, hashbang ) {
  if ( typeof hashbang !== 'undefined' ) {
    let gameKey = config.get( 'gameKey' );
    return `/${gameKey}/${pagename}#!/${hashbang}`;
  } else {
    return `#!/${pagename}`;
  }
};

const createUrlSearch = function ( key, label, value ) {
  if ( typeof label === 'object' ) {
    let search = Object.entries(label).map( x => `${x[0]}=${x[1]}`).join('&');
    return `${urlList[key]}#?${search}`;
  } else {
    return `${urlList[key]}#?${label}=${value}`;
  }
};

/*******************/

let currentHash;

const getHash = function( bang = true ) {
  currentHash = window.location.hash.slice(bang?3:1);
  //currentHash = Number.isInteger(hash) ? parseInt( hash, 10 ) : hash;
  return currentHash;
};

const setHash = function( val, bang = true ) {
  if ( val != currentHash ) {
    currentHash = val;
    window.location.hash = '#' + ( bang?'!/':'') + currentHash;
  }
};

const getSearch = function() {
  let queryString = window.location.hash.slice(2);
  let params = {};
  if ( queryString ) {
    queryString.split('&').forEach(function(x){
      let [key, val] = x.split('=');
      params[key] = val;
    });
  }
  return params;
};

const setSearch = function( params ) {
  let search = Object.entries(params).map( x => `${x[0]}=${x[1]}`).join('&')
  window.location.hash = '#?' + search;
};


/*******************/

const useBang = true;
let oldHash;

const getHash2 = function() {
  let hash = window.location.hash;
  if ( hash.startWith('#!/') ) {
    return hash.slice(useBang?3:1);
  } else if ( hash.startWith('?') ) {
    value = hash.slice(2).split('&').map(x=>x.split('='));
  } else {
    return '';
  }
};

const setHash2 = function( ...args ) {
  let hash = window.location.hash;
  if ( args.length === 1 && args[0] != oldHash ) {
    window.location.hash = '#' + ( useBang ? '!/' : '' ) + args[0];
    oldHash = args[0];
  } else if ( args.length === 2 ) {
    window.location.hash = '#?${args[0]}={args[1]}';
  }
};

const create = function ( ...args ) {
  if ( args.length === 0 ) {
    return `#`;
  } else if ( args.length === 1 ) {
    return `#!/${args[0]}`;
  } else if ( args.length === 2 ) {
    return `/${config.get('gameKey')}/${args[0]}#!/${args[1]}`;
  } else if ( args.length === 3 ) {
    return `/${config.get('gameKey')}/${args[0]}#?${args[1]}=${args[2]}`;
  }
};

/*******************/

export default {
  createUrlHash,
  createUrlSearch,
  getHash,
  setHash,
  getSearch,
  setSearch,
}