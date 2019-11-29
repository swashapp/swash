console.log("modules/search/manifest.js");
import {allModules} from '../../modules.js';
var search = (function() {
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
				title: "Google"
			},
			{
				name: "Yahoo",
				title: "Yahoo"
			},
			{
				name: "AOL",
				title: "AOL"
			},
			{
				name: "Bing",
				title: "Bing"
			},
			{
				name: "Ask",
				title: "Ask"
			},
			{
				name: "Baidu",
				title: "Baidu"
			},
			{
				name: "DuckDuckGo",
				title: "DuckDuckGo"
			}
		],
        is_enabled: true,
		privacy_level: 2,
		style: 'dropbox',
        status: "enabled",
        icons: ["data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjZweCIgaGVpZ2h0PSIyNnB4IiB2aWV3Qm94PSIwIDAgMjYgMjYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1OCAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT45NzgzRDk3NS04OUEwLTRGQTAtQjYxRC1GRTRCRkY0RDY0QkJAMS4wMHg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGcgaWQ9IlN3YXNoLVZpZXdzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgIDxnIGlkPSJNYWluLVZpZXctU2VhcmNoLW9wZW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MjMuMDAwMDAwLCAtMTE1MS4wMDAwMDApIiBzdHJva2U9IiMzMjMyMzIiIHN0cm9rZS13aWR0aD0iMS41Ij4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwMC4wMDAwMDAsIDg0My4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJTZWFyY2giIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAyODUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNlYXJjaC1jaXJjbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0LjAwMDAwMCwgMjQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGN4PSIxMiIgY3k9IjEyIiByPSIxMiI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGN4PSIxMS4wNjY2NjY3IiBjeT0iMTEuMDY2NjY2NyIgcj0iNC42NjY2NjY2NyI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNC4zNjY5MzMzLDE0LjM2NTg2NjcgTDE3LjYsMTcuNiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==","data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjZweCIgaGVpZ2h0PSIyNnB4IiB2aWV3Qm94PSIwIDAgMjYgMjYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1OCAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT42REIzN0Q2Ny01Qjg3LTQzRjktQTQ2QS02MTNCQkI2RTRGQzVAMS4wMHg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGcgaWQ9IlN3YXNoLVZpZXdzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgIDxnIGlkPSJNb2R1bGUtU3RhdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTEuMDAwMDAwLCAtMjMxLjAwMDAwMCkiIHN0cm9rZT0iI0NEQ0RDRCIgc3Ryb2tlLXdpZHRoPSIxLjUiPgogICAgICAgICAgICA8ZyBpZD0iU2VhcmNoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjguMDAwMDAwLCAyMDguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ic2VhcmNoLWNpcmNsZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuMDAwMDAwLCAyNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGN4PSIxMS4wNjY2NjY3IiBjeT0iMTEuMDY2NjY2NyIgcj0iNC42NjY2NjY2NyI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjM2NjkzMzMsMTQuMzY1ODY2NyBMMTcuNiwxNy42IiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",""],
        version: 1,		
		type: "builtin",
        contextAttributes: ["agent", "installedPlugins", "platform", "screenshot"],
		is_verified: false		
    };
}());
allModules.push(search);
export {search};