let funcPool = {};
let alivePool = {};

const on = function ( name, func ) {
	if ( name in alivePool ) {
		func();
	} else {
		if ( ! ( name in funcPool ) ) funcPool[name] = [];
		funcPool[name].push( func );
	}
};

const trigger = function ( name ) {
	if ( name in funcPool ) {
		var l = funcPool[name]
		delete funcPool[name];
		return l;
	}
};

const keepAlive = function ( name ) {
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