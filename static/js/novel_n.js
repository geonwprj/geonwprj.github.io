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

    let url = "https://www.drxsw.com/book/3534941/1926994403.html";
    let nextpage = await getNextUrl(url);
    console.log('xxz');
    console.log(nextpage);
    $("body").append(nextpage);
    let content = await getContent(url);
    console.log(content);

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