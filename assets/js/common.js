import hook from './core/hook.js';
import util from './core/util.js';
//import data from './core/data.js';
import sprite from './core/sprite.js';
import url from './core/url.js';
import content from './core/content.js';
import config from './core/config.js';
import text from './core/text.js';

let loader = {
  using : function (arr,callback){
    let gkey = `/${config.get( 'gameKey')}/`;
    Promise.all(arr.map(x=>import(x.replace('./',gkey)))).then(x=>callback(x.map(y=>y.default)));
  }
};

window.pmBase = {
  config,
  hook,
  content,
  sprite,
  url,
  util,
  loader,
  text,
};


/********** init ***********/

if ( pageInfo.isGame ) {
  config.set( 'isGame', true );
  config.set( 'gameKey', pageInfo.gameKey ); //location.pathname.split('/')[1]
  config.set( 'gameName', pageInfo.gameName );
}


sprite.add( 'type7', {
	url : '/assets/images/types7.min.png',
	width: 48,
	height: 48,
	col: 1,
});

window.onload = function() {
  hook.keepAlive('init');
};

window.debug = function( obj ) {
  console.log( JSON.stringify(obj) );
};
