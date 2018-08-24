var funcPool = {};
var alivePool = {};

var on = function ( name, func ) {
	if ( name in alivePool ) {
		func();
	} else {
		if ( ! ( name in funcPool ) ) funcPool[name] = [];
		funcPool[name].push( func );
	}
};

var trigger = function ( name ) {
	if ( name in funcPool ) {
		var l = funcPool[name]
		delete funcPool[name];
		return l;
	}
};

var keepAlive = function ( name ) {
	if ( name in funcPool ) {
		funcPool[name].map( x => x() );
		delete funcPool[name];
	}
	alivePool[name] = true;
};

export default {
	on,
	trigger,
	keepAlive
}