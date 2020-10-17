import {storageHelper} from './storageHelper.js';
import {filterUtils} from './filterUtils.js';
import {browserUtils} from './browserUtils.js';
import {memberManager} from "./memberManager.js";

var pageAction = (function() {
    async function isDomainFiltered(tabInfo) {
        let domain = new URL(tabInfo.url)
        let f = {
            value: `*://${domain.host}/*`,
            type: 'wildcard',
            internal: false
        };
        let filter = await storageHelper.retrieveFilters();
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
    function loadIcons(url) {
        if (memberManager.isJoined() === true) {
            browserUtils.isMobileDevice().then(res => {
                if(!res) {
                    storageHelper.retrieveConfigs().then(configs => {
                        if(configs.is_enabled) {
                        storageHelper.retrieveFilters().then(filters => {
                                if(filterUtils.filter(url, filters))
                                    browser.browserAction.setIcon({path: {"38":"icons/mono_mark_38.png", "19":"icons/mono_mark_19.png"}});
                                else
                                    browser.browserAction.setIcon({path: {"38":"icons/green_mark_38.png", "19":"icons/green_mark_19.png"}});
                            });
                        }
                        else {
                            browser.browserAction.setIcon({path: {"38":"icons/mono_mark_38.png", "19":"icons/mono_mark_19.png"}});
                        }
                    })
                }
            })
        } else {
            browser.browserAction.setIcon({path: {"38":"icons/error_mark_38.png", "19":"icons/error_mark_19.png"}});
        }
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
        storageHelper.retrieveFilters().then(filter => {
            for (let i in filter) {
                if (filter[i].value === f.value) {
                    allow = false;
                }
            }
            if (allow) {
                filter.push(f);
                storageHelper.storeFilters(filter).then(res => {
                    loadIcons(tab.url);                
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

        storageHelper.retrieveFilters().then(filters => {
            filters = filters.filter(fl => {
                if (fl.value !== f.value || fl.type !== f.type || fl.internal !== f.internal) {
                    return fl;
                }
            })
            
            storageHelper.storeFilters(filters).then(res => {
                loadIcons(tab.url);            
            });
            
        })
        
    }

    return {
        isCurrentDomainFiltered,
        loadIcons,
        handleFilter,
        addFilter,
        removeFilter,     
    };
            
}());

export {pageAction};