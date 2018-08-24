import hook from './core/hook.js';
import util from './core/util.js';
import data from './core/data.js';
import sprite from './core/sprite.js';
import hash from './core/hash.js';
import debug from './core/debug.js';
import builder from './core/builder.js';
import url from './core/url.js';

window.pmBase = {
	hook,
	util,
	data,
	sprite,
	hash,
	debug,
	builder,
	url,
};
	
window.onload = function() {
	hook.keepAlive('init');
};