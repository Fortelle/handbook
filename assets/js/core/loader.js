import hook from './hook.js';
import config from './config.js';

/*
let main = {
};
*/

function using (arr,callback){
  let gkey = `/${config.get( 'gameKey')}/`;
  Promise
    .all(arr.map(x=>import(x.replace('./',gkey))))
    .then(x=>callback(x.map(y=>y.default)));
}

function load (...args){
  Promise
    .all(args.map(x=>import(`../modules/${x}.js`)))
    .then(()=>hook.keepAlive('load'));
}

export default {
  using,
  load,
}