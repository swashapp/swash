
function setDefaults(setting){
    console.log("loaded ", setting);
    $("#wallet-id").val(setting.user.wallet_id);
    $("#email").val(setting.user.email);
    $("#chk_bookmarks").prop('checked',setting.browse.chk_bookmarks);
    $("#chk_history").prop('checked',setting.browse.chk_history);
    $("#chk_search").prop('checked',setting.browse.chk_search);
}


$("#save-setting").on("click", () => {
    
	var wallet_id = $("#wallet-id").val();
    var email = $("#email").val();
    var chk_bookmarks = $("#chk_bookmarks").prop('checked');
    var chk_history = $("#chk_history").prop('checked');
    var chk_search = $("#chk_search").prop('checked');
    var setting = { 
        settings: {
            user:{
                wallet_id: wallet_id,
                email: email
            },
            browse: {
                chk_bookmarks: chk_bookmarks,
                chk_history: chk_history,
                chk_search: chk_search
            }
        }
    };
    console.log("saving ", setting);
    browser.storage.sync.set(setting);
    console.log("save done");
});


function loadSetting(){
    browser.storage.sync.get("settings").then(storage => {
        setDefaults(storage.settings);}
    );
}


$( document ).ready(function() {
    console.log("ready");
    loadSetting();
});
