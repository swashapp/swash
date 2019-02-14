Youtube.apiCall = [
	{
		name: "recentActivities",
		description: "",
		method: "GET",
		URI: "/activities/",
        bearer: true,
		content_type: "application/x-www-form-urlencoded",
        permissions: [],
		params:{
			mine: true,
            maxResults: 50,
            part: "snippet,contentDetails"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json);
				});
			});
		}
	},
    {
		name: "myChannels",
		description: "",
		method: "GET",
		URI: "/channels/",
        bearer: true,
		content_type: "application/x-www-form-urlencoded",
        permissions: ["https://www.googleapis.com/auth/youtubepartner-channel-audit"],
		params:{
			mine: true,
            part: "snippet,contentDetails,statistics"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json);
				});
			});
		}
	},
    {
		name: "channelsManagedByMe",
		description: "",
		method: "GET",
		URI: "/channels/",
        bearer: true,
		content_type: "application/x-www-form-urlencoded",
        permissions: ["https://www.googleapis.com/auth/youtubepartner-channel-audit"],
		params:{
			managedByMe: true,
            part: "snippet,contentDetails,statistics"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json);
				});
			});
		}
	},
    {
		name: "channelSections",
		description: "",
		method: "GET",
		URI: "/channelSections/",
        bearer: true,
		content_type: "application/x-www-form-urlencoded",
        permissions: [],
		params:{
			mine: true,
            part: "snippet,contentDetails"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json);
				});
			});
		}
	},
    {
		name: "myPlaylists",
		description: "",
		method: "GET",
		URI: "/playlists/",
        bearer: true,
		content_type: "application/x-www-form-urlencoded",
        permissions: [],
		params:{
			mine: true,
            part: "snippet,contentDetails"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json);
				});
			});
		}
	},
    {
		name: "mySubscriptions",
		description: "",
		method: "GET",
		URI: "/subscriptions/",
        bearer: true,
		content_type: "application/x-www-form-urlencoded",
        permissions: [],
		params:{
			mine: true,
            part: "snippet,contentDetails"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json);
				});
			});
		}
	},
    {
		name: "myLikedVideos",
		description: "",
		method: "GET",
		URI: "/videos/",
        bearer: true,
		content_type: "application/x-www-form-urlencoded",
        permissions: [],
		params:{
			myRating: "like",
            part: "snippet,contentDetails,statistics"
		},
		response_type: "json",
		verifyResponse(response) {
			return new Promise((resolve, reject) => {
				if (response.status != 200) {
					reject("Token validation error");
				}
				response.json().then((json) => {					
					resolve(json);
				});
			});
		}
	}
];

/*

function gCall(apiInfo)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		return apiCall(endpoint, apiInfo, access_token).then(apiInfo.verifyResponse).then(resp => console.log(resp));				
	})
}

function gListCall(apiInfoList)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		for(apiInfo of apiInfoList)
		{			
			apiCall(endpoint, apiInfo, access_token).then(apiInfo.verifyResponse).then(resp => console.log(resp));				
		}
	})	
}

function gBatchCall(apiInfoList)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		var batch = [];
		for(apiInfo of apiInfoList)
		{
			switch(apiInfo.method)
			{
				case "GET":
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI.concat("?", serialize(apiInfo.params))			
					}	
					break;
				case "POST":    
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI,
						body: serialize(apiInfo.params)
					}
					break;
				default:
			}
			batch.push(item);			
		}
		aInfo = {
			method: "POST",
			URI: "/",
			content_type: "application/x-www-form-urlencoded",
			params: {
				batch: JSON.stringify(batch)
			}
		}
		apiCall(endpoint, aInfo, access_token).then(verifyBatchResponse).then(resp => console.log(resp));				
	})	
}

function verifyBatchResponse(response) {
	return new Promise((resolve, reject) => {
		if (response.status != 200) {
			reject("Token validation error");
		}
		response.json().then((json) => {				
			resolve(json);
		});
	});	
}
*/