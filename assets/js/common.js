import hook from './core/hook.js';
import util from './core/util.js';
//import data from './core/data.js';
import sprite from './core/sprite.js';
import url from './core/url.js';
import content from './core/content.js';
import config from './core/config.js';
import loader from './core/loader.js';


window.pmBase = {
  config,
  hook,
  content,
  sprite,
  url,
  util,
  loader,
  text:{},
};


/********** init ***********/

if ( pageInfo.isGame ) {
  config.set( 'isGame', true );
  config.set( 'gameKey', pageInfo.gameKey );
  config.set( 'gameName', pageInfo.gameName );
}

sprite.add( 'type7', {
	url : '/assets/images/types7.min.png',
	width: 48,
	height: 48,
	col: 1,
});

window.onload = function() {
  document.documentElement.className = document.documentElement.className.replace('js-loading','js-loaded');
  $('.c-loading').attr('class', 'c-loading c-loading--step-3');
  hook.keepAlive('init');
};

window.onerror = function() {
  setTimeout(function() {  $('.c-loading').attr('class', 'c-loading c-loading--step-9');}, 1000);
};

window.debug = function( obj ) {
  console.log( JSON.stringify(obj) );
};
