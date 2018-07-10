let update = new Event('inventoryUpdate');

function extension()
{
	let content = {item: [], value:''};
	let quantity = document.createElement('div');

	quantity.className = 'remainingQuantity buyItem';
	quantity.style.width = "auto";

	waitForVar('TralbumData', () => {
		if(TralbumData.packages != null && typeof TralbumData.packages !== "undefined")
		{
			window.addEventListener('inventoryUpdate', debounceEvent(() => {
				console.log('Inventory update, building new HTML for items in stock');
				buildHTML(TralbumData.packages, content, quantity);
			}, 100));
			window.dispatchEvent(update);
		}
	});
}

function buildHTML(parent, html, elmt)
{
	let index = 0;
	parent.forEach(element => {
		//watch variable to rebuild HTML in case it 
		watchVariabile(element, 'quantity_available', () => {
			window.dispatchEvent(update);
			//buildHTML(parent, html, elmt);
		});

		let number=element.quantity_available;

		if (number == 0)
			html.item[index] = '<span style="font-style: italic; font-weight:normal">no copies available</span>';
		else if(number == null)
			html.item[index] = '<span style="font-style: italic; font-weight:normal">no availability info or &infin;</span>';
			else if (number == 1)
			html.item[index] = '<span class="notable">1</span><span style="font-weight:normal"> copy in stock</span>';
		else
			html.item[index] = '<span class="notable">' + number + '</span><span style="font-weight:normal"> copies in stock</span>';

		html.item[index] = '<span class="lightweightBreak"></span><h3 class="tags-inline-label">' + element.title + ': '+ html.item[index] + '</h3>'
		
		index++;
		if(index === TralbumData.packages.length)
		{
			appendToTitle(elmt, html);
		}
	});
}

function appendToTitle(toAppend, HTML)
{
	HTML.item.forEach(element => HTML.value += element);
	toAppend.innerHTML = HTML.value;
	HTML.item = [];
	HTML.value = '';
	toAppend.onload = function() {
		this.remove();
	};
	document.getElementById("name-section").appendChild(toAppend);
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function watchVariabile (object, name, callback)
{
	let value = object[name];

	Object.defineProperty(object, name, {

		get: () => { 
			return value; 
		},

		set: (newValue) => { 
			value = newValue; 
			callback (value);
		},

		enumerable: true,
		configurable: true
	});
}

function waitForVar(variable, callback)
{
	if (window[variable] !== undefined)
	{
		callback();
	}
	else
	{
		setTimeout(() => {
			waitForVar(variable, callback);
		}, 100);
	}
}

const debounceEvent = (callback, time = 250, interval) => 
	(...args) =>
		clearTimeout(interval, interval = setTimeout(() => callback(...args), time));

window.addEventListener('load', extension());