
  function showSettingOnTab() {
    return browser.windows.getAll({
        populate: true,
        windowTypes: ["normal"]
      }).then((windowInfoArray) => {
        let found = false;
        let url = browser.runtime.getURL("setting.html");
        for (let windowInfo of windowInfoArray) {
          for (let tab of windowInfo.tabs) {
            let url = new URL(tab.url);
            if (browser.runtime.getURL("setting.html") == url) {
              found = true;
              browser.windows.update(windowInfo.id, {focused: true});
              return browser.tabs.update(tab.id, {active: true, url: url});
            }
          }
        }
        if (!found) return browser.tabs.create({url: url, active: true});
      });
  }
  
  
   function showFacebookOnTab() {
    return browser.windows.getAll({
        populate: true,
        windowTypes: ["normal"]
      }).then((windowInfoArray) => {
        let found = false;
        let url = browser.runtime.getURL("fb-tst.html");
        for (let windowInfo of windowInfoArray) {
          for (let tab of windowInfo.tabs) {
            if (browser.runtime.getURL("fb-tst.html") == url) {
              found = true;
              browser.windows.update(windowInfo.id, {focused: true});
              return browser.tabs.update(tab.id, {active: true, url: url});
            }
          }
        }
        if (!found) return browser.tabs.create({url: url, active: true});
      });
  }
  
  
  $("#show_option").on("click", () => {
    console.log("option clicked ");
    showSettingOnTab();
    console.log("save done");
});

  $("#show_facebook").on("click", () => {
    console.log("option clicked ");
    showFacebookOnTab();
    console.log("save done");
});
            let url = new URL(tab.url);