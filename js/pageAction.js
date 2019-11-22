import {StorageHelper} from './StorageHelper.js';
import {filterUtils} from './filterUtils.js';
var pageAction = (function() {
    async function isDomainFiltered(tabInfo) {
        let domain = new URL(tabInfo.url)
        let f = {
            value: `*://${domain.host}/*`,
            type: 'wildcard',
            internal: false
        };
        let filter = await StorageHelper.retrieveFilters();
        for (let i in filter) {
            if (filter[i].value === f.value && filter[i].type === f.type && filter[i].internal === f.internal) {
                return true;
            }
        }
        return false;
         
    }

    async function isCurrentDomainFiltered() {
        let tabs = await browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT});
        let tab = await browser.tabs.get(tabs[0].id);
        return isDomainFiltered(tab);
    }
    function loadIcons(tabInfo) {
        StorageHelper.retrieveConfigs().then(configs => { if(configs.is_enabled) {
			StorageHelper.retrieveFilters().then(filters => {
					if(filterUtils.filter(tabInfo.url, filters))
						browser.browserAction.setIcon({path: {"38":"icons/mono_mark_38.png", "19":"icons/mono_mark_19.png"}});
					else 
						browser.browserAction.setIcon({path: {"38":"icons/green_mark_38.png", "19":"icons/green_mark_19.png"}});
				});		
			}			
        })              
    }

    async function handleFilter() {
        let tabs = await browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT});
        let tab = await browser.tabs.get(tabs[0].id);
        return isDomainFiltered(tab).then(res => {
            if(res) {
                removeFilter(tab);
                return false;
            }                
            else {
                addFilter(tab);
                return true;
            }
                
        })
    }

    function addFilter(tab) {        
        let domain = new URL(tab.url)        
        if(!domain.host || typeof domain.host ==='undefined' || domain.host === '') {
            return;
        }
        let f = {
            value: `*://${domain.host}/*`,
            type: 'wildcard',
            internal: false
        };
        

        let allow = true;
        StorageHelper.retrieveFilters().then(filter => {
            for (let i in filter) {
                if (filter[i].value === f.value) {
                    allow = false;
                }
            }
            if (allow) {
                filter.push(f);
                StorageHelper.storeFilters(filter).then(res => {
                    loadIcons(tab);                
                })                
            }
        })
    }

    function removeFilter(tab) {
        let domain = new URL(tab.url)
        let f = {
            value: `*://${domain.host}/*`,
            type: 'wildcard',
            internal: false
        };
        if(!f.value || f.value==='undefined') {
            return;
        }

        StorageHelper.retrieveFilters().then(filters => {
            filters = filters.filter(fl => {
                if (fl.value !== f.value || fl.type !== f.type || fl.internal !== f.internal) {
                    return fl;
                }
            })
            
            StorageHelper.storeFilters(filters).then(res => {
                loadIcons(tab);            
            });
            
        })
    }

    return {
        isCurrentDomainFiltered,
        loadIcons,
        handleFilter,
        addFilter,
        removeFilter
    };
            
}());

export {pageAction};