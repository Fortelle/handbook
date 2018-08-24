let modules = {
};

let add = function ( key, url ) {
	modules[key] = url;
};

let get = function ( key, hashbang ) {
	return `${modules[key]}#!/${hashbang}`;
};

let createAnchor = function ( key, hashbang, text ) {
	return `<a href="${modules[key]}#!/${hashbang}">${text}</a>`;
};

/*******************/
var getHash = function( bang = true ) {
	var hash = window.location.hash.substring(3);
	return Number.isInteger(hash) ? parseInt( hash, 10 ) : hash;
};
	
var setHash = function( val, bang = true ) {
	if ( get(bang) != val ) {
		window.location.hash = '#' + ( bang?'!/':'') + val;
	}
};

var popstate = function( func ){
	window.addEventListener("popstate", func);
};
/*******************/

/*******************/
var getSearch = function( ) {
	let query = window.location.hash.substring(2);
  let searchParams = new URLSearchParams(query);
	return searchParams;
};
	
var setSearch = function( val ) {
	if ( get(bang) != val ) {
		window.location.hash = '#' + ( bang?'!/':'') + val;
	}
};

/*******************/

export default {
  add,
  get,
  createAnchor,
}