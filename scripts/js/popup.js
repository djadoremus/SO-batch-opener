// refs - http://stackoverflow.com/questions/11996053/detect-a-button-click-in-the-browser-action-form-of-a-google-chrome-extension


document.addEventListener('DOMContentLoaded', 
	function () {
		init();
	}
);

var init = function(){
	//authorize user, once authorized - move code block there.
	var so_open_tickets = document.getElementById("so_open_tickets");
	so_open_tickets.value = "Open Tickets";
	so_open_tickets.addEventListener("click", function(e){
		var req = new XMLHttpRequest();
		req.open("GET", "https://api.stackexchange.com/2.2/questions?order=desc&sort=creation&tagged=firebase&site=stackoverflow",true);
		req.onreadystatechange = function(){
			if (req.readyState == 4){
				console.log("wut");
				console.log(req.responseText);
				var result = JSON.parse(req.responseText);
				console.log(result.items.length);
				var windowId = 1000;
				for (var i=0; i<result.items.length; i++){
					console.log(result.items[i].link);
					chrome.tabs.create({url:result.items[i].link, active:false}, function(tab){
						//tab.url = result.items[i].link;
					});
				}
				alert("opened " + result.items.length + " tickets");
			}
		};
		req.send();
	});
};

