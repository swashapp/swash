console.log("modules/facebook/manifest.js");
import {AllModules} from '../../modules.js';
var Facebook = (function() {
    'use strict';
    
    return {
        name: "Facebook",
        description: "This module looks through all activities of a user on Facebook and captures those activities that the user has permitted",
        path: "/facebook",
        URL: ["https://www.facebook.com"],
		viewGroups: [
			{
				name: "UX",
				title: "User Experience"
			},
			{
				name: "API",
				title: "Facebook API"
			}
		],
        functions: ["browsing", "apiCall"],
        is_enabled: false,
        privacy_level: 3,
        status: "enabled",
        icons: ["",data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1Ny4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPkIyRkRFOTg2LTZCNTgtNDUzMC05RjlDLTdEOEVBMjdENDFCNUAxLjAweDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZyBpZD0iU3dhc2gtVmlld3MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNYWluLVZpZXctRmFjZWJvb2stb3BlbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQyNC4wMDAwMDAsIC0xMjQwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAtOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDAwLjAwMDAwMCwgODQzLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IkJyb3dzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM3My4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuMDAwMDAwLCAyNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTMiIGZpbGw9IiNDRENEQ0QiIGN4PSIxMiIgY3k9IjEyIiByPSIxMiI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNC40Mjc5NSw3LjAwNTc2ODQ0IEMxMy40OTg0NjkxLDcuMDA1NzY4NDQgMTMuMjI5MTAxOSw3LjQzNzk3NDkxIDEzLjIyOTEwMTksOC4zODgzMzM2NiBMMTMuMjI5MTAxOSw5Ljk2NTI3NzQ0IEwxNS43MDg5OTM1LDkuOTY1Mjc3NDQgTDE1LjQ2MTEzMTksMTIuNTE1MjU3NSBMMTMuMjI5MTAxOSwxMi41MTUyNTc1IEwxMy4yMjkxMDE5LDIwLjI1IEwxMC4yNTM2NjkzLDIwLjI1IEwxMC4yNTM2NjkzLDEyLjUxNTI1NzUgTDguMjUsMTIuNTE1MjU3NSBMOC4yNSw5Ljk2NTI3NzQ0IEwxMC4yNTM2NjkzLDkuOTY1Mjc3NDQgTDEwLjI1MzY2OTMsOC40MzEyMTEyOCBDMTAuMjUzNjY5Myw1Ljg2MTAzMTEyIDExLjI0NTg0NDcsNC41IDE0LjAxNDYwNDQsNC41IEMxNC42MTQwMjg1LDQuNSAxNS4zMTYwNiw0LjU0Mjg3NzYzIDE1Ljc1LDQuNjA3NDc5OTEgTDE1Ljc1LDcuMDA1NzY4NDQiIGlkPSJGaWxsLTE0IiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",""],
        version: 1,
        changelog: [],
		style: {mainColor:"29487D", fontColor:"fff"},
		type: "builtin",
        streamId: "QNd64f8uTX-zZNlz8gXqZw",
        apiKey: "WWRhZpD5SYW3lZd5yUwidgpYcmKfrKRfKWRDOWbj70Mg",
		is_verified: false
    };
}());
AllModules.push(Facebook);
export {Facebook};