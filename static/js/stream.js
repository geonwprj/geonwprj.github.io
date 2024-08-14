$(document).ready(async () => {
    const name = getAllUrlParams().q;

    let mainpre = document.createElement("pre");
    mainpre.innerHTML = getQueryParam('x-api-key');
    $("body").append(mainpre);    
})

