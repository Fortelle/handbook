var arr2obj = function( arr, names, func ) {
	for ( var i in arr ) {
		var obj = { index: i };
		var a = arr[i];
		for ( var j in names ) {
			obj[names[j]] = a[j];
		}
		if ( func ) obj = func( i, obj );
		arr[i] = obj;
	}
};

var getPokemonKey = function ( dexNumber, formIndex ) {
	if ( dexNumber.length == 6 ) {
		return dexNumber;
	} else {
		formIndex = formIndex || 0;
		dexNumber = String('00').concat(dexNumber).slice(-3);
		formIndex = String('00').concat(formIndex).slice(-2);
		return dexNumber + "." + formIndex;
	}
};
		
var getPokemonName = function ( key, format ) {
	format = format || '{0}（{1}）';
	if ( key.length == 6 ) {
		var name = "", formname = "", fullname = "";
		name = pmBase.data.pokemonnames[parseInt(key.split('.')[0],10)];
		/*
		if ( key in pokeWiki.database.pokemon.forms[lang] ) {
			var form = pokeWiki.database.pokemon.forms[lang][key];
			if ( Array.isArray(form) ) {
				formname = form[0];
				format = form[1];
			} else {
				formname = form;
			}
			if ( !formname ) {
				fullname = name;
			} else if ( formname.indexOf(name) > -1 ) {
				fullname = formname;
			} else {
				fullname = format.replace('{0}',name).replace('{1}',formname);
			}
		} else {
			fullname = name;
		}*/
		return {
			name: name,
			form: formname,
			fullname: fullname
		};
	} else {
		return pmBase.data.pokemonnames[parseInt(key,10)];
	}
};

export default {
	arr2obj,
	getPokemonKey,
	getPokemonName,
}