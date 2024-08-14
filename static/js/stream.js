$(document).ready(async () => {
    const name = getAllUrlParams().q;

    let mainpre = document.createElement("pre");
    let key = getQueryParam('x-api-key');
    console.log(key);
    mainpre.innerHTML = key;
    $("body").append(mainpre);    
})

