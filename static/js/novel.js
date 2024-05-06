/* <main>
<h1>Your title<h1>
<div>Your subtitle</div>
<div class="byline">
By <a href="/">Your Name</a> -- 
<time datetime="2018-04-06T05:52:50Z">April 6, 2018</time>
</div>
<p> article content... </p>
<p> article content... </p>
</main> */

$(document).ready(() => {
    const title = getAllUrlParams().book;
    const index = getAllUrlParams().index;

    let url = "https://www.bg3.co/novel/pagea/";
    url += `${title}_${index}.html`
    console.log(url);
    const selector = "title,div.content"

    let author = title.split("-")[1].trim();

    let maindiv = document.createElement("main");
    maindiv.id = "main";

    let titlediv = document.createElement("h1");
    titlediv.id = "titlediv";
    let subtitlediv = document.createElement("div");
    subtitlediv.id = "subtitlediv";

    let byline = document.createElement("div");
    byline.classList.add("byline");
    byline.append(`By <a href="/">${author}</a> -- `);
    let timediv = document.createElement("time");
    timediv.setAttribute("datetime", "2024-04-01T00:00:00Z");
    timediv.append("April 1, 2024");
    byline.append(timediv);

    maindiv.append(titlediv);
    maindiv.append(subtitlediv);
    maindiv.append(byline);

    $("body").append(maindiv);

    getScrape(url, selector).then(rtn => {
      let chapter = rtn.result["title"][0].split("-")[0].trim();
      chapter = chapter.split("-")[0].trim().replace(/⚡/g, "");
      const chapterobj = chapter.split(" ");
      let subchapter = chapterobj[1].trim();
      for (var i=2; i<chapterobj.length; i++) {
        subchapter += " " + chapterobj[i];
      }
      chapter = chapterobj[0].trim();
      chapter = chapter.replace(/《/g, "").replace(/》/g, "");
  
      $("head").append(`<meta property="og:title" content="${chapter} - ${subchapter}">`)
      $("head").append(`<title>${chapter} - ${subchapter}</title>`);
      $("#titlediv").append(chapter);
      $("#subtitlediv").append(subchapter);

      let novel = rtn.result["div.content"][0];
      novel = splitText(novel).join("——");
      $("#main").append(novel);

    }).catch(e => console.error(e));


    /*
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
    
    getScrape(url, selector).then(rtn => {
      let chapter = rtn.result["title"][0].split("-")[0].trim();
      $("head").append(`<meta property="og:title" content="${chapter}">`)
      $("head").append(`<title>${chapter}</title>`)
      let novel = rtn.result["div.content"][0];
      novel = splitText(novel).join("——");
      $("#section").append(novel);

    }).catch(e => console.error(e));
    */
})