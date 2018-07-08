function waitForVar(variable, callback)
{
    if (window[variable]!==undefined)
    {
        callback();
    }
    else
    {
        setTimeout(function() {
            waitForVar(variable, callback);
        }, 100);
    }
}

function extension()
{
    waitForVar("TralbumData", function(){
        var content = '';
        var quantity = document.createElement('div');

        TralbumData['packages'].forEach(element => {
            console.log(element['title'] + ': ' + element['quantity_available'] + ' copies still available  ');
            if (element['quantity_available'] == 1)
                content += '<h3 class="tags-inline-label">' + element['title'] + ': ' + element['quantity_available'] + ' copy still available</h3>';
            else if(element['quantity_available'] == null)
                content += '<h3 class="tags-inline-label">' + element['title'] + ': infinite copies still available (couldn\'t read the number...)</h3>';
            else
                content += '<h3 class="tags-inline-label">' + element['title'] + ': ' + element['quantity_available'] + ' copies still available</h3>';
        });

        quantity.innerHTML= '<h3 class="tags-inline-label">' + content + '</h3>';
        quantity.className = "remainingQuantity";
        quantity.style.width = "100vw";
        quantity.style.width = "auto";
        //quantity.style.position = "fixed";
        quantity.onload = function() {
            this.remove();
        };
        document.getElementById("name-section").appendChild(quantity);
    });
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

window.addEventListener('load', extension());