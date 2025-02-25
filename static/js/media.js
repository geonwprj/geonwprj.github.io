/*
Using vanilla JavaScript's Fetch API to request the JSON data and then render it.
When URL has ac=detail, fetches the detail for a single video.
Otherwise, it renders a list of videos. Each video item is wrapped in an anchor element that links to its detail page.
*/

document.addEventListener("DOMContentLoaded", function() {
    console.log('0.0.1');

    // Parse URL Query Parameters (ensure getAllUrlParams() is defined elsewhere)
    const params = getAllUrlParams();
    const source = params.source;
    const ac = params.ac;   // check if 'ac' is detail
    const pages = {
        'bfzyapi': 'https://app.bfzyapi.com/api.php/provide/vod/'
    };
    const page = pages[source];
    if (!page) {
      console.error('Unknown source.');
      return;
    }
    
    // Using a proxy URL to avoid CORS issues (if needed)
    const proxyUrl = 'https://black-sun-84b9.fpzw5pvb5j.workers.dev/?url=';
    // Build the API URL.
    // If ac=detail then include that parameter and the given vod id.
    let apiUrl;
    if (ac === 'detail') {
      // expects an ids parameter
      const ids = params.ids;
      apiUrl = `${proxyUrl}${page}?ac=detail&ids=${ids}`;
    } else {
      // For the list view
      apiUrl = `${proxyUrl}${page}`;
    }
    
    // Fetch the JSON data from API
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
        document.getElementById('vod-list').textContent = 'Error loading data.';
      });
    
    // Renders a list view with detail links.
    function renderVodList(data) {
      const container = document.getElementById('vod-list');
      container.innerHTML = '';  // clear "loading" message
      
      // Check if data.list exists and is an array
      if (data.list && Array.isArray(data.list)) {
        data.list.forEach(item => {
          // Create a container for each video item, wrapped in a link to its detail page.
          let link = document.createElement('a');
          // Build detail URL; includes the same source parameter.
          link.href = `?source=${source}&ac=detail&ids=${item.vod_id}`;
          link.style.textDecoration = 'none';
          link.style.color = 'inherit';
          
          // Create a container div for the video item.
          let vodDiv = document.createElement('div');
          vodDiv.className = 'vod-item';
      
          // Video title
          let title = document.createElement('h2');
          title.textContent = item.vod_name;
          vodDiv.appendChild(title);
      
          // Metadata (category, release time, remarks)
          let meta = document.createElement('p');
          meta.className = 'meta';
          meta.textContent = `Category: ${item.type_name} | Released: ${item.vod_time} | Remarks: ${item.vod_remarks}`;
          vodDiv.appendChild(meta);
          
          // Append video container to the link and then to main container.
          link.appendChild(vodDiv);
          container.appendChild(link);
        });
      } else {
        container.textContent = 'No video data available.';
      }
    }
    
    // Renders detail view for a single video item.
    function renderDetail(data) {
      const container = document.getElementById('vod-list');
      container.innerHTML = '';  // Clear loading message
      
      if (data.list && data.list.length > 0) {
        const item = data.list[0];  // Detail is expected in first item
      
        // Create a container for the detail
        let detailDiv = document.createElement('div');
        detailDiv.className = 'vod-item';
      
        // Video title
        let title = document.createElement('h2');
        title.textContent = item.vod_name;
        detailDiv.appendChild(title);
      
        // Metadata (category, release time, remarks)
        let meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = `Category: ${item.type_name} | Released: ${item.vod_time} | Remarks: ${item.vod_remarks}`;
        detailDiv.appendChild(meta);
        
        // If available, display video image
        if (item.vod_pic) {
          let image = document.createElement('img');
          image.src = item.vod_pic;
          image.alt = item.vod_name;
          image.style.maxWidth = '100%';
          detailDiv.appendChild(image);
        }
          
        // Optionally, add more detailed fields here.
      
        container.appendChild(detailDiv);
      } else {
        container.textContent = 'No detail data found.';
      }
    }
});
