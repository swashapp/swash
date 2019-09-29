console.log("modules/search/manifest.js");
import {AllModules} from '../../modules.js';
var Search = (function() {
    'use strict';
    
    return {
        name: "Search",
        description: "This module Captures a user search queries, search results, and links clicked by the user for top 7 search engines: Google, Bing, Yahoo, AOL, Ask, Baidu, and DuckDuckGo",
        path: "/search",
        URL: ["https://www.google.com","https://search.yahoo.com","https://www.aol.com/","http://www.bing.com/","https://www.ask.com/","http://www.baidu.com/"],
        functions: ["browsing","content"],
		viewGroups: [			
            {
				name: "Google",
				title: "Google Search Engine"
			},
			{
				name: "Yahoo",
				title: "Yahoo Search Engine"
			},
			{
				name: "AOL",
				title: "AOL Search Engine"
			},
			{
				name: "Bing",
				title: "Bing Search Engine"
			},
			{
				name: "Ask",
				title: "Ask Search Engine"
			},
			{
				name: "Baidu",
				title: "Baidu Search Engine"
			},
			{
				name: "DuckDuckGo",
				title: "DuckDuckGo Search Engine"
			}
		],
        is_enabled: true,
        privacy_level: 4,
        status: "enabled",
        icons: ["data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjZweCIgaGVpZ2h0PSIyNnB4IiB2aWV3Qm94PSIwIDAgMjYgMjYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1Ny4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjZEQjM3RDY3LTVCODctNDNGOS1BNDZBLTYxM0JCQjZFNEZDNUAxLjAweDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZyBpZD0iU3dhc2gtVmlld3MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgICAgICAgPGcgaWQ9Ik1vZHVsZS1TdGF0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1MS4wMDAwMDAsIC0yMzEuMDAwMDAwKSIgc3Ryb2tlPSIjQ0RDRENEIiBzdHJva2Utd2lkdGg9IjEuNSI+CiAgICAgICAgICAgIDxnIGlkPSJTZWFyY2giIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyOC4wMDAwMDAsIDIwOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJzZWFyY2gtY2lyY2xlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGN4PSIxMiIgY3k9IjEyIiByPSIxMiI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjExLjA2NjY2NjciIGN5PSIxMS4wNjY2NjY3IiByPSI0LjY2NjY2NjY3Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQuMzY2OTMzMywxNC4zNjU4NjY3IEwxNy42LDE3LjYiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==","",""],
        version: 1,
		style: {mainColor:"4285F4", fontColor:"fff"},
		type: "builtin",
        contextAttributes: ["agent", "installedPlugins", "platform", "screenshot"],
        streamId: "CFkiERmsTxyV1-AGDjL9Tw",
        apiKey: "3bKwyq-gTwyZa02V_YaMrwbTUZvyZNS-Wx_OP8-oi45g",
		is_verified: false		
    };
}());
AllModules.push(Search);
export {Search};