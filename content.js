window.addEventListener("load", function(){
    //since bandcamp allows for custom url the extension needs to run on all pages so to filter out pages that are not bandcamp I do:
    if(document.getElementById("login")!=null && typeof document.getElementById("login").childNodes[0].getAttribute('href') !== "undefined")
    {
        let login=document.getElementById("login").childNodes[0].getAttribute('href');
        if (login.indexOf("bandcamp.com"))
        {
            console.log("this is Bandcamp!");
            console.log('bandcamp remaining copies extension executing');

            var s = document.createElement('script');
            s.src = chrome.extension.getURL('script.js');
            s.onload = function() {
                this.remove();
            };
            (document.head || document.documentElement).appendChild(s);
        }
    }
});