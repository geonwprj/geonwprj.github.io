$(document).ready(async () => {
    // drxsw
    // 3534941
    // <a href="/book/3534941/1926994403.html">第1章 超神级天赋:天罚之手！</a>
    let title = getAllUrlParams().book;
    let id = getAllUrlParams().bookid;
    let index = getAllUrlParams().index;
    let mode = getAllUrlParams().mode;
    let source = getAllUrlParams().source;

    // console.log('xxz');
    index = index? index: "1";
    
    let url = "";
    let bookdtl = "";
    source = source? source: "drxsw";
    if (source = "drxsw") {
        url = "https://www.drxsw.com/zh_hant/book/";
        url += id + "/";
        bookdtl = await getPage(url, index);
        document.title = bookdtl.title
        url += bookdtl.page;
        // console.log(page);
    }

    let nextpage = await getNextUrl(url);
    // console.log(nextpage);
    let nextlink = document.createElement("a");
    nextlink.id = "nextChapterTop";
    nextlink.text = "next";
    nextlink.href = "/novel_n.html?bookid="+id+"&index="+(parseInt(index, 10) + 1).toString();

    let content = await getContent(url);
    // console.log(content);

    const jsCodeRegex = /\(AdProvider = window\.AdProvider \|\| \[\]\)\.push\(\{\"serve\"\: \{\}\}\)\;/g;
    content = content.replace(jsCodeRegex, '</p><p>');

    // content = content.replace(/(AdProvider = window.AdProvider \|\| []).push({"serve": {}});/g, "");
    let lines = content.split(/\r/);
    content = lines.map(line => `<p>${line}</p>`).join("");

    let contentdiv = document.createElement("div");
    contentdiv.id = "TextContent"
    contentdiv.innerHTML = content;

    let headersec = document.createElement("header");
    let headerh1 = document.createElement("h1");
    headerh1.innerHTML = bookdtl.title;
    headersec.append(headerh1);
    $("body").append(headersec);

    let articlesec = document.createElement("article");
    let articleinner = document.createElement("section");
    articleinner.innerHTML = content;
    articlesec.append(articleinner);
    $("body").append(articlesec);

    let footersec = document.createElement("footer");
    footersec.append(nextlink)
    $("body").append(footersec);
  })

async function getNextUrl(url) {
  const selector = "a#nextChapterBottom";
  let rtn = await getScrape(url, selector, 'href');
  return rtn.result;
}

async function getContent(url) {
  const selector = "div#TextContent";
  let rtn = await getScrape(url, selector);
  return rtn.result[selector][0];
}

async function getPage(url, index) {
  // Initialize the rtn object
  let rtn = {};

  let selector = "div#newlist > ul#chapterList > li:nth-child(" + index + ") > a";
  let page = await getScrape(url, selector, 'href');
  rtn.page = page.result;

  selector = 'div.d_title > h1';
  let title = await getScrape(url, selector);
  rtn.title = title.result[selector][0];

  selector = 'div.d_title > span';
  let author = await getScrape(url, selector);
  rtn.author = author.result[selector][0];

  return rtn;
}
