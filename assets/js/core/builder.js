import data from './data.js';

let createFunctions = {
  
  'type' : function( name ) {
    if ( Number.isInteger(name) ) name = data.typenames[name];
    return `<span class="o-badge o-badge--type t-type--${name}">${name}</span>`;
  },
  
}

let create = function( key, ...args) {
  key = key.toLowerCase();
  if ( key in createFunctions ) {
    return createFunctions[key].apply(null, args);
  } else {
    return '[err]';
  }
};

export default {
	create,
}