
  function showPageOnTab(url_to_show) {
    return browser.windows.getAll({
        populate: true,
        windowTypes: ["normal"]
      }).then((windowInfoArray) => {
        let found = false;
        for (let windowInfo of windowInfoArray) {
          for (let tab of windowInfo.tabs) {
            let url = new URL(tab.url);
            if (url_to_show == url) {
              found = true;
              browser.windows.update(windowInfo.id, {focused: true});
              return browser.tabs.update(tab.id, {active: true, url: url});
            }
          }
        }
        if (!found) return browser.tabs.create({url: url_to_show, active: true});
      });
  }
  
  console.log("I loaded");
  
  
document.getElementById("open_setting").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("setting.html");
    showPageOnTab(url);
});

document.getElementById("open_messages").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("setting.html");
    showPageOnTab(url);
});


document.getElementById("open_logs").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("setting.html");
    showPageOnTab(url);
});
