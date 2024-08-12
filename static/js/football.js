$(document).ready(async () => {
    const name = getAllUrlParams().q;
    const zh_name = await getZhQuery(name);
    console.log(zh_name);
    $('body').innerHTML = name + '<br>' + zh_name;
})

function capitalizeWords(str) {
    str = str.replace('%20', ' ');
    return str.replace(/(?:^|\s|,|\.)\S/g, function(match) {
        return match.toUpperCase();
    });
}

async function getZhQuery(query) {
    const baseUrl = "https://en.wikipedia.org/wiki/";
    console.log(query);
    console.log(capitalizeWords(query).replace(' ', '_'))
    const searchUrl = baseUrl + capitalizeWords(query).replace(' ', '_');
    let rtn = await getScrape(searchUrl, 'a[lang="zh"]', 'href')
    console.log(rtn);
    return rtn.result ? rtn.result.replace('https://zh.wikipedia.org/wiki/', '') : capitalizeWords(query).replace(' ', '_');

    // &selector=a%5Blang%3D"zh"%5D&scrape=attr&spaced=true&attr=href&pretty=true
    // getScrape(searchUrl, 'a[lang="zh"]', 'href').then(rtn => {
    //     if (format=="json") {
    //       const pagesize = 10;
    //       let data = rtn.result;
    //       let mainpre = document.createElement("pre");
    //       mainpre.innerHTML = data;
    //       $("body").append(mainpre);
    //       return 
    //     } else {
    //     }
    //   })

    // try {
    //     const response = await fetch(searchUrl, { mode: 'no-cors' });
    //     const text = await response.text();
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(text, 'text/html');
    //     console.log(text);
    //     const link = doc.querySelector('a[hreflang="zh"]');
    //     console.log(link);
    //     return link ? link.href.replace('https://zh.wikipedia.org/wiki/', '') : capitalizeWords(query).replace(' ', '_');
    // } catch (error) {
    //     console.log('error');
    //     console.log(error);
    //     return query.replace(' ', '_');
    // }
}
