window.addEventListener("load", function(){
    //since bandcamp allows for custom url the extension needs to run on all pages so to filter out pages that are not bandcamp I do:
    if(document.getElementById("footer-logo")!=null && typeof document.getElementById("footer-logo").getAttribute('href') !== "undefined")
    {
        let logo=document.getElementById("footer-logo").getAttribute('href');
        if (logo.indexOf("bandcamp.com"))
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