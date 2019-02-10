console.log("log");

//browsing 
var Anchors = document.getElementsByTagName("a");
for (var i = 0; i < Anchors.length ; i++) {
    Anchors[i].addEventListener("click", inspectClicks, false);        
}

//inspect item selection
if (document.readyState === "complete"
   || document.readyState === "loaded"
   || document.readyState === "interactive") {
	inspectProduct();
} else {
	window.addEventListener("DOMContentLoaded", inspectProduct, false); 
}




//inspect add to cart action
var addToCard = document.getElementById("add-to-cart-button");
addToCard.addEventListener("submit", inspectAddToCart, false); 
addToCard.addEventListener("click", inspectAddToCart, false); 


//inspect add to list action
var addToList = document.getElementById("add-to-wishlist-button-submit");
addToList.addEventListener("submit", inspectAddToList, false); 
addToList.addEventListener("click", inspectAddToList, false); 

//inspect by now action action
var buyNow = document.getElementById("buy-now-button");
buyNow.addEventListener("submit", inspectBuyNow, false); 
buyNow.addEventListener("click", inspectBuyNow, false); 

function inspectClicks(event) {
	//console.log(`inspectClicks: ${config.name} `, event);
	try {
		browser.runtime.sendMessage({
			type: "click",
			text: event.target.innerText,
			url: event.target.href});	
	} 
	catch(err) {
		console.log(err);
	}
	
}

function inspectProduct(event) {
	//console.log(`inspectAddToList: ${config.name} `, event);
	item = document.getElementById("productTitle");
	if(!item)
		return;
	title = item.innerText;
	var e = document.getElementById("searchDropdownBox");
	category = e.options[e.selectedIndex].text;
	message = { 
		type: "selectItem",
		category: category,
		title: title
	}
	browser.runtime.sendMessage(message);
}

function inspectAddToList(event) {
	//console.log(`inspectAddToList: ${config.name} `, event);
	var e = document.getElementById("searchDropdownBox");
	category = e.options[e.selectedIndex].text;
	title = document.getElementById("productTitle").innerText;
	message = { 
		type: "addToList",
		category: category,
		title: title
	}
	browser.runtime.sendMessage(message);
}

function inspectAddToCart(event) {
	//console.log(`inspectRequest: ${config.name} `, event);
	var e = document.getElementById("searchDropdownBox");
	category = e.options[e.selectedIndex].text;
	title = document.getElementById("productTitle").innerText;
	message = { 
		type: "addToCart",
		category: category,
		title: title
	}
	browser.runtime.sendMessage(message);
}

function inspectBuyNow(event) {
	//console.log(`inspectRequest: ${config.name} `, event);
	var e = document.getElementById("searchDropdownBox");
	category = e.options[e.selectedIndex].text;
	title = document.getElementById("productTitle").innerText;
	message = { 
		type: "buyNow",
		category: category,
		title: title
	}
	browser.runtime.sendMessage(message);	
}