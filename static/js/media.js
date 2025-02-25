document.addEventListener("DOMContentLoaded", function() {
    console.log('0.0.3');

    const params = getAllUrlParams();
    const source = params.source;
    const ac = params.ac;
    const pages = {
        'bfzyapi': 'https://app.bfzyapi.com/api.php/provide/vod/',
        'apibdzy': 'https://api.apibdzy.com/api.php/provide/vod/'
    };
    const page = pages[source];
    if (!page) {
      console.error('Unknown source.');
      return;
    }

    const proxyUrl = 'https://black-sun-84b9.fpzw5pvb5j.workers.dev/?url=';
    let apiUrl;
    if (ac === 'detail') {
      const ids = params.ids;
      apiUrl = `${proxyUrl}${page}?ac=detail&ids=${ids}`;
    } else {
      apiUrl = `${proxyUrl}${page}`;
    }

    // Show loading message
    const container = document.getElementById('vod-list');
    container.innerHTML = '<p>Loading...</p>';

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        if (ac === 'detail') {
          renderDetail(data);
        } else {
          renderVodList(data);
        }
      })
      .catch(error => {
        console.error('Error fetching API data:', error);
        container.innerHTML = '<p>Error loading data. Please try again later.</p>';
      });

    function renderVodList(data) {
      container.innerHTML = '';  // clear loading message
      if (data.list && Array.isArray(data.list)) {
        data.list.forEach(item => {
          let link = document.createElement('a');
          link.href = `?source=${source}&ac=detail&ids=${item.vod_id}`;
          link.style.textDecoration = 'none';
          link.style.color = 'inherit';

          let vodDiv = document.createElement('div');
          vodDiv.className = 'vod-item';

          let title = document.createElement('h2');
          title.textContent = item.vod_name;
          vodDiv.appendChild(title);

          let meta = document.createElement('p');
          meta.className = 'meta';
          meta.textContent = `Category: ${item.type_name} | Released: ${item.vod_time} | Remarks: ${item.vod_remarks}`;
          vodDiv.appendChild(meta);

          link.appendChild(vodDiv);
          container.appendChild(link);
        });
      } else {
        container.innerHTML = '<p>No video data available.</p>';
      }
    }

    function renderDetail(data) {
        container.innerHTML = '';  // Clear loading message
        if (data.list && data.list.length > 0) {
            const item = data.list[0];  // Detail is expected in first item
            let detailDiv = document.createElement('div');
            detailDiv.className = 'vod-item';
    
            let title = document.createElement('h2');
            title.textContent = item.vod_name;
            detailDiv.appendChild(title);
    
            let meta = document.createElement('p');
            meta.className = 'meta';
            meta.textContent = `Category: ${item.type_name} | Released: ${item.vod_time} | Remarks: ${item.vod_remarks}`;
            detailDiv.appendChild(meta);
    
            if (item.vod_pic) {
                let image = document.createElement('img');
                image.src = item.vod_pic;
                image.alt = item.vod_name;
                image.style.maxWidth = '100%';
                detailDiv.appendChild(image);
            }
    
            // Process vod_play_url
            if (item.vod_play_url) {
                let playUrls = item.vod_play_url.split('#'); // Assuming multiple URLs are comma-separated
                let playList = document.createElement('ul'); // Create a list for play URLs
    
                playUrls.forEach(playUrl => {
                    let [name, url] = playUrl.split('$'); // Split by '$' to get name and URL
                    let listItem = document.createElement('li');
                    let link = document.createElement('a');
                    link.href = url;
                    link.textContent = name; // Display the name
                    link.target = '_blank'; // Open in a new tab
                    listItem.appendChild(link);
                    playList.appendChild(listItem);
                });
    
                detailDiv.appendChild(playList); // Append the list to the detailDiv
            }
    
            container.appendChild(detailDiv);
        } else {
            container.innerHTML = '<p>No detail data found.</p>';
        }
      container.innerHTML = '';  // Clear loading message
      if (data.list && data.list.length > 0) {
        const item = data.list[0];
        let detailDiv = document.createElement('div');
        detailDiv.className = 'vod-item';

        let title = document.createElement('h2');
        title.textContent = item.vod_name;
        detailDiv.appendChild(title);

        let meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = `Category: ${item.type_name} | Released: ${item.vod_time} | Remarks: ${item.vod_remarks}`;
        detailDiv.appendChild(meta);

        if (item.vod_pic) {
          let image = document.createElement('img');
          image.src = item.vod_pic;
          image.alt = item.vod_name;
          image.style.maxWidth = '100%';
          detailDiv.appendChild(image);
        }

        container.appendChild(detailDiv);
      } else {
        container.innerHTML = '<p>No detail data found.</p>';
      }
    }
});