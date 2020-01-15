const DataLib = {};
const DataRefs = [];

const add = function(name, url, cache = true) {
  DataRefs.push({
    cache,
    name,
    url,
  });
};

const get = function(name, value) {
  if ( value === undefined ){
    return DataLib[name];
  }
  else
  {
    return DataLib[name][value];
  }
};

const load = function (callback) {
  let requests = [];
  for (let ref of DataRefs) {
    if (ref.name in DataLib) continue;
    var request = $.getJSON(ref.url, data => {
      DataLib[ref.name] = data;
    }).fail((jqxhr, textStatus, error)=>{
      pmBase.error(`Failed to load '${ref.url}': ${error}`);
    });
    requests.push(request);
  }
  $.when(...requests).then(function () {
    callback();
  });
}

export default {
  load,

  add,
  get,
}