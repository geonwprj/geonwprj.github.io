$(document).ready(async () => {
    // drxsw
    // 3534941
    // <a href="/book/3534941/1926994403.html">第1章 超神级天赋:天罚之手！</a>
    let title = getAllUrlParams().book;
    let id = getAllUrlParams().bookid;
    const index = getAllUrlParams().index;
    let mode = getAllUrlParams().mode;
    let source = getAllUrlParams().source;
    // https://web.scraper.workers.dev/?url=https%3A%2F%2Fwww.drxsw.com%2Fbook%2F3534941%2F1926994403.html&selector=a%23nextChapterBottom&scrape=attr&attr=href
    // https://web.scraper.workers.dev/?url=https%3A%2F%2Fwww.drxsw.com%2Fbook%2F3534941%2F1926994403.html&selector=div%23TextContent&scrape=text
    // a#nextChapterBottom

    // source = source? source: "drxsw";
    // if (source = "drxsw") {
    //     let url = "https://www.drxsw.com/book/";
    //     url += id + "/";
    //     getPage(url);
    // }

    let nextpage = await getNextUrl("https://www.drxsw.com/book/3534941/1926994403.html");
    $("body").append(nextpage);

  })
async function getNextUrl(url) {
  //https://www.ttkan.co/novel/search?q=贅婿
  //https://web.scraper.workers.dev/?
  //url=https%3A%2F%2Fwww.ttkan.co%2Fnovel%2Fsearch%3Fq%3D%25E8%25B4%2585%25E5%25A9%25BF
  //selector=div+%3E+ul+%3E+li
  //scrape=text

  // let url = "https://www.ttkan.co/novel/search?q=";
  // url += search
  // const selector = "div>ul>li"

  const selector = "a#nextChapterBottom"

  getScrape(url, selector).then(rtn => {
    if (format=="json") {
      const pagesize = 10;
      let data = {"result": formatSearchNovelResult(rtn.result[selector]).slice(pagesize * (page-1), pagesize * page)};
      let mainpre = document.createElement("pre");
      mainpre.innerHTML = JSON.stringify(data, null, 2);
      $("body").append(mainpre);
    } else {
    }
  })
}
function getPage(url) {
    return fetch(url).then((r) => {
        if (r.status===200) {
            console.log(t.text());
          return r.text();
        } else {
          return {};
        }
      }).catch((e) => {
        console.error(e);
        return {};
      });
}