var iframe = document.createElement('iframe');
iframe.src = "https://DOMAIN/UUID/PRELANDING/index.html";
iframe.style='position:absolute; height: 1000px; width: 100%;';
document.body.appendChild(iframe);
setTimeout(function() { document.getElementById('span').style.display = "none"; }, 1000);
