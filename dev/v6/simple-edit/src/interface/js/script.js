var $ = require('jquery');

const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

function appControlEvt(event){
    switch (event){
        case 'minimize':
            ipc.send('minimizeApp');
            break;
        case 'maximize':
            ipc.send('maximizeApp');
            break;
        case 'close':
            ipc.send('closeApp');
            break;
        default:
            return false;
    }

}

$(".minimizeButton").click(()=>{
    appControlEvt("minimize");
});

$(".maximizeButton").click(()=>{
    appControlEvt("maximize");
});

$(".closeButton").click(()=>{
    appControlEvt("close");
});