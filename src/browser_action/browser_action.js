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

		populateLists : function(){
			for (let index = 0; index < ppPopup.vars.lists.length; index++) {

				let dataType = ppPopup.vars.lists[index].dataset.type,
					dataActionText = ppPopup.vars.lists[index].dataset.actiontext;
				
				browser.tabs.query({windowType : dataType})
					.then( (tabs) => {
						let items = document.createDocumentFragment();
						ppPopup.vars.lists[index].innerHTML = '';

						for (let i = 0; i < tabs.length; i++) {
							let item = document.createElement('div'),
								icon = document.createElement('img'),
								text = document.createElement('div');

							item.classList.add('panel-list-item');
							icon.classList.add('icon');
							text.classList.add('text');

							item.dataset.id = tabs[i].id;
							item.dataset.type = dataType;
							item.dataset.actiontext = dataActionText;

							icon.setAttribute('src', tabs[i].favIconUrl ? tabs[i].favIconUrl : ppPopup.vars.defaultFavicon);

							text.innerText = tabs[i].title;

							item.addEventListener('click', (e) => {
								let el = e.currentTarget,
									id = el.dataset.id ? parseInt(el.dataset.id) : 0,
									moveTab = 'normal' === el.dataset.type ? pplib.action.toPopup : pplib.action.toWindow,
									promise = moveTab(null,{id: id});

								promise.then( (tab) => {
									ppPopup.fn.populateLists();
								})
							});

							item.appendChild(icon);
							item.appendChild(text);

							items.appendChild(item);
						}

						ppPopup.vars.lists[index].appendChild(items);
					} );
			}
		},
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
ppPopup.fn.populateLists();

document.querySelector('#settings-button').addEventListener( 'click', (e) => {
	browser.runtime.openOptionsPage();
});