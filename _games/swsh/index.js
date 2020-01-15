
function init(){
    alert(0);
    pw.loader.getJson([
        './a.json',
        './b.json',
        './c.json',
    ], (a,b,c)=>{alert(1);});
}

pmBase.hook.on( 'load', init );