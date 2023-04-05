// Not running in Electron
if (navigator.userAgent.toLowerCase().indexOf('electron') <= -1 || !(window && window.process && window.process.type)) {
    location.replace('../about/index.html');
    throw new Error("Redirecting..."); // Stops code from running
}

// Require
const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

var $ = require('jquery');
const fs = require("fs");
const path = require("path");

// Global manual events (default)
function defineDefaultGEvt() {
    // WindowControlBtn
    $(".ipcMinimize").on('click', () => {
        simpleEdit.window.minimize();
    });

    $(".ipcMaximize").on('click', () => {
        simpleEdit.window.maximize();
    });

    $(".ipcClose").on('click', () => {
        simpleEdit.window.close();
    });

    // Menu closing
    $(document).on('keydown', (e) => {
        switch (e.key) {
            case "Escape":
                $(".menuDropdownContent").hide();
                simpleEdit.modal.close();
                break;
            default:
                break;
        }
    });

    $("body").on('click', (e) => {
        if ($(e.target).parents(".menuDropdownContent").length) {return;} // Is a dropdownButton
        $(".menuDropdownContent").hide();
    });

    $(window).blur(() => { // unfocus
        $(".menuDropdownContent").hide();
    });
}

// Load Monaco framework
var mainEditor;
function loadMonacoThemes() {
    monaco.editor.defineTheme('simpleEditDark', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ background: '39414f' }],
        colors: {
            'editor.background': '#343B48',
            'editor.lineHighlightBackground': '#343B48',
            'widget.shadow': '#252A34',
            'input.background': '#394250',
            'list.activeSelectionBackground': '#4f5a6e',
            'list.hoverBackground': '#3d4656',
            'editorHoverWidget.background': '#252a34',
            'editor.hoverHighlightBackground': '#4f5a6e',
            'editor.findMatchHighlightBackground': '#535c6a',
            'editor.findMatchBackground': '#6e7d8d',
            'editor.selectionHighlightBackground': '#46515d',
            'editor.inactiveSelectionBackground': '#264f79',
            'editorWidget.background': '#252a34',
            'dropdown.background': '#252a34'
        }
    });
}

function loadMonaco(div, val, lang) {
    $(div).empty();
    loadMonacoThemes();
    mainEditor = monaco.editor.create(document.querySelector(div), {
        value: val || "",
        language: lang || 'text', // default is '(plain)text'
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: 'simpleEditDark',
        automaticLayout: true
    });
}

function triggerMonacoEvt(action, editor=mainEditor) { // trigger editor event
    editor.focus();
    editor.trigger('action', action);
}

function defineDefaultMEvt() {
    mainEditor.getModel().onDidChangeContent((evt) => {
        if (simpleEdit.file.current && simpleEdit.file.autoSave.status) { // file open and autosave on
            simpleEdit.file.save();
        }
    });

    mainEditor.onDidChangeCursorPosition((evt) => {
        simpleEdit.editor.ui.update();
    });
}

