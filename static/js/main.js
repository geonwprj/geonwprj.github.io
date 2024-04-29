function getAllUrlParams(url) {

//    url = (url||window.location.search.slice(1)).replace(/\\u0026/g, "&");
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    queryString = queryString.replace(/\\u0026/g, "&");
    console.log(`queryString: ${queryString}`);
  
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
  return fetch(url).then((r) => {
    if (r.status===200) {
      return r.json();
    } else {
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

function formatText(text) {
  let rtn = text;
  rtn = rtn.replace("分享給朋友：$", "");

  return `<p>${rtn}</p>`;
}

function formatChineseText(text) {
  // Normalize extended sequences of punctuation
//  text = text.replace(/……+/g, '……').replace(/——+/g, '——');
for (var i=0;i<50;i++) text = text.replace("………", "……").replace("———", "——");

  // Function to handle the special case for text within quotation marks
  function handleQuotation(text) {
    const quoteRegex = /“[^”]*”/g;
    return text.match(quoteRegex) || [];
  }

  // Function to split text outside of quotations into sentences
  function splitSentences(text, quotes) {
    // Replace quotes with a placeholder to avoid splitting sentences inside quotes
    quotes.forEach((quote, index) => {
      text = text.replace(quote, `QUOTE_PLACEHOLDER_${index}`);
    });

    // Split the text using the specified delimiters
    const delimiterRegex = /([。！……——”])/g;
    let sentences = text.split(delimiterRegex);

    // Re-insert the quotes in their original positions
    sentences = sentences.map(sentence => {
      const quotePlaceholderRegex = /QUOTE_PLACEHOLDER_(\d+)/;
      const match = quotePlaceholderRegex.exec(sentence);
      return match ? quotes[parseInt(match[1], 10)] : sentence;
    });

    return sentences;
  }

  // Get all the quotations as separate sentences
  const quotes = handleQuotation(text);

  // Split the rest of the text into sentences
  let sentences = splitSentences(text, quotes);

  // Filter out empty strings and join the sentences with paragraph tags
  const formattedText = sentences.filter(Boolean).join('</p><p>');

  // Wrap the entire text in an opening and closing paragraph tag
  return `<p>${formattedText}</p>`;
}

function splitText(text) {
  if ((text||"")=="") return [];
  text = text.replace(/щшш(.*)c./g, "——").replace(/Wшw(.*)￠ ○ /g, "——");
  text = text.replace(/章節報錯(.*)分享給朋友：/g, "\n\n章節報錯");
  text = text.replace(/……+/g, "……").replace(/——+/g, "——");
  text = text.replace(/ /g, "\n");

//  text = text.replace(/” “/g, "”\n“");
//  text = text.replace(/。 /g, "。\n").replace(/“.\n”/g, ".”").replace(/” /g, "”\n");
  return text.split("——").reduce((p, v) => {
    let val = v.trim().replace(/\n/g, "<br>");
    p.push(`<p>${val}</p>`);
    return p;
  }, [])
}

$(document).ready(() => {
    const title = getAllUrlParams().book;
    const index = getAllUrlParams().index;

    let url = "https://www.bg3.co/novel/pagea/";
    url += `${title}_${index}.html`
    console.log(url);
    const selector = "title,div.content"

    let contentdiv = document.createElement("article");
    let sectiondiv = document.createElement("section");
    let titlediv = document.createElement("div");
    let log = document.createElement("div");
    titlediv.id = "title";
    contentdiv.id = "content";
    sectiondiv.id = "section";
    contentdiv.append(sectiondiv);
    log.id = "log";

    $("body").append(titlediv);
    $("body").append(contentdiv);
//    $("body").append(log);

//    showLog(title);
//    showLog(index);
    
    getScrape(url, selector).then(rtn => {
      let chapter = rtn.result["title"][0].split("-")[0].trim();
      $("head").append(`<meta property="og:title" content="${chapter}">`)
      $("head").append(`<title>${chapter}</title>`)
      let novel = rtn.result["div.content"][0];
//      novel = novel.replace("分享給朋友：$", "").trim();
//      novel = formatChineseText(novel);
      novel = splitText(novel).join("——");
//      $("#title").append(chapter);
      $("#section").append(novel);

    }).catch(e => console.error(e));

    //    qingyunian-maoni_378.html
//    ?book=qingyunian-maoni&index=378
})