browser.management.onInstalled.addListener((info) => {
    console.log(info.name + " " + info.version +  " was installed");
    console.log("Registering modules.");
    
    AllModules.forEach(module=>{
        console.log("Processing module:" + module.name + ", last_updates_at:" + module.last_updates_at);
        if(Loader.isNewModule(module)){
            console.log("New, Is loading");
            Loader.register(module);
            // installing on Engines
            Content.register(module);
            Browsing.register(module);
            //ApiCall.register(module);        // TODO
        }
        if(Loader.isModuleUpdated(module)){
            console.log("Updated, updating");
            var updates = Loader.update(module);
            ["content","browsing","apiCall"].forEach(func => {
                var f = null;
                switch(func){
                    case "content":
                    f = Content;
                    break;
                    case "browsing":
                    f = Browsing;
                    break;
                    case "apiCall":
                    f = ApiCall;
                    break;
                }
                if(f){
                    if(updates[func] == "register"){
                        f.register(module);
                    }
                    if(updates[func] == "unregister"){
                        f.unregister(module);
                    }
                }
            });
        }
        if(Loader.isObsoleteModule(module)){
            console.log("Obsolete, removing");
            Loader.unregister(module);
        }
    });    
});