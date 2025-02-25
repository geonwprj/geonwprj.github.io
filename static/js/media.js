/*
Using vanilla JavaScript's Fetch API to request the JSON data and then render it.
Note: If you prefer to use jQuery and its AJAX functionality, you might need to use the full version of jQuery instead of the slim version.
*/

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://app.bfzyapi.com/api.php/provide/vod/';
    
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
          // Create a container div for each video item
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
      
          // Append the video div to the container
          container.appendChild(vodDiv);
        });
      } else {
        container.textContent = 'No video data available.';
      }
    }
});
