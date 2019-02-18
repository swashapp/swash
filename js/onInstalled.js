browser.management.onInstalled.addListener((info) => {
    console.log(info.name + " " + info.version +  " was installed");
    console.log("Registering modules.");
    
    Loader.install(AllModules);
});