// Load context menu
var mainCtxMenu;
function setContext(config) {
    mainCtxMenu = config || {
        "File": [
            {
                name: "se-newFile",
                displayName: "New File",
                accelerator: {
                    ctrlKey: true,
                    key: 'n'
                },
                run() {
                    simpleEdit.file.new();
                }
            },
            {
                name: "se-newWindow",
                displayName: "New Window",
                accelerator: {
                    ctrlKey: true,
                    shiftKey: true,
                    key: 'n'
                },
                run() {
                    simpleEdit.window.create();
                }
            },
            {
                separator: true
            },
            {
                name: "se-openFile",
                displayName: "Open File",
                accelerator: {
                    ctrlKey: true,
                    key: 'o'
                },
                run() {
                    simpleEdit.file.openDlg();
                }
            },
            {
                name: "se-openRecent",
                displayName: "Open Recent",
                accelerator: {
                    ctrlKey: true,
                    shiftKey: true,
                    key: 'o'
                },
                run() {
                    simpleEdit.window.recent.show();
                }
            },
            {
                separator: true
            },
            {
                name: "se-save",
                displayName: "Save",
                accelerator: {
                    ctrlKey: true,
                    key: 's'
                },
                run() {
                    simpleEdit.file.save();
                }
            },
            {
                name: "se-saveAs",
                displayName: "Save As",
                accelerator: {
                    ctrlKey: true,
                    shiftKey: true,
                    key: 's'
                },
                run() {
                    simpleEdit.file.saveAs();
                }
            },
            {
                separator: true
            },
            {
                name: "se-closeFile",
                displayName: "Close File",
                run() {
                    simpleEdit.file.close();
                }
            },
            {
                name: "se-closeWindow",
                displayName: "Close Window",
                accelerator: {
                    ctrlKey: true,
                    key: 'w'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.window.close();
                }
            }
        ],
        "Edit": [
            {
                name: "se-undo",
                displayName: "Undo",
                accelerator: {
                    ctrlKey: true,
                    key: 'z'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.undo();
                }
            },
            {
                name: "se-redo",
                displayName: "Redo",
                accelerator: {
                    ctrlKey: true,
                    key: 'y'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.redo();
                }
            },
            {
                separator: true
            },
            {
                name: "se-cut",
                displayName: "Cut",
                accelerator: {
                    ctrlKey: true,
                    key: 'x'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.cut();
                }
            },
            {
                name: "se-copy",
                displayName: "Copy",
                accelerator: {
                    ctrlKey: true,
                    key: 'c'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.copy();
                }
            },
            {
                name: "se-paste",
                displayName: "Paste",
                accelerator: {
                    ctrlKey: true,
                    key: 'v'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.paste();
                }
            },
            {
                separator: true
            },
            {
                name: "se-find",
                displayName: "Find",
                accelerator: {
                    ctrlKey: true,
                    key: 'f'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.find();
                }
            },
            {
                name: "se-replace",
                displayName: "Replace",
                accelerator: {
                    ctrlKey: true,
                    key: 'h'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.replace();
                }
            },
            {
                separator: true
            },
            {
                name: "se-gotoLine",
                displayName: "Goto Line",
                accelerator: {
                    ctrlKey: true,
                    key: 'g'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.gotoLine();
                }
            },
            {
                name: "se-selectAll",
                displayName: "Select All",
                accelerator: {
                    ctrlKey: true,
                    key: 'a'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.selectAll();
                }
            },
            {
                separator: true
            },
            {
                name: "se-lineComment",
                displayName: "Line Comment",
                accelerator: {
                    ctrlKey: true,
                    key: '\u00A7' // Special chars
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.comment.toggleLine();
                }
            },
            {
                name: "se-blockComment",
                displayName: "Block Comment",
                accelerator: {
                    altKey: true,
                    shiftKey: true,
                    key: 'a'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.comment.toggleBlock();
                }
            },
            {
                separator: true
            },
            {
                name: "se-changeSpacing",
                displayName: "Change Spacing",
                accelerator: {
                    ctrlKey: true,
                    key: 'e'
                },
                run() {
                    simpleEdit.editor.spacing.change.showMenu();
                }
            },
            {
                name: "se-changeEndOfLine",
                displayName: "Change End of Line Sequence",
                accelerator: {
                    ctrlKey: true,
                    shiftKey: true,
                    key: 'e'
                },
                run() {
                    simpleEdit.editor.endofline.change();
                }
            },
            {
                separator: true
            },
            {
                name: "se-openPreview",
                displayName: "Open Preview",
                run() {
                    changePreviewVisibility(true);
                }
            }
        ],
        "Help": [
            {
                name: "se-toggleDevTools",
                displayName: "Toggle Dev Tools",
                accelerator: {
                    ctrlKey: true,
                    shiftKey: true,
                    key: 'i'
                },
                alreadyRegistered: true,
                run() {
                    simpleEdit.window.devTools.toggle();
                }
            },
            {
                name: "se-reloadWindow",
                displayName: "Hard Reload",
                run() {
                    simpleEdit.window.reload()
                }
            },
            {
                separator: true
            },
            {
                name: "se-keyMapping",
                displayName: "Key Mapping",
                run() {
                    simpleEdit.window.keyMapping.show();
                }
            },
            {
                name: "se-bugReport",
                displayName: "Report a Bug",
                run() {
                    simpleEdit.window.report.show();
                }
            },
            {
                name: "se-about",
                displayName: "About simpleEdit",
                run() {
                    simpleEdit.window.about.show();
                }
            }
        ]
    };
}

