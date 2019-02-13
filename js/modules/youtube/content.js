
function getVideoStatus(){
    var duration = document.getElementsByClassName("ytp-time-duration")[0].innerHTML
    var current = document.getElementsByClassName("ytp-time-current")[0].innerHTML
    return {
        duration: duration,
        current: current
    }
}

function uninstall(){
    object.removeEventListener("unload", getVideoStatus);
}

function install(){
    object.addEventListener("unload", getVideoStatus);
}
