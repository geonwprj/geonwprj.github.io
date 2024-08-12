$(document).ready(async () => {
    const name = getAllUrlParams().q;
    const zh_name = await getZhQuery(name);
    $('body').text = name + ' ' + zh_name;
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
    console.log(query.replace(' ', '_'));
    console.log(capitalizeWords(query))
    console.log(capitalizeWords(query.replace(' ', '_')))
    const searchUrl = baseUrl + capitalizeWords(query).replace(' ', '_');

    try {
        const response = await fetch(searchUrl, { mode: 'no-cors' });
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const link = doc.querySelector('a[hreflang="zh"]');
        return link ? link.href.replace('https://zh.wikipedia.org/wiki/', '') : capitalizeWords(query).replace(' ', '_');
    } catch (error) {
        return query.replace(' ', '_');
    }
}
