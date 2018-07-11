let update = new Event('inventoryUpdate');

function extension()
{
	waitForVar('TralbumData', () => {
		if(TralbumData.packages != null && typeof TralbumData.packages !== 'undefined')
		{
			window.addEventListener('inventoryUpdate', debounceEvent(() => buildHTML(TralbumData.packages), 100));
			window.dispatchEvent(update);
		}
	});
}

function buildHTML(parent)
{
	console.log('[BANDCAMP REMAINING COPIES EXTENSION]: Inventory update, building new HTML for items in stock');

	let elmt = e({'type': 'div', 'class': 'remainingQuantity buyItem', 'id':'BandcampRemainingCopiesExtension'});
	parent.forEach(element => {
		//watch variable to rebuild HTML in case the page updates
		watchVariabile(element, 'quantity_available', () => {
			window.dispatchEvent(update);
		});

		let number = element.quantity_available;

		let h3 = e({'type': 'h3'}, element.title, ': ');

		let unavailable = {'type': 'span', 'style': 'font-style: italic; font-weight:normal'};
		let boldRed = {'type': 'span', 'class': 'notable'};
		let normal = {'type': 'span', 'style': 'font-weight:normal'};

		if (number == 0)
			h3.a(e(unavailable, 'no copies available'));
		else if(number == null)
			h3.a(e(unavailable, 'no availability info'));
		else if (number == 1)
			h3.a(e(boldRed, '1'), e(normal, ' copy in stock'));
		else
			h3.a(e(boldRed, number), e(normal, ' copies in stock'));

		elmt.a(e({'type': 'span', 'class': 'lightweightBreak'}), h3);
	});

	if(document.getElementById('BandcampRemainingCopiesExtension') != null && document.getElementById('BandcampRemainingCopiesExtension') !== 'undefined')
		document.getElementById('BandcampRemainingCopiesExtension').remove();

	document.getElementById('name-section').a(elmt);
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

function e(data, ...content)
{
	let elmt;

	if (data.type)
		elmt = document.createElement(data.type);
	else
		elmt = document.createElement('div');

	if(data.id)
		elmt.id = data.id;

	if(data.class)
		elmt.className = data.class;

	if(data.style)
		elmt.style.cssText = data.style;

	elmt.a(...content);

	return elmt;
}

HTMLElement.prototype.a = function(...toAppend){
	let obj=this;
	toAppend.forEach(element => {
		if (typeof element == 'string' || element instanceof String || typeof element == 'number' || element instanceof Number)
			obj.insertAdjacentText('beforeend', element);
		else
		{
			obj.onload = function() {
				this.remove();
			};
			obj.appendChild(element);
		}
	}
)};

HTMLElement.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

const debounceEvent = (callback, time = 250, interval) => 
	(...args) =>
		clearTimeout(interval, interval = setTimeout(() => callback(...args), time));

window.addEventListener('load', extension());