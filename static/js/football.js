$(document).ready(async () => {
    const name = getAllUrlParams().q;
    const zh_name = await getZhQuery(name);
    console.log(zh_name);
    let mainpre = document.createElement("pre");
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

// Function to scrape Wikipedia for Chinese names based on region
async function scrapeWikipedia(name, region) {
    // Prepare Wikipedia search URL
    const zhName = await getZhQuery(name);
    const searchUrl = wikipediaUrls[region] + zhName;

    try {
        // Send a GET request to the Wikipedia page
        const response = await fetch(searchUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Try to find the Chinese names in the infobox, if it exists
        const infobox = doc.querySelector('table.infobox');
        if (infobox) {
            const zhRow = infobox.querySelector('caption.fn');
            if (zhRow) {
                const chineseName = zhRow.innerHTML.split('<br>')[0].trim();
                return chineseName;
            }
        } else {
            console.log('no infobox');
        }
    } catch (error) {
        console.error('Error fetching Wikipedia page:', error);
    }
    return null;
}

async function getZhQuery(query) {
    const baseUrl = "https://en.wikipedia.org/wiki/";
    console.log(query);
    console.log(capitalizeWords(query).replace(' ', '_'))
    const searchUrl = baseUrl + capitalizeWords(query).replace(' ', '_');
    let rtn = await getScrape(searchUrl, 'a[lang="zh"]', 'href')
    console.log(rtn);
    return rtn.result ? rtn.result.replace('https://zh.wikipedia.org/wiki/', '') : capitalizeWords(query).replace(' ', '_');

}
