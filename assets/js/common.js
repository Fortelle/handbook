import hook from './core/hook.js';
import util from './core/util.js';
import data from './core/data.js';
import sprite from './core/sprite.js';
import url from './core/url.js';
import page from './core/page.js';
import config from './core/config.js';

const debug = {
	log : function(obj){
		console.log( JSON.stringify(obj) );
	},
	alert : function(obj){
		alert( JSON.stringify(obj) );
	},
};

let extension = {};

window.pmBase = {
  hook,
  util,
  data,
  sprite,
  debug,
  url,
  page,
  extension,
  config
};


/********** init ***********/

if ( pageInfo.isGame ) {
  config.set( 'isGame', true );
  config.set( 'gameKey', pageInfo.gameKey ); //location.pathname.split('/')[1]
  config.set( 'gameName', pageInfo.gameName );
  //document.title = pageInfo.gameName + siteInfo.separater + siteInfo.title;
}

window.onload = function() {
  hook.keepAlive('init');
};

window.debug = debug.log;