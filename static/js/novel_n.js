$(document).ready(async () => {
    // drxsw
    // 3534941
    // <a href="/book/3534941/1926994403.html">第1章 超神级天赋:天罚之手！</a>
    let title = getAllUrlParams().book;
    let id = getAllUrlParams().bookid;
    let index = getAllUrlParams().index;
    let mode = getAllUrlParams().mode;
    let source = getAllUrlParams().source;
    // https://web.scraper.workers.dev/?url=https%3A%2F%2Fwww.drxsw.com%2Fbook%2F3534941%2F1926994403.html&selector=a%23nextChapterBottom&scrape=attr&attr=href
    // https://web.scraper.workers.dev/?url=https%3A%2F%2Fwww.drxsw.com%2Fbook%2F3534941%2F1926994403.html&selector=div%23TextContent&scrape=text
    // a#nextChapterBottom

    console.log('xxz');
    index = index? index: "1";
    
    let url = "";
    let page = "";
    source = source? source: "drxsw";
    if (source = "drxsw") {
        url = "https://www.drxsw.com/zh_hant/book/";
        url += id + "/";
        page = await getPage(url, index);
        console.log(page);
    }
    url += page;

    // let url = "https://www.drxsw.com/zh_hant/book/3534941/1926994403.html";
    let nextpage = await getNextUrl(url);
    // console.log(nextpage);
    let nextlink = document.createElement("a");
    nextlink.id = "nextChapterBottom";
    nextlink.text = "next";
    nextlink.href = "/novel_n.html?bookid="+id+"&index="+(parseInt(index)+1);

    let content = await getContent(url);
    console.log(content);

    content = content.replace(/(AdProvider = window.AdProvider \|\| []).push({"serve": {}});/g, "");
    let lines = content.split(/\n\r/);
    content = lines.map(line => `<p>${line}</p>`).join("");

    let contentdiv = document.createElement("div");
    contentdiv.id = "TextContent"
    contentdiv.innerHTML = content;

    $("body").append(contentdiv);
    $("body").append(nextlink);
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
  const selector = "div#newlist > ul#chapterList > li:nth-child(" + index + ") > a";
  let rtn = await getScrape(url, selector, 'href');
  return rtn.result;
}