import {utils} from './utils.js';

var storageHelper = (function () {

    var messages = {};
    const functionList = ["content", "browsing", "apiCall", "context", "task"]

    function retrieveProfile() {
        return retrieveData("profile");
    }

    function updateProfile(info) {
        return updateData("profile", info)
    }

    function retrieveFilters() {
        return retrieveData("filters");
    }

    function retrieveConfigs() {
        return retrieveData("configs");
    }

    function updateConfigs(info) {
        return updateData("configs", info);
    }

    function storeFilters(filters) {
        return updateData("filters", filters)
    }

    function retrieveModules() {
        return retrieveData("modules");
    }

    function updateModules(info) {
        return updateData("modules", info)
    }

    async function removeModule(moduleName) {
        var info = await retrieveData("modules");
        delete info[moduleName];
        browser.storage.local.set({modules: info});
    }

    function saveMessage(msg, id) {
        messages[id] = msg;
    }

    function removeMessage(id) {
        /*
        var info = await retrieveData("messages");
        delete info[id];
        browser.storage.local.set({messages:info});*/
        delete messages[id];
    }

    function retrieveMessages() {
        return messages;
    }

    async function storeAll(db) {
        await browser.storage.local.set(db);
    }


    function retrieveAll() {
        return browser.storage.local.get();
    }

    async function updateData(key, info) {
        var data = await retrieveData(key);
        utils.jsonUpdate(data, info);
        let x = {};
        x[key] = data;
        return browser.storage.local.set(x);
    }

    async function retrieveData(key) {
        let x = await browser.storage.local.get(key);
        return x[key];
    }

    async function createTask(info) {
        var tasks = await retrieveData("tasks");
        if (!tasks[info.moduleName])
            tasks[info.moduleName] = {};
        tasks[info.moduleName][info.name] = {
            startTime: info.startTime,
            taskId: info.taskId,
            endTime: -1,
            success: "unknown"
        }
        let x = {};
        x["tasks"] = tasks;
        browser.storage.local.set(x);
    }

    async function endTask(info) {
        var tasks = await retrieveData("tasks");
        if (!info || !tasks[info.moduleName] || !tasks[info.moduleName][info.name])
            return;
        var res = Object.assign({}, tasks[info.moduleName][info.name]);
        delete tasks[info.moduleName][info.name];

        let x = {};
        x["tasks"] = tasks;
        browser.storage.local.set(x);
        return res;
    }

    async function loadAllModuleTaskIds(moduleName) {
        var tasks = await retrieveData("tasks");
        return tasks[moduleName];
    }

    function updateFunctionSettings(module, functionName, settings) {
        if (module.functions.includes(functionName)) {
            for (let item of module[functionName].items) {
                item.is_enabled = settings[functionName][item.name]
            }
        }
    }

    function updatePrivacyLevel(privacyLevel) {
        let key = "configs";
        let info = {privacyLevel: privacyLevel}
        return updateData(key, info);
    }

    async function saveModuleSettings(moduleName, settings) {
        var modules = await retrieveData("modules");
        let ret = modules[moduleName];
        if (typeof settings.is_enabled != "undefined")
            ret.is_enabled = settings.is_enabled;
        for (let f of functionList) {
            if (typeof settings[f] != "undefined")
                updateFunctionSettings(ret, f, settings);
        }
        return browser.storage.local.set({modules: modules});
    }

    async function getVersion() {
        let configs = await retrieveData("configs");
        return configs.version;
    }

    function retrieveOnBoardings() {
        return retrieveData("onBoardings");
    }

    function updateOnBoardings(info) {
        return updateData("onBoardings", info)
    }

    async function removeOnBoardings(onBoardingName) {
        let info = await retrieveData("onBoardings");
        delete info[onBoardingName];
        browser.storage.local.set({onBoardings: info});
    }

    return {
        retrieveProfile,
        updateProfile,
        retrieveConfigs,
        updateConfigs,
        retrieveModules,
        updateModules,
        updatePrivacyLevel,
        retrieveFilters,
        retrieveAll,
        storeAll,
        saveModuleSettings,
        retrieveData,
        updateData,
        storeFilters,
        saveMessage,
        removeMessage,
        retrieveMessages,
        removeModule,
        createTask,
        endTask,
        loadAllModuleTaskIds,
        getVersion,
        retrieveOnBoardings,
        updateOnBoardings,
        removeOnBoardings
    };
}());
export {storageHelper};