import hook from './core/hook.js';
import util from './core/util.js';
import sprite from './core/sprite.js';
import url from './core/url.js';
import content from './core/content.js';
import config from './core/config.js';
import loader from './core/loader.js';
import data from './core/data.js';


window.pmBase = {
  config,
  content,
  data,
  hook,
  loader,
  sprite,
  text: {},
  url,
  util,
};


/********** init ***********/

if (pageInfo.isGame) {
  config.set('isGame', true);
  config.set('gameKey', pageInfo.gameKey);
  config.set('gameName', pageInfo.gameName);
}

sprite.add('type7', {
  url: '/assets/images/types7.min.png',
  width: 48,
  height: 48,
  col: 1,
});

window.onload = function () {
  document.documentElement.className = document.documentElement.className.replace('js-loading', 'js-loaded');
  hook.keepAlive('init');
};

window.debug = function (obj) {
  console.log(JSON.stringify(obj));
};

pmBase.error = function (msg) {
  console.log(msg);
  document.documentElement.className += ' js-break';
};