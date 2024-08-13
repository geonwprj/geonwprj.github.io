async function fetchAndDisplayContent(url) {
    try {
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        let response = await fetch(proxyUrl + url);
        if (response.ok) {
            let data = await response.text();
            document.getElementById('content').innerHTML = data;
        } else {
            console.error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Replace 'https://example.com/data' with the URL you want to fetch content from
fetchAndDisplayContent('https://www.zhibo1.cc/list_Soccer_1.html');
