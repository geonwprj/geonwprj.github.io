/*
Using vanilla JavaScript's Fetch API to request the JSON data and then render it.
Each video item is wrapped in an anchor element that links to a detail page with the URL format:
    [current_page]?ac=detail&ids=[vod_id]
*/

document.addEventListener("DOMContentLoaded", function() {
    const proxyUrl = 'https://black-sun-84b9.fpzw5pvb5j.workers.dev/?url=';
    const apiUrl = proxyUrl+'https://app.bfzyapi.com/api.php/provide/vod/';
    
    // Use the Fetch API to get and process JSON
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        renderVodList(data);
      })
      .catch(error => {
        console.error('Error fetching API data:', error);
        document.getElementById('vod-list').textContent = 'Error loading data.';
      });
    
    // Function to render the list of videos
    function renderVodList(data) {
      const container = document.getElementById('vod-list');
      container.innerHTML = '';  // clear "loading" message
      
      // Make sure data.list exists and is an array
      if (data.list && Array.isArray(data.list)) {
        data.list.forEach(item => {
          // Create a container for each video item, wrapped in a link to its detail page.
          let link = document.createElement('a');
          // Build detail URL; you may wish to change the base URL if needed.
          link.href = `?ac=detail&ids=${item.vod_id}`;
          link.style.textDecoration = 'none'; // remove underline; adjust via CSS if preferred.
          link.style.color = 'inherit';       // inherit color; adjust as needed.
          
          // Create a container div for the video item
          let vodDiv = document.createElement('div');
          vodDiv.className = 'vod-item';
      
          // Video title
          let title = document.createElement('h2');
          title.textContent = item.vod_name;
          vodDiv.appendChild(title);
      
          // Metadata (category, release time, and remarks)
          let meta = document.createElement('p');
          meta.className = 'meta';
          meta.textContent = `Category: ${item.type_name} | Released: ${item.vod_time} | Remarks: ${item.vod_remarks}`;
          vodDiv.appendChild(meta);
          
          // Append video container to the link
          link.appendChild(vodDiv);
          
          // Then append the link to the main container
          container.appendChild(link);
        });
      } else {
        container.textContent = 'No video data available.';
      }
    }
});
