$(document).ready(async () => {

    // Assuming you have the blob URL
const blobUrl = 'blob:https://hkv.letv8.cc/8e564cd7-31dc-409f-bb79-eefb49dd5fa2';

// Fetch the data using the blob URL
fetch(blobUrl)
  .then(response => response.blob())
  .then(blob => {
    // Process the blob data (e.g., create a URL object, display it, etc.)
    const objectURL = URL.createObjectURL(blob);
    console.log("Object URL:", objectURL);

    // Example: Create an <a> tag to download the file
    const a = document.createElement('a');
    a.href = objectURL;
    a.download = 'file_name'; // Replace with appropriate file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up object URL
    URL.revokeObjectURL(objectURL);
  })
  .catch(error => console.error('Error fetching blob data:', error));

    // const name = getAllUrlParams().q;
    // const cf_key = getAllUrlParams().key;

    // let cf_val = extractIdAndSecret(cf_key);
    // let headers = {'CF-Access-Client-Id': cf_val.id, 'CF-Access-Client-Secret': cf_val.secret};
    // console.log(headers);

    // let mainpre = document.createElement("pre");
    // mainpre.innerHTML = headers;
    // $("body").append(mainpre);    
})

function extractIdAndSecret(base64String) {
    // Decode the Base64 string
    const decodedString = atob(base64String);

    // Split the decoded string by the delimiter ':'
    const [id, secret] = decodedString.split(':');

    // Return the extracted id and secret as an object
    return { id, secret };
}

