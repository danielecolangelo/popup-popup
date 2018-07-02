var ppPopup = {
	/**
	 * Declare global vars
	 */
	vars : {
		listPopups : document.querySelector('#list-popups'),
		currentTab : document.querySelector('#current-tab-action'),
		settingsButton : document.querySelector('#settings-button'),
		defaultFavicon : browser.extension.getURL('icons/logo.svg'),
		disabledFavicon : browser.extension.getURL('icons/disabled.svg'),
	},

	/**
	 * Functions
	 */
	fn : {
		populateLists : function(){
			browser.tabs.query({windowType : 'popup'}).then(tabs => {
				ppPopup.vars.listPopups.innerHTML = '';

				for (let i = 0; i < tabs.length; i++) {
					let items = document.createDocumentFragment();

					for (let i = 0; i < tabs.length; i++) {
						let item = document.createElement('div'),
							icon = document.createElement('img'),
							text = document.createElement('div');

						item.classList.add('panel-list-item');
						icon.classList.add('icon');
						text.classList.add('text');

						item.dataset.id = tabs[i].id;
						item.dataset.actiontext = 'Move to a Window ⮯';
						icon.setAttribute('src', tabs[i].favIconUrl ? tabs[i].favIconUrl : ppPopup.vars.defaultFavicon);
						text.innerText = tabs[i].title;

						item.appendChild(icon);
						item.appendChild(text);

						item.addEventListener('click', (e) => {
							let el = e.currentTarget,
								id = el.dataset.id ? parseInt(el.dataset.id) : 0,
								promise = pplib.action.toWindow(null,{id: id});

							promise.then( (tabs) => {
								ppPopup.fn.populateLists();
							})
						});

						items.appendChild(item);
					}

					ppPopup.vars.listPopups.innerHTML = '';
					ppPopup.vars.listPopups.appendChild(items);
				}

				if ( tabs.length < 1) {
						let item = document.createElement('div'),
							icon = document.createElement('img'),
							text = document.createElement('div');

						item.classList.add('panel-list-item');
						icon.classList.add('icon');
						text.classList.add('text');

					text.innerText = 'You have no popups';
					icon.setAttribute('src', ppPopup.vars.disabledFavicon);
					
					item.appendChild(icon);
					item.appendChild(text);
					
					ppPopup.vars.listPopups.appendChild(item);
				}
			});
		},
	}
}

/**
 * Settings Button
 */

ppPopup.vars.settingsButton.addEventListener( 'click', (e) => {
	browser.runtime.openOptionsPage();
});

/**
 * Current tab button
 */

ppPopup.vars.currentTab.addEventListener( 'click', (e) => {
	browser.tabs.query({
			active : true,
			currentWindow : true,
		}).then( tabs => {
			if( tabs.length > 0 ){
				console.log(tabs[0])
				pplib.action.toPopup(null,{id: tabs[0].id})
			}
		})
});

/**
 * Populate Popups List
 */

ppPopup.fn.populateLists();