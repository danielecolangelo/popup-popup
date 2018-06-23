/**
 * Declare global vars
 */

var buttons = document.querySelectorAll('#buttons div.panel-section-tabs-button'),
	panels = document.querySelectorAll('#panels>div'),
	lists = document.querySelectorAll('#panels>div>.panel-section-list'),
	defaultFavicon = browser.extension.getURL('icons/logo.svg');

/**
 * Functions
 */

var deselectAll = function () {
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].classList.remove('select');
	}
	for (let i = 0; i < panels.length; i++) {
		panels[i].classList.add('hidden');
	}
}

var selectOne = function (e) {
	let el = e.currentTarget;
	deselectAll();
	el.classList.add('select');
	panels[el.dataset.index].classList.remove('hidden');
}

var populateList = (item, tabs, info) => {
	let html = '';
	
	for (let i = 0; i < tabs.length; i++) {
		html += '<div class="panel-list-item" data-id="' + tabs[i].id + '" data-type="' + item.classList.type + '">' + 
					'<img src="' + (tabs[i].favIconUrl ? tabs[i].favIconUrl : defaultFavicon) + '" alt="" class="icon" />' + 
					'<div class="text">' + tabs[i].title + '</div>' + 
				'</div>';
	}
	item.innerHTML = html;

	let listItems = item.querySelectorAll('div.panel-list-item');

	for (var i = 0; i < listItems.length; i++) {
		listItems[i].addEventListener('click', e => {
			let el = e.currentTarget,
				id = el.dataset.id ? parseInt(el.dataset.id) : 0,
				moveTab = 'normal' === item.dataset.type ? moveToPopup : moveToWindow;

			moveTab(null,{id: id});
			setTimeout(resetLists, 300)
			// resetLists();
		});
	}
}

var resetLists = function(){
	for (var i = 0; i < lists.length; i++) {
		browser.tabs.query({windowType : lists[i].dataset.type})
			.then( populateList.bind(null, lists[i]));
	}
}

/**
 * addEventListeners
 */

for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', selectOne)
}


/**
 * Populate lists
 */
selectOne({currentTarget : buttons[0]});
resetLists();

/*

browser.tabs.query({windowType : 'normal'}).then( tabs => {
	let html = '';
	for (let i = 0; i < tabs.length; i++) {
		html += templateTab(tabs[i])
	}
	listNormal.innerHTML = html;
});

browser.tabs.query({windowType : 'popup'}).then( tabs => {
	let html = '';
	for (let i = 0; i < tabs.length; i++) {
		html += templateTab(tabs[i])
	}
	listPopup.innerHTML = html;
});

*/