import {utils} from '../utils.js';
import {allModules} from "../modules.js";
import {loader} from '../loader.js';
import {storageHelper} from '../storageHelper.js';
import {browserUtils} from "../browserUtils.js";
import {configManager} from '../configManager.js';

var onBoardingConfigs =  configManager.get('onboarding');

let onBoarding = (function () {
    let oauthTabId = 0;
    let parentId = 0;
    let obName = '';
    const extId = "authsaz@gmail.com";

    function getCallBackURL(onBoardingName) {
        return "https://callbacks.swashapp.io/" + sha256(extId) + "/" + onBoardingName.toLowerCase();
    }

    function isDbValid(db) {
        return (db && db.configs && db.configs.name && db.configs.name === "Swash");
    }

    async function isNeededOnBoarding() {
        let db = await storageHelper.retrieveAll();
        if (!await loader.isDbCreated(db))
            return true;

        let data = await storageHelper.retrieveOnBoardings();

        if (data == null)
            return true;
        else if (!data.isCompleted)
            return true;

        return false;
    }

    async function isExtensionUpdated() {
        let db = await storageHelper.retrieveAll();
        return isDbValid(db);
    }

    async function submitOnBoarding() {
        let db = await storageHelper.retrieveAll();

        if (!isDbValid(db))
            return false;

        if (!db.onBoardings)
            db.onBoardings = {};

        let currentDate = new Date().toISOString();
        db.onBoardings.isCompleted = true;
        db.onBoardings.completionDate = currentDate;

        await storageHelper.storeAll(db);
        await loader.reload();
		configManager.updateSchedule();		
        return true;
    }

    async function startOnBoarding(onBoardingName, tabId) {
        let db = await storageHelper.retrieveAll();

        if (!await loader.isDbCreated(db)) {
            let db = {onBoardings: {}};
            await storageHelper.storeAll(db);
        }

        parentId = tabId;
        obName = onBoardingName;
        let data = await storageHelper.retrieveOnBoardings();

        if (!browser.tabs.onRemoved.hasListener(handleRemoved)) {
            browser.tabs.onRemoved.addListener(handleRemoved);
        }

        if (!data[onBoardingName] || await getOnBoardingAccessToken(onBoardingName) === "") {
            startOnBoardingOAuth(onBoardingName).then((response) => {
                oauthTabId = response.id;
            });
        } else {
            browser.tabs.sendMessage(
                parentId,
                {onBoarding: obName}
            );
        }
    }

    function handleRemoved(tid, removeInfo) {
        if (oauthTabId === removeInfo.windowId) {
            browser.tabs.onRemoved.removeListener(handleRemoved);
            browser.tabs.sendMessage(
                parentId,
                {onBoarding: obName}
            );
        }
    }

    async function startOnBoardingOAuth(onBoardingName) {
        let filter = {
            urls: [
                "https://callbacks.swashapp.io/*"
            ]
        };
        if (!browser.webRequest.onBeforeRequest.hasListener(extractOnBoardingAccessToken))
            browser.webRequest.onBeforeRequest.addListener(extractOnBoardingAccessToken, filter);
        for (let onBoardingIndex in onBoardingConfigs) {
            if (onBoardingConfigs.hasOwnProperty(onBoardingIndex)) {
                let onBoarding = onBoardingConfigs[onBoardingIndex];
                if (onBoarding.name === onBoardingName) {
                    onBoarding.apiConfig.redirect_url = getCallBackURL(onBoarding.name);
                    let auth_url = `${onBoarding.apiConfig.auth_url}?client_id=${onBoarding.apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(onBoarding.apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(onBoarding.apiConfig.scopes.join(' '))}`
                    if (await browserUtils.isMobileDevice()) {
                        return browser.tabs.create({
                            url: auth_url
                        });
                    }
                    return browser.windows.create({
                        url: auth_url,
                        type: "popup"
                    });
                }
            }
        }
    }

    function extractOnBoardingAccessToken(details) {
        for (let onBoardingIndex in onBoardingConfigs) {
            if (onBoardingConfigs.hasOwnProperty(onBoardingIndex)) {
                let onBoarding = onBoardingConfigs[onBoardingIndex];
                if (details.url.startsWith(getCallBackURL(onBoarding.name))) {
                    let rst = details.url.match(onBoarding.apiConfig.access_token_regex);
                    if (rst) {
                        saveOnBoardingAccessToken(onBoarding, rst[1]);
                    }
                    browser.tabs.remove(details.tabId);
                }
            }
        }
        return null;
    }

    function saveOnBoardingAccessToken(onBoarding, token) {
        let data = {};
        data[onBoarding.name] = {};
        data[onBoarding.name].access_token = token;
        storageHelper.updateOnBoardings(data).then(result => {
        });
    }

    async function getOnBoardingAccessToken(onBoardingName) {
        let confs = await storageHelper.retrieveOnBoardings();
        for (let confIndex in confs) {
            if (confs.hasOwnProperty(confIndex)) {
                let conf = confs[confIndex];
                if (confIndex === onBoardingName) {
                    if (await validateOnBoardingToken(onBoardingName))
                        return conf.access_token;
                    return "";
                }
            }
        }
        return "";
    }

    function purgeOnBoardingAccessToken(onBoardingName) {
        saveOnBoardingAccessToken(onBoardingName, null);
    }

    async function validateOnBoardingToken(onBoardingName) {
        let data = await storageHelper.retrieveOnBoardings();
        let conf = data[onBoardingName];

        for (let onBoardingIndex in onBoardingConfigs) {
            if (onBoardingConfigs.hasOwnProperty(onBoardingIndex)) {
                let onBoarding = onBoardingConfigs[onBoardingIndex];
                if (onBoardingName === onBoarding.name) {
                    return apiCall(onBoarding.validate_token.endpoint, onBoarding.access_token).then(response => {
                        if (response.status !== 200) {
                            purgeOnBoardingAccessToken(onBoarding);
                            return false;
                        }
                        return response.json().then((json) => {
                            let jpointers = JSONPath.JSONPath({path: onBoarding.validate_token.required_jpath, json: json});
                            if (jpointers.length > 0) {
                                return true;
                            } else {
                                purgeOnBoardingAccessToken(onBoarding);
                                return false;
                            }
                        }).catch(error => {
                            purgeOnBoardingAccessToken(onBoarding);
                        });
                    }).catch(error => {
                        purgeOnBoardingAccessToken(onBoarding);
                    });
                }
            }
        }
        return false;
    }

    async function newUserOnBoarding() {
        return loader.install(allModules, null).then(() => {
            loader.reload();
			configManager.updateSchedule();
        });
    }

    function loadFile(file) {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsText(file);
        });
    }

    async function applyConfig(config) {
        let db = JSON.parse(config);

        if (isDbValid(db)) {
            await loader.install(allModules, JSON.parse(config));
            return true;
        }
        return false;
    }

    function createConfigFile(text) {
        return new Blob([text], {type: 'application/octet-stream'});
    }

    async function saveConfig() {
        let db = await storageHelper.retrieveAll();
        let data = createConfigFile(JSON.stringify(db));
        let url = window.URL.createObjectURL(data);
        let currentDate = new Date().toISOString().slice(0, 10);
        browser.downloads.download({url: url, filename: "swash-" + currentDate + ".conf", saveAs: true})
    }

    async function getFilesList(onBoardingName) {
        let data = await storageHelper.retrieveOnBoardings();
        let conf = data[onBoardingName];

        for (let onBoardingIndex in onBoardingConfigs) {
            if (onBoardingConfigs.hasOwnProperty(onBoardingIndex)) {
                let onBoarding = onBoardingConfigs[onBoardingIndex];
                if (onBoardingName === onBoarding.name) {
                    let getListApi = onBoarding.apiCall.listFiles;

                    let response = await apiCall(getListApi, conf.access_token);
                    if (response.status === 200)
                        return response.json();
                    return false;
                }
            }
        }
        return false;
    }

    async function downloadFile(onBoardingName, fileId) {
        let data = await storageHelper.retrieveOnBoardings();
        let conf = data[onBoardingName];

        for (let onBoardingIndex in onBoardingConfigs) {
            if (onBoardingConfigs.hasOwnProperty(onBoardingIndex)) {
                let onBoarding = onBoardingConfigs[onBoardingIndex];
                if (onBoardingName === onBoarding.name) {
                    let getFileApi = onBoarding.apiCall.downloadFile;

                    getFileApi.fileId = fileId;
                    if (onBoardingName === 'GoogleDrive') {
                        getFileApi.params = {
                            'alt': 'media'
                        };
                    }
                    if (onBoardingName === 'DropBox') {
                        getFileApi.headers["Dropbox-API-Arg"] = {
                            path: fileId
                        };
                    }

                    let response = await apiCall(getFileApi, conf.access_token);
                    if (response.status === 200)
                        return response.json();
                    return false;
                }
            }
        }
        return false;
    }

    async function uploadFile(onBoardingName) {
        let data = await storageHelper.retrieveOnBoardings();
        let conf = data[onBoardingName];

        for (let onBoardingIndex in onBoardingConfigs) {
            if (onBoardingConfigs.hasOwnProperty(onBoardingIndex)) {
                let onBoarding = onBoardingConfigs[onBoardingIndex];
                if (onBoardingName === onBoarding.name) {
                    let db = await storageHelper.retrieveAll();
                    let uploadFileApi = onBoarding.apiCall.uploadFile;

                    let currentDate = new Date().toISOString().slice(0, 19);
                    let fileContent = JSON.stringify(db);
                    let file = createConfigFile(fileContent);
                    let metadata = {
                        'name': "swash-" + currentDate + ".conf",
                        'mimeType': 'text/plain'
                    };

                    if (onBoardingName === 'DropBox')
                        uploadFileApi.headers["Dropbox-API-Arg"].path = "/swash-" + currentDate + ".conf";

                    let form = new FormData();
                    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                    form.append('file', file);

                    uploadFileApi.form = form;
                    uploadFileApi.file = fileContent;

                    let response = await apiCall(uploadFileApi, conf.access_token);
                    if (response.status === 200)
                        return response.json();
                    return false;
                }
            }
        }
        return false;
    }

    function apiCall(apiInfo, access_token) {
        let url = apiInfo.URI;
        let req = {
            method: apiInfo.method,
            headers: {
                'Content-Type': apiInfo.content_type
            }
        };
        if (apiInfo.headers) {
            for (let key in apiInfo.headers) {
                if (apiInfo.headers.hasOwnProperty(key)) {
                    req.headers[key] = JSON.stringify(apiInfo.headers[key]);
                }
            }
        }
        if (access_token) {
            if (apiInfo.bearer) {
                req.headers["Authorization"] = "Bearer ".concat(access_token)
            } else {
                apiInfo.params.access_token = access_token;
            }
        }
        let data = "";
        switch (apiInfo.content_type) {
            case "application/x-www-form-urlencoded":
                data = utils.serialize(apiInfo.params);
                break;
            case "application/json":
                data = JSON.stringify(apiInfo.params);
                break;
            case "multipart/form-data":
                delete req.headers["Content-Type"];
                data = apiInfo.form;
                break;
            case "application/octet-stream":
                data = apiInfo.file;
                break;
            default:
                data = utils.serialize(apiInfo.params);

        }

        switch (apiInfo.method) {
            case "GET":
                if (apiInfo.fileId) {
                    url = url.concat("/", apiInfo.fileId);
                }
                url = url.concat("?", data);
                break;
            case "POST":
                req.body = data;
                break;
        }

        return fetch(url, req);
    }

    async function get3BoxSpace(seed) {
        const getConsent = function () {
            return true
        };
        const idWallet = new IdentityWallet(getConsent, {seed});
        const provider = idWallet.get3idProvider();
        const box = await Box.openBox(null, provider);
        return await box.openSpace('Swash');
    }

    async function writeTo3BoxSpace(seed) {
        const space = await get3BoxSpace(seed);

        let db = await storageHelper.retrieveAll();
        delete db.onBoardings['3Box'];
        let data = JSON.stringify(db);
        let currentDate = new Date().toISOString().slice(0, 19);
        return space.private.set("swash-" + currentDate + ".conf", data);
    }

    async function getFrom3BoxSpace(seed) {
        const space = await get3BoxSpace(seed);

        const spaceData = await space.private.all();
        console.log(spaceData);
        return JSON.stringify(spaceData);
    }

    function save3BoxMnemonic(mnemonic) {
        let data = {};
        data['3Box'] = {};
        data['3Box'].mnemonic = mnemonic;
        storageHelper.updateOnBoardings(data).then(result => {
        });
    }

    async function get3BoxMnemonic() {
        let data = await storageHelper.retrieveOnBoardings();
        let conf = data['3Box'];

        if (conf && conf.mnemonic)
            return conf.mnemonic;
        else
            return "";

    }

    function openOnBoarding() {
        let fullURL = browser.extension.getURL("dashboard/index.html#/OnBoarding");

        browser.tabs.create({
            url: fullURL
        });
    }

    return {
        isNeededOnBoarding,
        isExtensionUpdated,
        submitOnBoarding,
        startOnBoarding,
        startOnBoardingOAuth,
        newUserOnBoarding,
        loadFile,
        applyConfig,
        saveConfig,
        getFilesList,
        downloadFile,
        uploadFile,
        openOnBoarding,
        writeTo3BoxSpace,
        getFrom3BoxSpace,
        save3BoxMnemonic,
        get3BoxMnemonic
    };
}());
export {onBoarding};