function loadContext(appendTo, config) {
    setContext(config);

    const parentE = $(appendTo); // root of context
    parentE.empty();

    Object.keys(mainCtxMenu).forEach(key => { // foreach category
        const menuDropdown = $("<div>", { class: 'menuDropdown' });
        parentE.append(menuDropdown);

        const menuDropdownTitle = $("<span>", { class: 'menuDropdownTitle', text: key });
        const menuDropdownContent = $("<div>", { class: 'menuDropdownContent' });
        menuDropdown.append(menuDropdownTitle, menuDropdownContent);

        mainCtxMenu[key].forEach(item => { // foreach context element
            if (item.separator) { // separator -> not clickable
                const separator = $("<div>", { class: 'menuDropdownSeparator' });
                menuDropdownContent.append(separator);
            } else {
                const menuDropdownButton = $("<div>", { class: 'menuDropdownButton ' + item.name });
                menuDropdownContent.append(menuDropdownButton);
                
                const menuDropdownButtonLbl = $("<span>", { class: 'menuDropdownButtonLbl', text: item.displayName });
                menuDropdownButton.append(menuDropdownButtonLbl);

                if (item.accelerator) { // shortcut
                    let keyInscance = []; // stores combination
                    if (item.accelerator.ctrlKey) keyInscance.push("CTRL");
                    if (item.accelerator.altKey) keyInscance.push("ALT");
                    if (item.accelerator.shiftKey) keyInscance.push("SHIFT");
                    keyInscance.push(item.accelerator.key.toUpperCase());

                    const keyShortcut = $("<span>", { class: 'keyShortcut', text: keyInscance.join(" + ") }); // human readable
                    menuDropdownButton.append(keyShortcut);

                    if (!item.alreadyRegistered) { // if true, mostly Monaco keyEvent
                        $(document).on('keydown', (e) => { // register key combination
                            const ctrlKey = (item.accelerator.ctrlKey)?true:false;
                            const altKey = (item.accelerator.altKey)?true:false;
                            const shiftKey = (item.accelerator.shiftKey)?true:false;
                            const key = item.accelerator.key.toUpperCase();
                            
                            const eventKey = e.key.toUpperCase();

                            if ((ctrlKey == e.ctrlKey) && (altKey == e.altKey) && (shiftKey == e.shiftKey) && (key == eventKey)) item.run();
                        });
                    }
                }

                if (item.run) { // add action for button
                    $(menuDropdownButton).on('click', () => {
                        item.run();
                        $(menuDropdownButton).parents(".menuDropdownContent").hide();
                    });
                }
            }
        });
    });

}

// Dropdown / context logic
function loadDropdownLogic() {
    $(".menuDropdown, .menuDropdownTitle").on('click', (e) => {
        var target = ($(e.target).hasClass("menuDropdownTitle"))?$(e.target).parent():e.target; // root element of dropdown menu
        var dropdownContent = $(target).children(".menuDropdownContent"); // content of dropdown menu
        var targetPos = $(target).position(); // root pos
        var targetSize = {"width": $(target).width(), "height": $(target).height()}; // dropdown menu size
        dropdownContent.css({"top": targetPos.top+targetSize.height, "left": targetPos.left}); // append pos of root to menu
        if (dropdownContent.is(":visible")) {
            setTimeout(() => {dropdownContent.hide();}, 50); // setTimeout because of the 'blur' event, can be removed because it is only a graphical correction
        } else {
            setTimeout(() => {dropdownContent.show();}, 50); // setTimeout because of the 'blur' event, can be removed because it is only a graphical correction
        }
    });
}

// Changes language to selected one -> bad code -> should be corrected in v2
function appendLang(target) {
    simpleEdit.editor.language.set($(target).val());
    const docsURL = $(target).find("option:selected").attr("data-docsURL");
    const learnURL = $(target).find("option:selected").attr("data-learnURL");
    if (docsURL == "undefined") {
        $(".docsIcon").attr("onclick", "");
        $(".docsIcon").hide();
    } else {
        $(".docsIcon").attr("onclick", "ipc.send('openExtURL', '" + docsURL +"')");
        $(".docsIcon").show();
    }
    if (learnURL == "undefined") {
        $(".learnIcon").attr("onclick", "");
        $(".learnIcon").hide();
    } else {
        $(".learnIcon").attr("onclick", "ipc.send('openExtURL', '" + learnURL +"')");
        $(".learnIcon").show();
    }
    if (mainEditor.getModel().getLanguageIdentifier().language != $(target).val()) { // if not valid lang
        loadLanguageList(simpleEdit.editor.language.registry); // set lang to default
        alert("An error occured while changing the language.");
    }
}

// Change of language <select>
$(".langS").change((e)=>{
    appendLang(e.target);
});

// load languages in dropdown
function loadLanguageList(list) {
    $(".langS").empty();
    list.forEach(e => {
        const defaultStr = (e.isDefault)?" selected":"";
        $(".langS").append('<option value="' + e.name + '" data-docsURL="' + e.docs + '" data-learnURL="' + e.learn + '"' + defaultStr + '>' + e.displayname + '</option>');
    });
    appendLang(".langS");
}

