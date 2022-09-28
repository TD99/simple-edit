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
        case 'devtools':
            ipc.send('devTools');
            break;
        default:
            return false;
    }

}

$(".search").focus((e)=>{
    $(e.target).parents(".searchDiv").css({"background-color": "#D2D7E2"});
});

$(".search").blur((e)=>{
    $(e.target).parents(".searchDiv").css({"background-color": ""});
});

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
});

$(".menuDropdown, .menuDropdownTitle").click((e) => {
    var target = ($(e.target).hasClass("menuDropdownTitle"))?$(e.target).parent():e.target;
    var dropDownContent = $(target).children(".menuDropdownContent");
    var targetPos = $(target).position();
    var targetSize = {"width": $(target).width(), "height": $(target).height()};
    dropDownContent.css({"top": targetPos.top+targetSize.height, "left": targetPos.left});
    if (dropDownContent.is(":visible")){
        setTimeout(() => {dropDownContent.hide();}, 50);
    } else{
        setTimeout(() => {dropDownContent.show();}, 50);
    }
});

$("body").click(() => {
    $(".menuDropdownContent").hide();
});

$(document).on('keydown', (e) => {
    switch (e.key){
        case "Escape":
            $(".menuDropdownContent").hide();
            break;
    }

    if ( e.ctrlKey ) {
        switch (e.key){
            case "f":
                const search = $(".search");
                if (search.is(':focus')){
                    $(".search").blur();
                } else{
                    $(".search").focus();
                }
        }
    }
});

$(window).blur(()=>{
    $(".menuDropdownContent").hide();
});

monaco.editor.defineTheme('simpleEditDark', {
	base: 'vs-dark',
	inherit: true,
	rules: [{ background: '343B48' }],
	colors: {
		'editor.background': '#343B48',
        'editor.lineHighlightBackground': '#343b48',
	}
});

var mainEditor;
function loadMonaco(div, val, lang){
    mainEditor = monaco.editor.create(document.querySelector(div), {
        value: val || "",
        language: lang || 'text',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: 'simpleEditDark'
    });
}
loadMonaco("#mainEditor");

$(window).resize((e) => {
    $("#mainEditor").empty();
    loadMonaco("#mainEditor", mainEditor.getValue(), $(".search").val());
});

$(".search").change((e)=>{
    $("#mainEditor").empty();
    loadMonaco("#mainEditor", mainEditor.getValue(), $(e.target).val());
});