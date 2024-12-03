$(document).ready(async () => {
    // drxsw
    // 3534941
    // <a href="/book/3534941/1926994403.html">第1章 超神级天赋:天罚之手！</a>
    let title = getAllUrlParams().book;
    let id = getAllUrlParams().bookid;
    const index = getAllUrlParams().index;
    let mode = getAllUrlParams().mode;
    let source = getAllUrlParams().source;

    source = source? source: "drxsw";
    if (source = "drxsw") {
        let url = "https://www.drxsw.com/book/";
        url += id + "/";
        getPage(url);
    }

  })

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