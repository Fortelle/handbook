var get = function( bang = true ) {
	var hash = window.location.hash.substring(3);
	return Number.isInteger(hash) ? parseInt( hash, 10 ) : hash;
};
	
var set = function( val, bang = true ) {
	if ( get(bang) != val ) {
		window.location.hash = '#' + ( bang?'!/':'') + val;
	}
};

var popstate = function( func ){
	window.addEventListener("popstate", func);
};

export default {
	get,
	set,
	popstate,
}