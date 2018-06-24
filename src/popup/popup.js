var ppPopup = {
	/**
	 * Declare global vars
	 */
	vars : {
		buttons : document.querySelectorAll('#buttons div.panel-section-tabs-button'),
		panels : document.querySelectorAll('#panels>div'),
		lists : document.querySelectorAll('#panels>div>.panel-section-list'),
		defaultFavicon : browser.extension.getURL('icons/logo.svg'),
	},

	/**
	 * Functions
	 */
	fn : {
		deselectAll : function () {
			for (let i = 0; i < ppPopup.vars.buttons.length; i++) {
				ppPopup.vars.buttons[i].classList.remove('select');
			}
			for (let i = 0; i < ppPopup.vars.panels.length; i++) {
				ppPopup.vars.panels[i].classList.add('hidden');
			}
		},

		selectOne : function (e) {
			let el = e.currentTarget;
			ppPopup.fn.deselectAll();
			el.classList.add('select');
			ppPopup.vars.panels[el.dataset.index].classList.remove('hidden');
		},

		populateList : (item, tabs, info) => {
			let html = '';
			
			for (let i = 0; i < tabs.length; i++) {
				html += '<div class="panel-list-item" data-id="' + tabs[i].id + '" data-type="' + item.classList.type + '">' + 
							'<img src="' + (tabs[i].favIconUrl ? tabs[i].favIconUrl : ppPopup.vars.defaultFavicon) + '" alt="" class="icon" />' + 
							'<div class="text">' + tabs[i].title + '</div>' + 
						'</div>';
			}
			item.innerHTML = html;

			let listItems = item.querySelectorAll('div.panel-list-item');

			for (var i = 0; i < listItems.length; i++) {
				listItems[i].addEventListener('click', e => {
					let el = e.currentTarget,
						id = el.dataset.id ? parseInt(el.dataset.id) : 0,
						moveTab = 'normal' === item.dataset.type ? pplib.action.toPopup : pplib.action.toWindow;

					moveTab(null,{id: id});
					setTimeout(ppPopup.fn.resetLists, 300)
				});
			}
		},

		resetLists : function(){
			for (var i = 0; i < ppPopup.vars.lists.length; i++) {
				browser.tabs.query({windowType : ppPopup.vars.lists[i].dataset.type})
					.then( ppPopup.fn.populateList.bind(null, ppPopup.vars.lists[i]));
			}
		}
	}
}


/**
 * addEventListeners
 */

for (let i = 0; i < ppPopup.vars.buttons.length; i++) {
	ppPopup.vars.buttons[i].addEventListener('click', ppPopup.fn.selectOne)
}


/**
 * Populate lists
 */
ppPopup.fn.selectOne({currentTarget : ppPopup.vars.buttons[0]});
ppPopup.fn.resetLists();