$(document).ready(async () => {
    const name = getAllUrlParams().q;
    // const zh_name = await getZhQuery(name);
    // console.log(zh_name);
    let mainpre = document.createElement("pre");
    const zh_name = await scrapeWikipedia(name, 'Hong_Kong')
    mainpre.innerHTML = name + '<br>' + zh_name;
    $("body").append(mainpre);    
})

function capitalizeWords(str) {
    str = str.replace('%20', ' ');
    return str.replace(/(?:^|\s|,|\.)\S/g, function(match) {
        return match.toUpperCase();
    });
}

const wikipediaUrls = {
    'Hong_Kong': 'https://zh.wikipedia.org/zh-hk/',
    'Taiwan': 'https://zh.wikipedia.org/zh-tw/',
    'China': 'https://zh.wikipedia.org/zh-cn/'
};

function getChinesePart(text) {
    const match = text.match(/[\u4e00-\u9fa5]+/);
    return match ? match[0] : '';
}

// Function to scrape Wikipedia for Chinese names based on region
async function scrapeWikipedia(name, region) {
    // Prepare Wikipedia search URL
    const zhName = await getZhQuery(name);
    const searchUrl = wikipediaUrls[region] + zhName;
    selector = 'caption.fn'
    let rtn = await getScrape(searchUrl, selector)
    console.log(rtn);
    try {
        return getChinesePart(rtn.result[selector][0]);
    } catch {
        return name
    }
}

async function getZhQuery(query) {
    const baseUrl = "https://en.wikipedia.org/wiki/";
    // console.log(query);
    // console.log(capitalizeWords(query).replace(' ', '_'))
    const searchUrl = baseUrl + capitalizeWords(query).replace(' ', '_');
    let rtn = await getScrape(searchUrl, 'a[lang="zh"]', 'href')
    // console.log(rtn);
    return rtn.result ? rtn.result.replace('https://zh.wikipedia.org/wiki/', '') : capitalizeWords(query).replace(' ', '_');
}