// load preview
function loadPreview() {
    $('#webviewDiv').append('<webview src="../preview/index.html" autosize="on" style="height: 100%; background-color: white;" id="virtualBrowser"></webview>');

    // On preview finish load / url change
    document.getElementById('virtualBrowser').addEventListener('did-finish-load', () => {
        document.getElementById('previewTitle').textContent = document.getElementById('virtualBrowser').getTitle();
        document.getElementById('previewURL').value = document.getElementById('virtualBrowser').getURL();
    });
}

function changePreviewVisibility(isVisible) {
    if (isVisible) {
        $("#mainPreview").show();
    } else {
        $("#mainPreview").hide();
    }
}

function changePreviewZoom(val) {
    if (!Number(val) || val < 0) return false;
    
    $("#mainPreview").css('height', 'calc(' + val + '%' + ' + ' + '22px');
}

// Bottom Bar
$(".lineData").on('click', () => {
    simpleEdit.editor.gotoLine();
});
$(".spaceData").on('click', () => {
    simpleEdit.editor.spacing.change.showMenu();
});
$(".eolData").on('click', () => {
    simpleEdit.editor.endofline.change();
});

var topBarState = false;

function switchTopBar(element) {
    if (topBarState) {
        $(element).children('.menuDropdownTitle').html($('<i class="fa-solid fa-bars"></i>'));
        $("#mainMenuStrip").removeAttr('style');
        $(".fileManageDiv").removeAttr('style');
        topBarState = false;
    } else {
        $(element).children('.menuDropdownTitle').html($('<i class="fa-solid fa-x"></i>'));
        $("#mainMenuStrip").attr('style', 'display: flex !important;');
        $(".fileManageDiv ").attr('style', 'display: none !important;');
        topBarState = true;
    }
}

