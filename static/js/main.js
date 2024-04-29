function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  
    // we'll store the parameters here
    var obj = {};
  
    // if query string exists
    if (queryString) {
  
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
  
      // split our query string into its component parts
      var arr = queryString.split('&');
  
      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
  
        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
  
        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
  
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];
  
          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string'){
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }
  
    return obj;
  }

function getScrape(source, selector) {
  let url = "https://web.scraper.workers.dev/?scrape=text";
  if (selector||"" != "") {
    url += "&selector=" + encodeURIComponent(selector);
  }
  if (source||"" != "") {
    url += "&url=" + encodeURIComponent(source);
  }
  showLog(url);
  return fetch(url).then((r) => {
    console.log(r.body);
    if (r.status===200) {
      return r.json();
    } else {
      showLog(r.status);
      return {};
    }
  }).catch((e) => {
    console.error(e);
    return {};
  });
}

function showLog(txt) {
  $("#log").append(txt);
  $("#log").append("<br>");
}

$(document).ready(() => {
    const title = getAllUrlParams().book;
    const index = getAllUrlParams().index;

    let url = "https://www.bg3.co/novel/pagea/";
    url += `${title}_${index}.html`
    const selector = "div.title,div.content"

    let content = document.createElement("div");
    let log = document.createElement("div");
    content.id = "content";
    log.id = "log";

    $("body").append(content);
    $("body").append(log);

    showLog(title);
    showLog(index);
    
    getScrape(url, selector).then(rtn => {
      console.log("rtn:");
      console.log(rtn);
      $("#content").append(rtn);
    }).catch(e => console.error(e));

    //    qingyunian-maoni_378.html
//    ?book=qingyunian-maoni&index=378
})