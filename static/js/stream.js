$(document).ready(async () => {
    const name = getAllUrlParams().q;
    let cf_key = getAllUrlParams().key;

    cf_key = 'MzJjZTNjZDU3NjNhM2Q2YzQ0ZjQyYzY4YjM0ODc2YzkuYWNjZXNzOjE2NzhhZWQ2YzliZjRmNzliOGUyNTk0ZGEzZTMwYjhlOGZkODEzNjFkYjM0NmFlMTE0ZTU3ZDUzNDk3ZjczZDg=';
    cf_val = extractIdAndSecret(cf_key);
    console.log(cf_val);

    let mainpre = document.createElement("pre");
    mainpre.innerHTML = '';
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