console.log("modules/youtube/manifest.js");
import {AllModules} from '../../modules.js';
var Youtube = (function() {
    'use strict';
    
    return {
        name: "Youtube",
        description: "This module looks through all activities of a user on Youtube and captures those activities that the user has permitted",
        path: "/youtube",
        URL: ["https://www.youtube.com"],
        functions: ["content" ,"browsing", "apiCall"],
		viewGroups: [
			{
				name: "UX",
				title: "User Experience"
			},
			{
				name: "API",
				title: "Youtube API"
			}
		],
        is_enabled: false,
        privacy_level: 3,        
        status: "enabled",
        icons: ["","data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMjQgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1Ny4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjkxMjIyMkExLUFFQzctNDA0Mi1BOEYzLUVBOTg4NDIxQkEyN0AxLjAweDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZyBpZD0iU3dhc2gtVmlld3MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNYWluLVZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MjQuMDAwMDAwLCAtMTQxOS4wMDAwMDApIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDAwLjAwMDAwMCwgODQ0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IllvdXR1YmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA1NDguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IllvdXR1YmUtZGlzYWJsZWQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0LjAwMDAwMCwgMjcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMy4zOTAxNjM5LDIuNjE2MzkzNDQgQzIzLjExNDc1NDEsMS41OTM0NDI2MiAyMi4zMDgxOTY3LDAuNzg2ODg1MjQ2IDIxLjI4NTI0NTksMC41MTE0NzU0MSBDMTkuNDE2MzkzNCwwIDExLjk0MDk4MzYsMCAxMS45NDA5ODM2LDAgQzExLjk0MDk4MzYsMCA0LjQ2NTU3Mzc3LDAgMi41OTY3MjEzMSwwLjQ5MTgwMzI3OSBDMS41OTM0NDI2MiwwLjc2NzIxMzExNSAwLjc2NzIxMzExNSwxLjU5MzQ0MjYyIDAuNDkxODAzMjc5LDIuNjE2MzkzNDQgQzAsNC40ODUyNDU5IDAsOC4zNjA2NTU3NCAwLDguMzYwNjU1NzQgQzAsOC4zNjA2NTU3NCAwLDEyLjI1NTczNzcgMC40OTE4MDMyNzksMTQuMTA0OTE4IEMwLjc2NzIxMzExNSwxNS4xMjc4Njg5IDEuNTczNzcwNDksMTUuOTM0NDI2MiAyLjU5NjcyMTMxLDE2LjIwOTgzNjEgQzQuNDg1MjQ1OSwxNi43MjEzMTE1IDExLjk0MDk4MzYsMTYuNzIxMzExNSAxMS45NDA5ODM2LDE2LjcyMTMxMTUgQzExLjk0MDk4MzYsMTYuNzIxMzExNSAxOS40MTYzOTM0LDE2LjcyMTMxMTUgMjEuMjg1MjQ1OSwxNi4yMjk1MDgyIEMyMi4zMDgxOTY3LDE1Ljk1NDA5ODQgMjMuMTE0NzU0MSwxNS4xNDc1NDEgMjMuMzkwMTYzOSwxNC4xMjQ1OTAyIEMyMy44ODIwNjc2LDEyLjI1NTczNzcgMjMuODgyMDY3Niw4LjM4MDMyNzg3IDIzLjg4MjA2NzYsOC4zODAzMjc4NyBDMjMuODgyMDY3Niw4LjM4MDMyNzg3IDIzLjkwMTYzOTMsNC40ODUyNDU5IDIzLjM5MDE2MzksMi42MTYzOTM0NCBaIiBpZD0iUGF0aCIgZmlsbD0iI0NEQ0RDRCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSI5LjU2MDY1NTc0IDExLjk0MDk4MzYgMTUuNzc3MDQ5MiA4LjM2MDY1NTc0IDkuNTYwNjU1NzQgNC43ODAzMjc4NyI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+", ""],
        version: 1,
        changelog: [],
		style: {mainColor:"c4302b", fontColor:"fff"},
		type: "builtin",
        streamId: "2gItuFWsQvyEDpuSdaE9Bw",
        apiKey: "ccXn0lptQNmA6Htu2wNNrQDmEnlphjTq20fxvUV38gLg",
		is_verified: false		
		
    };
}());
AllModules.push(Youtube);
export {Youtube};