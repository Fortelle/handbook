import hook from './hook.js';
import config from './config.js';

/*
let main = {
};
*/

function using (arr,callback){
  $('.c-loading').attr('class', 'c-loading c-loading--step-3');
  let gkey = `/${config.get( 'gameKey')}/`;
  Promise
    .all(arr.map(x=>import(x.replace('./',gkey))))
    .then(x=>callback(x.map(y=>y.default)));
}

function load (...args){
  $('.c-loading').attr('class', 'c-loading c-loading--step-3');
  Promise
    .all(args.map(x=>import(`../modules/${x}.js`)))
    .then(()=>hook.keepAlive('load'));
}

hook.on( 'load', function(){
  $('.c-loading').attr('class', 'c-loading c-loading--step-4');
});

export default {
  using,
  load,
}