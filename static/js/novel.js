$(document).ready(async () => {
  const title = getAllUrlParams().book;
  const index = getAllUrlParams().index;

  let author = title.split("-")[1].trim();
  let isready = true
  for (let i = 0; i<8; i++) {
    const fnm = `novel/${title}_${index}_${i}.data`;
    isready &= await fileExists(fnm);
    $("body").append(`${fnm}: ${isready}<br>`);
    if (!isready) break;
  }
  if (isready) {

  } else {
    getSource(title, index, author);
  }
})

async function fileExists(path) {
  const req = await fetch(path);
  return req.status != 404;
}

function getSource(title, index, author) {
  let url = "https://www.bg3.co/novel/pagea/";
  url += `${title}_${index}.html`
  const selector = "title,div.content"

  getScrape(url, selector).then(rtn => {
    let chapter = rtn.result["title"][0].split("-")[0].trim();
    chapter = chapter.split("-")[0].trim().replace(/⚡/g, "").trim();
    const chapterobj = chapter.split(" ");
    let subchapter = chapterobj[1].trim();
    for (var i=2; i<chapterobj.length; i++) {
      subchapter += " " + chapterobj[i];
    }
    chapter = chapterobj[0].trim();
    chapter = chapter.replace(/《/g, "").replace(/》/g, "");

    $("head").append(`<meta property="og:title" content="${chapter} - ${subchapter}">`)
    $("head").append(`<title>${chapter} - ${subchapter}</title>`);
//      $("#titlediv").append(chapter);
//      $("#subtitlediv").append(subchapter);

    let maindiv = document.createElement("main");

    let titlediv = document.createElement("h1");
    titlediv.append(subchapter);
    let subtitlediv = document.createElement("div");
//      subtitlediv.append(subchapter);

    let byline = document.createElement("div");
    byline.classList.add("byline");
    byline.append("By ");
    let authorlink = document.createElement("a");
    authorlink.setAttribute("href", "/");
    authorlink.append(author);
    byline.append(authorlink);
    byline.append(" -- ");
    let timediv = document.createElement("time");
    timediv.setAttribute("datetime", "2024-04-01T00:00:00Z");
    timediv.append("April 1, 2024");
    byline.append(timediv);

    maindiv.append(titlediv);
    maindiv.append(subtitlediv);
    maindiv.append(byline);

    let novel = rtn.result["div.content"][0];
    const novelTxt = splitText(novel);
    for (var i=0; i<novelTxt.length; i++) {
      if (i>0) {
        let delimitdiv = document.createElement("p");
        delimitdiv.append("---");
        maindiv.append(delimitdiv);
      }
      const val = novelTxt[i];
      maindiv.innerHTML += val;
    }
/*      novel = splitText(novel).join("——");
    console.log(novel);
    maindiv.append(novel);
*/
    $("body").append(maindiv);  

  }).catch(e => console.error(e));

}