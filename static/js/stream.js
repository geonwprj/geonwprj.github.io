$(document).ready(async () => {
    const name = getAllUrlParams().q;
    const cf_key = getAllUrlParams().key;

    let cf_val = extractIdAndSecret(cf_key);
    let headers = {'CF-Access-Client-Id': cf_val.id, 'CF-Access-Client-Secret': cf_val.secret};
    console.log(headers);

    let mainpre = document.createElement("pre");
    mainpre.innerHTML = headers;
    $("body").append(mainpre);    
})

function extractIdAndSecret(base64String) {
    // Decode the Base64 string
    const decodedString = atob(base64String);

    // Split the decoded string by the delimiter ':'
    const [id, secret] = decodedString.split(':');

    // Return the extracted id and secret as an object
    return { id, secret };
}