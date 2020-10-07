import {utils} from './utils.js';
import {loader} from './loader.js';
import {communityHelper} from "./communityHelper.js";
import {storageHelper} from './storageHelper.js';
import {browserUtils} from "./browserUtils.js";
import {configManager} from './configManager.js';

let onboarding = (function () {
    let oauthTabId = 0;
    let oauthWinId = 0;
    let parentId = 0;
    let obName = '';
    const extId = "authsaz@gmail.com";

    let onboardingConfigs;
    let onboardingTools = {};
    let onboardingFlow = {};
    let isOnboardingOpened = false;

    function init() {
        onboardingConfigs = configManager.getConfig('onboarding');
        if (onboardingConfigs) onboardingTools = onboardingConfigs['tools'];
        if (onboardingConfigs) onboardingFlow = onboardingConfigs['flow'];
    }

    function getCallBackURL(onboardingName) {
        return "https://callbacks.swashapp.io/" + sha256(extId) + "/" + onboardingName.toLowerCase();
    }

    function isValidDB(db) {
        return (db && db.profile && db.profile.encryptedWallet);
    }

    async function isNeededOnBoarding() {
        let data = await storageHelper.retrieveOnboarding();
        if (data == null || data.flow == null || !data.completed)
            return true;
        else if (data.flow.version < onboardingFlow.version)
            return true;
        return false;
    }

    async function repeatOnboarding(pages) {
        let data = await storageHelper.retrieveOnboarding();
        if (data && data.completed != null) {
            data.completed = false;
            await storageHelper.storeAll(data);

            for (let page in data.flow.pages) {
                if (data.flow.pages.hasOwnProperty(page)) {
                    if (pages.includes(page))
                        onboardingFlow.pages[page]['visible'] = 'all';
                    else
                        onboardingFlow.pages[page]['visible'] = 'none';
                }
            }
        }
        if (!isOnboardingOpened) openOnBoarding();
    }

    function checkNotExistInDB(currentPage, rule, data) {
        let entities = currentPage.visible['core'][rule].split('.');
        delete currentPage.visible['core'][rule];
        if (entities.length === 0) return true;
        let _data = data;
        for (const entity of entities) {
            if (_data[entity] == null)
                return true;
            _data = _data[entity]
        }
        return false;
    }

    function shouldShowThisPage(currentPage, data) {
        if (typeof currentPage.visible === "object" && currentPage.visible['core'] != null) {
            for (const rule in currentPage.visible['core']) {
                if (currentPage.visible['core'].hasOwnProperty(rule)) {
                    if (rule === 'notExistInDB') {
                        if (!checkNotExistInDB(currentPage, rule, data))
                            return false;
                    }
                }
            }
            delete currentPage.visible['core'];
            if (currentPage.visible['ui'] == null){
                delete currentPage.visible;
                currentPage.visible = 'all';
            }
        }
        return true
    }

    async function getOnboardingFlow() {
        let data = await storageHelper.retrieveAll();
        let result = {...onboardingFlow};
        for (const page in result['pages']){
            if (result['pages'].hasOwnProperty(page)){
                if (!shouldShowThisPage(result['pages'][page], data)) {
                    result['pages'][page]['visible'] = 'none';
                }
            }
        }
        return JSON.stringify(result);
    }

    async function submitOnBoarding() {
        isOnboardingOpened = false;
        await loader.install();
        let db = await storageHelper.retrieveAll();

        if (!isValidDB(db))
            return false;

        if (!db.onboarding)
            db.onboarding = {};
        
        db.onboarding.flow = onboardingFlow;
        db.onboarding.completed = true;

        await storageHelper.storeAll(db);        
        await loader.onInstalled();
        return true;
    }

    async function startOnBoarding(onboardingName, tabId) {
        parentId = tabId;
        obName = onboardingName;
        let data = await storageHelper.retrieveOnboarding();

        if (!browser.tabs.onRemoved.hasListener(handleRemoved)) {
            browser.tabs.onRemoved.addListener(handleRemoved);
        }

        if (!data[onboardingName] || await getOnBoardingAccessToken(onboardingName) === "") {
            startOnBoardingOAuth(onboardingName).then((response) => {
                let tab = response;
                if (response.type === "popup")
                    tab = response.tabs[0];
                oauthTabId = tab.id;
                oauthWinId = tab.windowId;
            });
        } else {
            browser.tabs.sendMessage(
                parentId,
                {onboarding: obName}
            );
        }
    }

    function handleRemoved(tid, removeInfo) {
        if (oauthTabId === tid && oauthWinId === removeInfo.windowId) {
            browser.tabs.onRemoved.removeListener(handleRemoved);
            browser.tabs.sendMessage(
                parentId,
                {onboarding: obName}
            );
        }
    }

    async function startOnBoardingOAuth(onboardingName) {
        let filter = {
            urls: [
                "https://callbacks.swashapp.io/*"
            ]
        };
        if (!browser.webRequest.onBeforeRequest.hasListener(extractOnBoardingAccessToken))
            browser.webRequest.onBeforeRequest.addListener(extractOnBoardingAccessToken, filter);
        for (let onboardingIndex in onboardingTools) {
            if (onboardingTools.hasOwnProperty(onboardingIndex)) {
                let onboarding = onboardingTools[onboardingIndex];
                if (onboarding.name === onboardingName) {
                    onboarding.apiConfig.redirect_url = getCallBackURL(onboarding.name);
                    let auth_url = `${onboarding.apiConfig.auth_url}?client_id=${onboarding.apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(onboarding.apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(onboarding.apiConfig.scopes.join(' '))}`
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
        for (let onboardingIndex in onboardingTools) {
            if (onboardingTools.hasOwnProperty(onboardingIndex)) {
                let onboarding = onboardingTools[onboardingIndex];
                if (details.url.startsWith(getCallBackURL(onboarding.name))) {
                    let rst = details.url.match(onboarding.apiConfig.access_token_regex);
                    if (rst) {
                        saveOnBoardingAccessToken(onboarding, rst[1]);
                    }
                    browser.tabs.remove(details.tabId);
                }
            }
        }
        return null;
    }

    function saveOnBoardingAccessToken(onboarding, token) {
        let data = {};
        data[onboarding.name] = {};
        data[onboarding.name].access_token = token;
        storageHelper.updateOnboarding(data).then(result => {
        });
    }

    async function getOnBoardingAccessToken(onboardingName) {
        let confs = await storageHelper.retrieveOnboarding();
        for (let confIndex in confs) {
            if (confs.hasOwnProperty(confIndex)) {
                let conf = confs[confIndex];
                if (confIndex === onboardingName) {
                    if (await validateOnBoardingToken(onboardingName))
                        return conf.access_token;
                    return "";
                }
            }
        }
        return "";
    }

    function purgeOnBoardingAccessToken(onboardingName) {
        saveOnBoardingAccessToken(onboardingName, null);
    }

    async function validateOnBoardingToken(onboardingName) {
        let data = await storageHelper.retrieveOnboarding();
        let conf = data[onboardingName];

        for (let onboardingIndex in onboardingTools) {
            if (onboardingTools.hasOwnProperty(onboardingIndex)) {
                let onboarding = onboardingTools[onboardingIndex];
                if (onboardingName === onboarding.name) {
                    if (conf.access_token) {
                        let apiInfo = onboarding.validateToken;
                        apiInfo.params = {};
                        apiInfo.params[apiInfo.token_param_name] = conf.access_token;

                        return apiCall(apiInfo, conf.access_token).then(response => {
                            if (response.status !== 200) {
                                purgeOnBoardingAccessToken(onboarding);
                                return false;
                            }
                            return response.json().then((json) => {
                                let jpointers = JSONPath.JSONPath({path: onboarding.validateToken.required_jpath, json: json});
                                if (jpointers.length > 0) {
                                    return true;
                                } else {
                                    purgeOnBoardingAccessToken(onboarding);
                                    return false;
                                }
                            }).catch(error => {
                                purgeOnBoardingAccessToken(onboarding);
                            });
                        }).catch(error => {
                            purgeOnBoardingAccessToken(onboarding);
                        });
                    }
                }
            }
        }

        return false;
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
        const oldDB = JSON.parse(config);

        if (isValidDB(oldDB)) {
            let db = await storageHelper.retrieveAll();
            db.configs.salt = oldDB.configs.salt;
            db.profile.encryptedWallet = oldDB.profile.encryptedWallet;
            await storageHelper.storeAll(db);

            await communityHelper.loadWallet(db.profile.encryptedWallet, db.configs.salt);
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

    async function getFilesList(onboardingName) {
        let data = await storageHelper.retrieveOnboarding();
        let conf = data[onboardingName];

        for (let onboardingIndex in onboardingTools) {
            if (onboardingTools.hasOwnProperty(onboardingIndex)) {
                let onboarding = onboardingTools[onboardingIndex];
                if (onboardingName === onboarding.name) {
                    let getListApi = onboarding.apiCall.listFiles;

                    let response = await apiCall(getListApi, conf.access_token);
                    if (response.status === 200)
                        return response.json();
                    return false;
                }
            }
        }
        return false;
    }

    async function downloadFile(onboardingName, fileId) {
        let data = await storageHelper.retrieveOnboarding();
        let conf = data[onboardingName];

        for (let onboardingIndex in onboardingTools) {
            if (onboardingTools.hasOwnProperty(onboardingIndex)) {
                let onboarding = onboardingTools[onboardingIndex];
                if (onboardingName === onboarding.name) {
                    let getFileApi = onboarding.apiCall.downloadFile;

                    getFileApi.fileId = fileId;
                    if (onboardingName === 'GoogleDrive') {
                        getFileApi.params = {
                            'alt': 'media'
                        };
                    }
                    if (onboardingName === 'DropBox') {
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

    async function uploadFile(onboardingName) {
        let data = await storageHelper.retrieveOnboarding();
        let conf = data[onboardingName];

        for (let onboardingIndex in onboardingTools) {
            if (onboardingTools.hasOwnProperty(onboardingIndex)) {
                let onboarding = onboardingTools[onboardingIndex];
                if (onboardingName === onboarding.name) {
                    let db = await storageHelper.retrieveAll();
                    let uploadFileApi = onboarding.apiCall.uploadFile;

                    let currentDate = new Date().toISOString().slice(0, 19);
                    let fileContent = JSON.stringify(db);
                    let file = createConfigFile(fileContent);
                    let metadata = {
                        'name': "swash-" + currentDate + ".conf",
                        'mimeType': 'text/plain'
                    };

                    if (onboardingName === 'DropBox')
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
        delete db.onboarding['3Box'];
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
        storageHelper.updateOnboarding(data).then(result => {
        });
    }

    async function get3BoxMnemonic() {
        let data = await storageHelper.retrieveOnboarding();
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
        isOnboardingOpened = true;
    }

    async function saveProfileInfo(gender, age, income) {
        let data = await storageHelper.retrieveProfile();
        try {
            data.gender = gender;
            data.age = age;
            data.income = income;
            await storageHelper.updateProfile(data)
        } catch (err) {
            console.error(`Could not to save user profile: ${gender} ${age} ${income}`)
            console.error(`Error message: ${err.message}`)
        }
    }

    async function createAndSaveWallet() {
        let db = await storageHelper.retrieveAll();
        await communityHelper.createWallet();
        db.profile.encryptedWallet = await communityHelper.getEncryptedWallet(db.configs.salt);
        return storageHelper.storeAll(db);
    }

    return {
        init,
        isNeededOnBoarding,
        getOnboardingFlow,
        submitOnBoarding,
        startOnBoarding,
        startOnBoardingOAuth,
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
        get3BoxMnemonic,
        saveProfileInfo,
        createAndSaveWallet,
        repeatOnboarding
    };
}());
export {onboarding};