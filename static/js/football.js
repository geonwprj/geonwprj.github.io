$(document).ready(async () => {
    const name = getAllUrlParams().q;
    const zh_name = await getZhQuery(name);
    $('body').text = name + ' ' + zh_name;
})

async function getZhQuery(query) {
    const baseUrl = "https://en.wikipedia.org/wiki/";
    const searchUrl = baseUrl + query.replace(' ', '_');

    try {
        const response = await fetch(searchUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const link = doc.querySelector('a[hreflang="zh"]');
        return link ? link.href.replace('https://zh.wikipedia.org/wiki/', '') : query.replace(' ', '_');
    } catch (error) {
        return query.replace(' ', '_');
    }
}
