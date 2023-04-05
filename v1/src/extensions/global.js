/* var $ = require('jquery');

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
        case 'devtools':
            ipc.send('devTools');
            break;
        case 'openfiledlg':
            ipc.send('openFileDlg');
            break;
        default:
            return false;
    }

}

$(".ipcMinimize").click(()=>{
    appControlEvt("minimize");
});

$(".ipcMaximize").click(()=>{
    appControlEvt("maximize");
});

$(".ipcClose").click(()=>{
    appControlEvt("close");
});

$(".ipcDevTools").click(() => {
    appControlEvt("devtools");
}); */