// refs - http://stackoverflow.com/questions/11996053/detect-a-button-click-in-the-browser-action-form-of-a-google-chrome-extension

document.addEventListener('DOMContentLoaded', 
	function () {
		init();
	}
);

/*
TODO:
	- configurable setting (order, sort, tags, site, pagesize)
		- done; chrome storage needed to retrieve saved preferences
	- Observer mode - only open tickets after specified ID (set default check after 5 mins)

*/
var configObj = {};

var init = function(){
	//authorize user, once authorized - move code block there. -> 11/24/2016 [Ado] I forgot what this is about
	var so_open_tickets = document.getElementById("so_open_tickets");
	so_open_tickets.value = "Open Tickets";
	so_open_tickets.addEventListener("click", function(e){
		var url = "https://api.stackexchange.com/2.2/questions?";
		url += "order=" + configObj._order + "&";
		url += "sort=" + configObj._sort + "&";
		url += "tagged=" + configObj._tags + "&";
		url += "site=" + configObj._site + "&";
		url += "pagesize=" + configObj._pagesize;

		console.log("url " + url);
		var req = new XMLHttpRequest();
		req.open("GET", url,true);
		req.onreadystatechange = function(){
			if (req.readyState == 4){
				//console.log(req.responseText);
				var result = JSON.parse(req.responseText);
				//console.log(result.items.length);
				var windowId = 1000;
				var totalOpen = 0;

				/*
				 * TODO: JsonArrays are unordered list (similar to Lists in java; aside from LinkedList), meaning data retrieved (even if there's a sort parameter) can still be randomly placed. Create sorting based on creation_date or items
				 */
				var sorted = bubbleSort(result.items);
				for (var i=0; i<sorted.length; i++){
					console.log(result.items[i].question_id + " | " + configObj.afterTicket + " | " + result.items[i].creation_date + " | " + (new Date(result.items[i].creation_date * 1000)));
					console.log("" + (result.items[i].question_id != configObj.afterTicket));
					if (result.items[i].question_id != configObj.afterTicket){
						chrome.tabs.create({url:result.items[i].link, active:false}, function(tab){
							//tab.url = result.items[i].link;
						});
						totalOpen++;
					} else {
						chrome.tabs.create({url:result.items[i].link, active:false}, function(tab){
							//tab.url = result.items[i].link;
						});
						totalOpen++;
						break;					
					}
				}
				alert("opened " + totalOpen + " tickets");
				configObj.afterTicket = ""+result.items[0].question_id;
			}
		};
		req.send();
	});

	var _order = document.getElementById("config_order");
	var _sort = document.getElementById("config_sort");
	var _tags = document.getElementById("config_tags");
	var _site = document.getElementById("config_site");
	var _pagesize = document.getElementById("config_pagesize");
	var _refresh = document.getElementById("config_refresh");
	var _afterTicket = document.getElementById("config_afterTicket");

	//default values
	_order.value = "desc";
	_tags.value = "firebase";
	_site.value = "stackoverflow";
	_pagesize.value = 10;
	_refresh.value = 5;
	_afterTicket.value = 40776844;

	
	var config_save = document.getElementById("config_save");
	config_save.addEventListener("click", function(e){
		configObj._order = _order.options[_order.selectedIndex].value;
		configObj._sort = _sort.options[_sort.selectedIndex].value;
		configObj._tags = _tags.value;
		configObj._site = _site.value;
		configObj._pagesize = _pagesize.value;
		configObj._refresh = _refresh.value;
		configObj.afterTicket = _afterTicket.value;


		console.log(JSON.stringify(configObj));
		/*
		 * TODO: Chrome Storage for Config Object
		 */
	});
	config_save.click();
};

var bubbleSort = function(items){
	console.log("bubbleSort items length " + items.length);
	var sorted = [];

	for (var i=0; i<items.length; i++){
		for (var j=0; j<items.length; j++){
			var nextIdx = j+1 == items.length ? items.length-1 : j+1;

			var current = items[j];
			var next = items[nextIdx];

			if (next.creation_date > current.creation_date){
				items[j] = next;
				items[nextIdx] = current;
			}
		}
	}

	return items;
}
