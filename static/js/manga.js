// https://cc.fun8.us/post/115200011104001.html

$(document).ready(() => {

    let content = document.createElement("div");
    let log = document.createElement("div");
    content.id = "content";
    log.id = "log";
    $("body").append(content);
    $("body").append(log);

    let url = "https://cc.fun8.us/post/115200011104001.html";
    fetch(url).then((r) => {
        if (r.status===200) {
          $("#content").append(r.text());
        } else {
          return {};
        }
      }).catch((e) => {
        console.error(e);
        $("#log").append(e);
        return {};
      });    
    // const title = getAllUrlParams().book;
    // const index = getAllUrlParams().index;

    // let url = "https://www.bg3.co/novel/pagea/";
    // url += `${title}_${index}.html`
    // console.log(url);
    // const selector = "title,div.content"

    // let contentdiv = document.createElement("article");
    // let sectiondiv = document.createElement("section");
    // let titlediv = document.createElement("div");
    // let log = document.createElement("div");
    // titlediv.id = "title";
    // contentdiv.id = "content";
    // sectiondiv.id = "section";
    // contentdiv.append(sectiondiv);
    // log.id = "log";

    // $("body").append(titlediv);
    // $("body").append(contentdiv);
    
    // getScrape(url, selector).then(rtn => {
    //   let chapter = rtn.result["title"][0].split("-")[0].trim();
    //   $("head").append(`<meta property="og:title" content="${chapter}">`)
    //   $("head").append(`<title>${chapter}</title>`)
    //   let novel = rtn.result["div.content"][0];
    //   novel = splitText(novel).join("——");
    //   $("#section").append(novel);

    // }).catch(e => console.error(e));

})