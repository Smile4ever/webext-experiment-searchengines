const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");
//const LoginInfo = Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
//                                         "nsILoginInfo", "init");
const SearchService = Services.search;
SearchService.init();

// Mapped most useful properties from https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISearchEngine
// Skipped "hidden" and "type"
const FIELDS = {
  name: "name",
  keyword: "alias",
  description: "description",
  searchUrl: "searchForm",
  icon: "iconURI"
};

function convert(info) {
  let obj = {};
  for (let field of Object.keys(FIELDS)) {
	  if(field == "icon"){
        obj[field] = info[FIELDS[field]].spec;
	  }else{
		obj[field] = info[FIELDS[field]];
	  }
  }
  return obj;
}

var engines = SearchService.getVisibleEngines({}).map(convert);
for(let engine of engines){
	console.log(engine.name);
	console.log(engine.keyword);
	console.log(engine.description);
	console.log(engine.searchUrl);
	//console.log(engine.icon); works, but clutters up the console
}

function match(info, search) {
  if(!search) return true;
  return Object.keys(search).every(field => search[field] == null || search[field] == info[FIELDS[field]]);
}

class API extends ExtensionAPI {
  getAPI(context) {
    // XXX only return this for background contexts?
    return {
      searchengines: {
        getDefaultEngine(nofilter) {
		  console.log("browser.searchengines: calling getDefaultEngine method");
          let searchengine = convert(SearchService.defaultEngine);
          return Promise.resolve(searchengine);
		},
		list(filter) {
		  console.log("browser.searchengines: calling list method");
          let searchengines = SearchService.getVisibleEngines({})
              .filter(engine => match(engine, filter))
              .map(convert);

          return Promise.resolve(searchengines);
        },
      },
    };
  }
}
