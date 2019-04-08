/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

function handleShown() {    
  console.log("panel is being shown");
}

function handleHidden() {
  console.log("panel is being hidden");
}

/**
Create a panel, and add listeners for panel show/hide events.
*/
browser.devtools.panels.create(
  "SurrStreamr Network",
  "../icons/surf38.png",
  "/devtools/net-panel.html"
).then((newPanel) => {
  browser.devtools.network.getHAR().then(x=>console.log(x))    
  newPanel.onShown.addListener(handleShown);
  newPanel.onHidden.addListener(handleHidden);
}); 