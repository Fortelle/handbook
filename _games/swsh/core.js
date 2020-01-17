let init = function () {
  pmBase.data.add('pi8index', '/swsh/data/piindex.json');
  
  pmBase.data.load(()=>{
    pmBase.sprite.add( 'pi8', {
      url : '/swsh/images/pi.png',
      width: 68,
      height:56,
      col: 30,
      crop: [10, 16, 40, 40],
      keys: pmBase.data.get('pi8index'),
    });
    pmBase.sprite.add( 'type', {
      url : '/swsh/images/types.png',
      width: 64,
      height: 64,
      col: 1
    });
  });
  
  pmBase.loader.load('pmcommon');

  pmBase.hook.on( 'load', ()=>{
    pmCommon.Config.formLength = 3;
  } );
  
  //pmCommon.Config.formLength = 3;
};


pmBase.hook.on( 'init', init );

export default {
}