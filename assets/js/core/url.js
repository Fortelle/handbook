import config from './config.js';
import content from './content.js';

let oldHash;

const getHash = function() {
  let hash = window.location.hash;
  if ( hash.startsWith('#!/') ) {
    return hash.slice(3);
  } else if ( hash.startsWith('#?') ) {
    return hash.slice(2).split('&').map(x=>x.split('='));
  } else {
    return '';
  }
};

const setHash = function( hash ) {
  if ( hash !== oldHash ) {
    window.location.hash = createHashPart(hash);
    oldHash = hash;
  }
};

const getHref = function ( ...args ) {
  if ( args.length === 0 ) {
    return `#`;
  } else if ( args.length === 1 ) {
    return createHashPart(args[0]);
  } else if ( args.length === 2 ) {
    return `/${config.get('gameKey')}/${args[0]}#!/${createHashPart(args[1])}`;
  }
};

const createHashPart = function( obj ) {
  if ( typeof obj === 'object' ) {
    let search = Object.entries(obj).map( x => `${x[0]}=${x[1]}`).join('&');
    return `#?` + search;
  } else {
    return `#!/` + obj;
  }
};

/*******************/

let pageMode, callback, selector;

const listen = function ( _callback, _selector = '.p-selector' ) {
  pageMode = pageInfo.pageMode;
  callback = _callback;
  selector = _selector;
  onHashChange();
  window.addEventListener("hashchange", onHashChange);
	$(selector).change( function(){ setHash(this.value); });
};

const onHashChange = function (){
	let key = getHash();
	if ( key.length > 0 ) {
	  let success = callback(key);
	  if ( success ) {
      $(selector).val(key);
      if ( pageMode == 2 ) {
  	    window.scrollTo(0, 0);
  	    content.changeTab(1);
      }
	    return true;
	  }
	} else {
	  if ( pageMode == 2 ) content.changeTab(0);
	}
	return false;
};

/*******************/

export default {
  getHash,
  setHash,
  getHref,
  listen,
}