console.log("Browsing.js");
import {StorageHelper} from './StorageHelper.js';
import {Utils} from './Utils.js';
import {DataHandler} from './DataHandler.js';

var Browsing = (function() {
    'use strict';
    
    var callbacks = {};
    
    function inspectStatusCode(moduleName, data, requestDetails) {
        
    }
    function inspectReferrer(moduleName, data, requestDetails) {
        //console.log(`inspectRequest: ${config.name} `, requestDetails);
        if(requestDetails.type != "main_frame" || !requestDetails.originUrl)
            return;
        console.log(requestDetails.url, requestDetails.originUrl);
        let message = {
            origin: requestDetails.originUrl,
			header:{
				function: "browsing",
				module: moduleName,
				collector: data.name
			},
			data: {
				out: {
					url: requestDetails.url,
					originUrl: requestDetails.originUrl		                                                
				},
				schems: [
					{jpath:"$.url",type:"url"},
					{jpath:"$.originUrl",type:"url"}
				]                    
			}  
		}			
		return message; 
	}

    function inspectVisit(moduleName, data, requestDetails) {
        //console.log(`inspectRequest: ${config.name} `, requestDetails);
        if(requestDetails.type != "main_frame" || !requestDetails.originUrl)
            return;		
        let message = {
            origin: requestDetails.originUrl,
			header:{
				function: "browsing",
				module: moduleName,
				collector: data.name
			},			
			data:{
				out: {
					url: requestDetails.url,
				},
				schems: [
					{jpath:"$.url",type:"url"},
				]
			}				
		}
        return message;
    }
    
	function inspectRequest_patterns(moduleName, data, requestDetails) {        
        for(var patt of data.patterns){
            var d = inspectRequest_pattern(moduleName, data.name, patt, requestDetails)
            if(d!=null && Object.keys(d).length >0 ){
                // we suppose one of the methods will return a value                
                return d
            }
        }
    }
    
    function inspectRequest_pattern(moduleName, data_name, patt, requestDetails) {
        if(requestDetails.method != patt.method){
            return null;
        }
        var failed = true;
        if(patt.pattern_type === "regex"){
            var res = requestDetails.url.match(patt.url_pattern);
            if(res!= null) 
            {
                console.log(requestDetails.url, patt);
                failed = false;
            }
        }
        if(patt.pattern_type === "wildcard"){
            var res = Utils.wildcard(requestDetails.url, patt.url_pattern);
            if(res != null) 
                failed = false;
        }
        if(patt.pattern_type === "exact"){
            if(requestDetails.url == patt.url_pattern){
                failed = false;
            }
        }
        if(!failed){
            var retval = {};
            patt.param.forEach(p => {
                var val = null;
                if(p.type === "regex"){
                    val = decodeURIComponent(res[p.group]);
                }
                if(p.type === "form"){
                    val = decodeURIComponent(requestDetails.requestBody.formData[p.key]);
                }
                if(p.type === "query"){
                    val = decodeURIComponent((new URL(requestDetails.url)).searchParams.get(p.key));
                }
                if(val){
                    retval[p.name] = val
                }else{
                    if(p.default){
                        retval[p.name] = p.default
                    }
                }
            });
            if(Object.keys(retval).length == 0)
                return;
            let message = {
                origin: requestDetails.originUrl,
				header:{
					function: "browsing",
					module: moduleName,
					collector: data_name
				},							
				data: {					
                        out: retval,
                        /*schems: [
                            {jpath:"$.query",type:"text"},
                            {jpath:"$.category",type:"text"},
                        ]*/
						schems: patt.schems
				}
            }
            return message;
        }
        return null;
    }
    
    
    

    function load(){
        StorageHelper.retrieveModules().then(modules => {for(var module in modules) {
            if(modules[module].is_enabled)
                load_module(modules[module]);
        }});
    }
	
	function unload(){        
        StorageHelper.retrieveModules().then(modules => {for(var module in modules){
            unload_module(modules[module]);
        }});
    }
	
	function load_module(module){
       if(module.functions.includes("browsing")){
            module.browsing.forEach(data=>{
                if(data.is_enabled)
                {
					load_collector(module, data)
                }                
            });
        }
    }

    function unload_module(module){
        if(module.functions.includes("browsing")){
            module.browsing.forEach(data=>{    
				if(callbacks[module.name+ "_" + data.name]) {
					unload_collector(module, data)
				}
            });
        }
    }

	
	function load_collector(module, data) {
        data.hook = data.hook?data.hook:"webRequest";
        switch(data.hook) {
            case "webRequest":
                hook_webrequest(module,data)
                break;
            case "bookmarks":
                hook_bookmarks(module,data)
                break;
            case "response":
                hook_response(module,data)
                break;
        };
                           
	}

	function unload_collector(module, data) {
        data.hook = data.hook?data.hook:"webRequest";
        switch(data.hook) {
            case "webRequest":
                if(browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
                    browser.webRequest.onBeforeRequest.removeListener(callbacks[module.name+ "_" + data.name]);
                }
                break;
            case "bookmarks":
                if(browser.bookmarks.onCreated.hasListener(inspectBookmark)){
                    browser.bookmarks.onCreated.removeListener(inspectBookmark);
                }
                if(browser.bookmarks.onChanged.hasListener(inspectOnChangeBookmark)){
                    browser.bookmarks.onChanged.removeListener(inspectOnChangeBookmark);
                }
                break;
            case "response":
                if(browser.webRequest.onHeadersReceived.hasListener(inspectResponse)){
                    browser.webRequest.onHeadersReceived.removeListener(inspectResponse);
                }        
                break;            
        }
	}    
	

	function hook_webrequest(module,data){
        callbacks[module.name + "_" + data.name] = function(x){
            let local_data = data;
            let retval = null;
            if(!local_data.target_listener || local_data.target_listener == "inspectRequest")
                retval = inspectRequest_patterns(module.name, local_data, x)
            if(local_data.target_listener == "inspectReferrer")
                retval = inspectReferrer(module.name, local_data, x)
            if(local_data.target_listener == "inspectVisit")
                retval = inspectVisit(module.name, local_data, x)
            if(retval != null)
                DataHandler.handle(retval);
        };
        if(!browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
            // default for filter and extraInfo
            let filter = data.filter?data.filter:module.browsing_filter
            let extraInfoSpec = data.extraInfoSpec?data.extraInfoSpec:module.browsing_extraInfoSpec
            browser.webRequest.onBeforeRequest.addListener(callbacks[module.name+ "_" + data.name], filter, extraInfoSpec);
        }
    }
    
    function hook_bookmarks(module,data){
        var inspectBookmark = function(id, bookmark){
            DataHandler.handle({
                origin: bookmark.url,
                header:{
                    function: "browsing",
                    module: module.name,
                    collector: "Create Bookmark"                                
                },
                data: {
                    out: {
                        bookmark: bookmark
                    },
                    schems: [					
                        {jpath: "$.bookmark.id", type: "id"},
						{jpath: "$.bookmark.parentId", type: "id"},
						{jpath: "$.bookmark.title", type: "text"},
						{jpath: "$.bookmark.dateAdded", type: "date"},
						{jpath: "$.bookmark.url", type: "url"}
                    ]
				}
            });
        }
        if(!browser.bookmarks.onCreated.hasListener(inspectBookmark)){
            browser.bookmarks.onCreated.addListener(inspectBookmark);
        }

        var inspectOnChangeBookmark = function(id, changeInfo){
			changeInfo.id = id;
            DataHandler.handle({
                origin: changeInfo.url,
                header:{
                    function: "browsing",
                    module: module.name,
                    collector: "Create Bookmark"                                
                },
                data: {
                    out: {
                        bookmark: changeInfo
                    },
                    schems: [					
						{jpath: "$.bookmark.title", type: "text"},
						{jpath: "$.bookmark.url", type: "url"},
						{jpath: "$.bookmark.id", type: "id"}
						
                    ]
				}
            });
        }
        if(!browser.bookmarks.onChanged.hasListener(inspectOnChangeBookmark)){
            browser.bookmarks.onChanged.addListener(inspectOnChangeBookmark);
        }
		
		
    }
    
    function hook_response(module,data) {
        
        var inspectResponse = function(details){
            let local_data = data;
            let matched = false;
            for(let pattern of local_data.pattern)
            {
                if(details.statusCode == pattern.statusCode) {
                    matched = true;
                    break;
                }
            }
            if(matched) {
                DataHandler.handle({
                    origin: details.url,
                    header:{
                        function: "browsing",
                        module: module.name,
                        collector: local_data.name                               
                    },
                    data: {
                        out: {
                            statusCode: details.statusCode,
                            url: details.url
                        },
                        schems: [					
                            {jpath: "$.statusCode", type: "text"},
                            {jpath: "$.url", type: "url"},
                        ]
                    }
                });                
            }
        }
        if(!browser.webRequest.onHeadersReceived.hasListener(inspectResponse)){
            let filter = data.filter?data.filter:module.browsing_filter
            browser.webRequest.onHeadersReceived.addListener(inspectResponse, filter);
        }        
    }
    
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module
    };
}());
export {Browsing};