const simpleEdit = {
    file: {
        current: "",
        new() {
            simpleEdit.window.create();
        },
        open(file, detectFileExt=false) {
            file = path.resolve(file);

            if (!fs.existsSync(file)) { return false; } // exists
            if (!fs.lstatSync(file).isFile()) { return false; } // isfile

            try {
                fs.accessSync(file, fs.constants.W_OK);
            } catch (err) {
                console.log('Opening File in read-only: ' + file);
                console.log(err);
                simpleEdit.modal.open({
                    title: 'Read-Only',
                    content: 'The file you tried to open cannot be saved.',
                    buttons: [
                        {
                            text: 'OK'
                        }
                    ]
                });
            }

            if (this.current) {
                // fix in v2
                simpleEdit.modal.open({
                    title: 'Error while opening',
                    content: 'Please close the current file or open a new Window to proceed.',
                    buttons: [
                        {
                            text: 'OK'
                        }
                    ]
                });
            } else {
                const buffer = fs.readFileSync(file);
                const content = buffer.toString();
                mainEditor.setValue(content);
                if (detectFileExt) {
                    const ext = path.parse(file).ext;
                    simpleEdit.editor.language.registry.forEach(e => {
                        e.extensions.forEach(f => {
                            if('.' + f == ext) {
                                simpleEdit.editor.language.set(e.name); // Fix in v2 -- langS not compatible
                            }
                        });
                    });
                }
                document.getElementById('virtualBrowser').loadURL(file);
                this.current = file;
                this.autoSave.setStatus(false);
                simpleEdit.editor.ui.update();
                simpleEdit.window.recent.add(file);
            }
        },
        openDlg() {
            ipc.send('openFileDlg');
        },
        save(file) {
            fs.writeFile(file, mainEditor.getValue(), function (err) {
                if (err) {
                    simpleEdit.modal.open({
                        title: 'Error while saving',
                        content: err,
                        buttons: [
                            {
                                text: 'OK'
                            }
                        ]
                    });
                    return false;
                }
                console.log("Saved successfully! (" + file + ")");
            });
            document.getElementById('virtualBrowser').loadURL(file);
            this.current = file;
        },
        autoSave: {
            status: false,
            setStatus(stat) {
                this.status = (simpleEdit.file.current)?(stat):(false);
            
                $("#autoSave").get().forEach(item => {
                    item.checked = this.status;
                });

                return stat == this.status;
            }
        },
        save() {
            if (this.current) {
                fs.writeFile(simpleEdit.file.current, mainEditor.getValue(), function (err) {
                    if (err) {
                        simpleEdit.modal.open({
                            title: 'Error while saving',
                            content: err,
                            buttons: [
                                {
                                    text: 'OK'
                                }
                            ]
                        });
                        return false;
                    }
                    console.log("Saved successfully! (" + simpleEdit.file.current + ")");
                    document.getElementById('virtualBrowser').loadURL(simpleEdit.file.current);
                });
            } else {
                console.log("Opening indirect SaveDialog.");
                this.saveAs();
            }
        },
        saveAs() {
            ipc.send('saveFileDlg');
        },
        close(force=false) {
            if (!force && !confirm("Are you sure you want to close this file?")) return false;
            this.current = "";
            mainEditor.setValue("");
            monaco.editor.setModelLanguage(mainEditor.getModel(), "plaintext");
            simpleEdit.editor.ui.update();
            this.autoSave.setStatus(false);

            document.getElementById('virtualBrowser').loadURL(path.join(__dirname, '../preview/index.html')); // default page
            return true;
        }
    },
    window: {
        close(force=false) {
            if (!simpleEdit.file.close(force)) return false;
            ipc.send("closeApp");
        },
        minimize() {
            ipc.send("minimizeApp");
        },
        maximize() {
            ipc.send("maximizeApp");
        },
        create() {
            ipc.send("newMainWindow");
        },
        devTools: {
            toggle() {
                ipc.send("toggleDevTools");
            }
        },
        reload() {
            location.reload();
        },
        keyMapping: {
            show() {
                const content = $("<div>");
                Object.keys(mainCtxMenu).forEach(k => {
                    mainCtxMenu[k].forEach(e => {
                        if (e.accelerator) {
                            let keyInscance = [];
                            if (e.accelerator.ctrlKey) keyInscance.push("CTRL");
                            if (e.accelerator.altKey) keyInscance.push("ALT");
                            if (e.accelerator.shiftKey) keyInscance.push("SHIFT");
                            keyInscance.push(e.accelerator.key.toUpperCase());
    
                            const comb = $("<div>");
                            comb.append($("<span>", { text: e.displayName + ' - ' }));
                            comb.append($("<span>", { class: 'keyCombination', text: keyInscance.join(" + ") }));
    
                            content.append(comb);
                        }
                    });
                });
                simpleEdit.modal.open({
                    title: 'Key Mapping',
                    content: content.get(0)
                });
            }
        },
        about: {
            show() {
                simpleEdit.modal.open({
                    title: 'About simpleEdit',
                    content: $('<webview src="../about/index.html" autosize="on" style="height: 50vh; width: 50vw;" id="aboutView"></webview>').get(0)
                });
            }
        },
        report: {
            show() {
                simpleEdit.modal.open({
                    title: 'Report a bug',
                    content: $('<webview src="../report/index.html" autosize="on" style="height: 50vh; width: 50vw;" id="reportView"></webview>').get(0)
                });
            }
        },
        recent: {
            add(file) {
                try {
                    const stor = (window.localStorage.getItem('recent'))?window.localStorage.getItem('recent').split('<,>'):[];
                    if (!stor.includes(file)) {
                        stor.push(file);
                        const last5 = stor.slice(-5);
                        window.localStorage.setItem('recent', last5.join('<,>'));
                    }
                } catch (e) {
                    return e;
                }
            },
            get() {
                return (window.localStorage.getItem('recent') && window.localStorage.getItem('recent') != 'undefined')?window.localStorage.getItem('recent').split('<,>'):'';
            },
            clear() {
                window.localStorage.removeItem('recent');
            },
            show() {
                simpleEdit.modal.open({
                    title: 'Recent files',
                    buttons: [
                        {
                            text: simpleEdit.window.recent.get()[0],
                            onclick() {
                                simpleEdit.file.open(simpleEdit.window.recent.get()[0]);
                            }
                        },
                        {
                            text: simpleEdit.window.recent.get()[1],
                            onclick() {
                                simpleEdit.file.open(simpleEdit.window.recent.get()[1]);
                            }
                        },
                        {
                            text: simpleEdit.window.recent.get()[2],
                            onclick() {
                                simpleEdit.file.open(simpleEdit.window.recent.get()[2]);
                            }
                        },
                        {
                            text: simpleEdit.window.recent.get()[3],
                            onclick() {
                                simpleEdit.file.open(simpleEdit.window.recent.get()[3]);
                            }
                        },
                        {
                            text: simpleEdit.window.recent.get()[4],
                            onclick() {
                                simpleEdit.file.open(simpleEdit.window.recent.get()[4]);
                            }
                        },
                        {
                            text: 'Reset',
                            onclick() {
                                simpleEdit.window.recent.clear();
                            }
                        }
                    ]
                });
            }
        }
    },
    modal: {
        open({title, content, buttons}) {
            const mainModal = $("#mainModal");
            
            const mainModalTitle = $("#mainModal .modalTitle");
            const mainModalContent = $("#mainModal .modalContent");
            const mainModalActions = $("#mainModal .modalActions");
        
            mainModalTitle.empty();
            mainModalContent.empty();
            mainModalActions.empty();
        
            mainModalTitle.text(title);
            mainModalContent.html(content);
            
            if (buttons) {
                buttons.forEach(e => {
                    const modalBtn = $("<button>", { class: 'modalButton', text: e.text });
                    modalBtn.on('click', (evt) => {
                        if (e.onclick) {
                            e.onclick(evt);
                        }
                        simpleEdit.modal.close();
                    });
            
                    mainModalActions.append(modalBtn);
                });
            }
        
            mainModal.show();
        },
        close() {
            const mainModal = $("#mainModal");

            mainModal.hide();
            
            $("#mainModal .modalTitle").empty();
            $("#mainModal .modalContent").empty();
            $("#mainModal .modalActions").empty();
        }
    },
    system: {
        openInDefaultBrowser(url) {
            ipc.send('openExtURL', url);
        }
    },
    security: {
        warnConsole(title, text) {
            style = {
                title: "color:red;font-size:4rem;font-weight:bold;-webkit-text-stroke: 1px black;",
                text: "color:red;font-size:1.5rem;font-weight:bold;"
            };
            
            if (title) {
                title = "%c" + title;
                console.log(title, style["title"]);
            }
            
            if (text) {
                text = "%c" + text;
                console.log(text, style["text"]);
            }
        }
    },
    editor: {
        ui: {
            update() {
                const pos = mainEditor.getPosition();
                $(".lineData").text("Ln " + pos.lineNumber + ", Col " + pos.column);
                $(".spaceData").text(simpleEdit.editor.spacing.get(true));
                $(".eolData").text(simpleEdit.editor.endofline.get(true));

                const fileTag = (simpleEdit.file.current)?path.parse(simpleEdit.file.current).base:"New Document";
                $(".fileName").text(fileTag);
                $(document).attr("title", fileTag);
            }
        },
        undo() {
            mainEditor?.focus();
            mainEditor.getModel()?.undo();
        },
        redo() {
            mainEditor?.focus();
            mainEditor.getModel()?.redo();
        },
        cut() {
            mainEditor?.focus();
            document.execCommand("cut");
        },
        copy() {
            mainEditor?.focus();
            document.execCommand("copy");
        },
        paste() {
            mainEditor?.focus();
            document.execCommand("paste");
        },
        find() {
            triggerMonacoEvt("actions.find");
        },
        replace() {
            triggerMonacoEvt("editor.action.startFindReplaceAction");
        },
        selectAll() {
            mainEditor.setSelection(mainEditor.getModel().getFullModelRange());
        },
        comment: {
            toggleLine() {
                triggerMonacoEvt("editor.action.commentLine");
            },
            toggleBlock() {
                triggerMonacoEvt("editor.action.blockComment");
            }
        },
        language: {
            registry: [
                {"displayname":"Batch","name":"bat","extensions":["bat","cmd"],"learn":"https://www.tutorialspoint.com/batch_script/index.htm"},
                {"displayname":"C","name":"c","extensions":["c","i"],"docs":"https://devdocs.io/c/","learn":"https://www.w3schools.com/c/index.php"},
                {"displayname":"C#","name":"csharp","extensions":["cs","csx","cake"],"docs":"https://learn.microsoft.com/en-us/dotnet/csharp/","learn":"https://www.w3schools.com/cs/index.php"},
                {"displayname":"C++","name":"cpp","extensions":["cpp","cc","cxx","c++","hpp","hh","hxx","h++","h","i"],"docs":"https://devdocs.io/cpp/","learn":"https://www.w3schools.com/cpp/default.asp"},
                {"displayname":"Clojure","name":"clojure","extensions":["clj","cljs","cljc","clojure","edn"],"docs":"https://clojure.org/index","learn":"https://clojure.org/guides/learn/clojure"},
                {"displayname":"CoffeeScript","name":"coffeescript","extensions":["coffee","cson","iced"],"docs":"https://coffeescript.org/#introduction","learn":"https://www.tutorialspoint.com/coffeescript/index.htm"},
                {"displayname":"CSS","name":"css","extensions":["css"],"docs":"https://developer.mozilla.org/en-US/docs/Web/CSS","learn":"https://www.w3schools.com/css/default.asp"},
                {"displayname":"Dart","name":"dart","extensions":["dart"],"docs":"https://dart.dev/guides","learn":"https://dart.dev/tutorials"},
                {"displayname":"Docker","name":"dockerfile","extensions":["dockerfile","containerfile"],"docs":"https://docs.docker.com/engine/reference/builder/"},
                {"displayname":"F#","name":"fsharp","extensions":["fs","fsi","fsx","fsscript"],"docs":"https://fsharp.org/docs/","learn":"https://fsharp.org/learn/"},
                {"displayname":"Go","name":"go","extensions":["go"],"docs":"https://go.dev/doc/","learn":"https://go.dev/learn/"},
                {"displayname":"HTML","name":"html","extensions":["html","htm","shtml","xhtml","xht","mdoc","jsp","asp","aspx","jshtm"],"docs":"https://developer.mozilla.org/en-US/docs/Web/HTML","learn":"https://www.w3schools.com/html/default.asp"},
                {"displayname":"Ini","name":"ini","extensions":["ini"],"learn":"https://www.w3schools.io/file/ini-extension-introduction/"},
                {"displayname":"Java","name":"java","extensions":["java","jav","class"],"docs":"https://dev.java/learn/","learn":"https://www.w3schools.com/java/default.asp"},
                {"displayname":"JavaScript","name":"javascript","extensions":["js","es6","mjs","cjs","pac","jsx"],"docs":"https://developer.mozilla.org/en-US/docs/Web/JavaScript","learn":"https://www.w3schools.com/js/default.asp"},
                {"displayname":"JSON","name":"json","extensions":["json","bowerrc","jscsrc","webmanifest","map","har","jslintrc","jsonld"],"docs":"https://www.json.org/json-en.html","learn":"https://www.w3schools.com/js/js_json_intro.asp"},
                {"displayname":"Julia","name":"julia","extensions":["jl"],"docs":"https://docs.julialang.org/en/v1/","learn":"https://julialang.org/learning/"},
                {"displayname":"Lua","name":"lua","extensions":["lua"],"docs":"https://www.lua.org/docs.html","learn":"https://www.tutorialspoint.com/lua/index.htm"},
                {"displayname":"Markdown","name":"markdown","extensions":["md","mkd","mdwn","mdown","markdown","markdn","mdtxt","mdtext","workbook"],"docs":"https://www.markdownguide.org/basic-syntax/","learn":"https://www.markdowntutorial.com/"},
                {"displayname":"Objective-C","name":"objective-c","extensions":["m"],"docs":"https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html","learn":"https://www.tutorialspoint.com/objective_c/index.htm"},
                {"displayname":"Perl","name":"perl","extensions":["pl","pm","pod","t","PL","psgi"],"docs":"https://www.perl.org/docs.html","learn":"https://www.tutorialspoint.com/perl/index.htm"},
                {"displayname":"PHP","name":"php","extensions":["php","php4","php5","phtml","ctp"],"docs":"https://www.php.net/manual/en/","learn":"https://www.w3schools.com/php/default.asp"},
                {"displayname":"Plain Text","name":"plaintext","extensions":["txt"],"isDefault":true},
                {"displayname":"PowerShell","name":"powershell","extensions":["ps1","psm1","psd1","pssc","psrc"],"docs":"https://learn.microsoft.com/en-us/powershell/","learn":"https://www.tutorialspoint.com/powershell/index.htm"},
                {"displayname":"Pug","name":"pug","extensions":["pug","jade"],"docs":"https://pugjs.org/api/getting-started.html","learn":"https://www.sitepoint.com/a-beginners-guide-to-pug/"},
                {"displayname":"Python","name":"python","extensions":["py","rpy","pyw","cpy","gyp","gypi","pyi","ipy","pyt"],"docs":"https://docs.python.org/","learn":"https://www.w3schools.com/python/default.asp"},
                {"displayname":"R","name":"r","extensions":["r","rhistory","rprofile","rt"],"docs":"https://cran.r-project.org/manuals.html","learn":"https://www.w3schools.com/r/default.asp"},
                {"displayname":"reStructuredText","name":"restructuredtext","extensions":["rst"],"docs":"https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html","learn":"https://www.writethedocs.org/guide/writing/reStructuredText/"},
                {"displayname":"Ruby","name":"ruby","extensions":["rb","rbx","rjs","gemspec","rake","ru","erb","podspec","rbi"],"docs":"https://www.ruby-lang.org/de/documentation/","learn":"https://www.tutorialspoint.com/ruby/index.htm"},
                {"displayname":"Rust","name":"rust","extensions":["rs"],"docs":"https://doc.rust-lang.org/std/","learn":"https://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/README.html"},
                {"displayname":"Shell Script","name":"shell","extensions":["sh","bash","bashrc","bash_aliases","bash_profile","bash_login","ebuild","profile","bash_logout","xprofile"],"docs":"https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html","learn":"https://learnxinyminutes.com/docs/bash/"},
                {"displayname":"SQL","name":"sql","extensions":["sql","dsql"],"learn":"https://www.w3schools.com/sql/default.asp"},
                {"displayname":"Swift","name":"swift","extensions":["swift"],"docs":"https://www.swift.org/documentation/","learn":"https://docs.swift.org/swift-book/GuidedTour/GuidedTour.html"},
                {"displayname":"TypeScript","name":"typescript","extensions":["ts","cts","mts"],"docs":"https://www.typescriptlang.org/docs/","learn":"https://www.w3schools.com/typescript/"},
                {"displayname":"Visual Basic","name":"vb","extensions":["vb","brs","vbs","bas","vba"],"docs":"https://learn.microsoft.com/en-us/dotnet/visual-basic/","learn":"https://www.tutorialspoint.com/vb.net/index.htm"},
                {"displayname":"XML","name":"xml","extensions":["xml","xsd","ascx","atom","axml","axaml","bpmn","cpt","csl","csproj"],"docs":"https://www.w3.org/TR/xml/","learn":"https://www.w3schools.com/xml/default.asp"},
                {"displayname":"YAML","name":"yaml","extensions":["yml","cyaml","cyml","yaml","cff"],"docs":"https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html","learn":"https://www.cloudbees.com/blog/yaml-tutorial-everything-you-need-get-started"}
            ],
            set(lang) {
                monaco.editor.setModelLanguage(mainEditor.getModel(), lang);
            }
        },
        gotoLine() {
            triggerMonacoEvt('editor.action.gotoLine');
        },
        spacing: {
            change: {
                showMenu() {
                    simpleEdit.modal.open({
                        title: 'Select Intentation',
                        content: '<small><i>You can choose the Tab Size later.</i><small>',
                        buttons: [
                            {
                                text: 'Spaces',
                                onclick() {
                                    simpleEdit.editor.spacing.change.toSpaces();
                                }
                            },
                            {
                                text: 'Tabs',
                                onclick() {
                                    simpleEdit.editor.spacing.change.toTabs();
                                }
                            }
                        ]
                    });
                },
                toSpaces() {
                    triggerMonacoEvt('editor.action.indentUsingSpaces');
                },
                toTabs() {
                    triggerMonacoEvt('editor.action.indentUsingTabs');
                }
            },
            set(tabSize=4, insertSpaces=true) {
                mainEditor.getModel().updateOptions({tabSize, insertSpaces});
            },
            get(humanReadable=true) {
                const { tabSize, insertSpaces } = mainEditor.getModel().getOptions();
                return (humanReadable)?((insertSpaces)?"Spaces":"Tabs")+": "+tabSize:({tabSize, insertSpaces});
            },
            convert: {
                toSpaces() {
                    triggerMonacoEvt('editor.action.indentationToSpaces');
                },
                toTabs() {
                    triggerMonacoEvt('editor.action.indentationToTabs');
                }
            },
            detect() {
                triggerMonacoEvt('editor.action.detectIndentation');
            }

        },
        endofline: {
            set(endofline) {
                endofline = ['LF', '\n', 0].includes(endofline)?0:1;
                mainEditor.getModel().setEOL(endofline);
            },
            get(humanReadable=true) {
                const eol = mainEditor.getModel().getEOL();
                if (humanReadable) {
                    return (eol == '\n')?"LF":"CRLF";
                }
                return eol;
            },
            change() {
                simpleEdit.modal.open({
                    title: 'Select End of Line Sequence',
                    content: '',
                    buttons: [
                        {
                            text: 'LF',
                            onclick() {
                                simpleEdit.editor.endofline.set('LF');
                            }
                        },
                        {
                            text: 'CRLF',
                            onclick() {
                                simpleEdit.editor.endofline.set('CRLF');
                            }
                        }
                    ]
                });
            }
        }
    }
}

function init() {
    defineDefaultGEvt();
    loadMonaco("#mainEditor");
    defineDefaultMEvt();
    loadContext("#mainMenuStrip");
    loadDropdownLogic();
    loadLanguageList(simpleEdit.editor.language.registry);
    loadPreview();

    simpleEdit.security.warnConsole("Stop!", "Don't enter anything, unless you know what you're doing!");
    simpleEdit.editor.ui.update();

    ipc.on('openFile', function (event, data) {
        simpleEdit.file.open(data);
    });

    ipc.on('saveFileAd', function (event, data) {
        simpleEdit.file.current = data;
        simpleEdit.file.save(data);
        simpleEdit.editor.ui.update();
    });
}

init();