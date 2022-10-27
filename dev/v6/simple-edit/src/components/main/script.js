var $ = require('jquery');
const fs = require("fs");
const path = require("path");

const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

/* function appControlEvt(event){
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
} */

$(".ipcMinimize").on('click', () => {
    simpleEdit.window.minimize();
});

$(".ipcMaximize").on('click', () => {
    simpleEdit.window.maximize();
});

$(".ipcClose").on('click', () => {
    simpleEdit.window.close();
});

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
            'editor.selectionHighlightBackground': '#5c6a79',
            'editor.inactiveSelectionBackground': '#264f79',
            'editorWidget.background': '#252a34',
            'dropdown.background': '#252a34'
        }
    });
}

var mainEditor; //global
function loadMonaco(div, val, lang){
    $(div).empty();
    loadMonacoThemes();
    mainEditor = monaco.editor.create(document.querySelector(div), {
        value: val || "",
        language: lang || 'text',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: 'simpleEditDark',
        automaticLayout: true
    });
}
loadMonaco("#mainEditor");

var mainCtxMenu; //global
function setContext(config){
    mainCtxMenu = config || {
        "File": [
            {
                name: "se-newFile",
                displayName: "New File",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'n'
                    }
                ],
                global: true,
                run() {
                    simpleEdit.file.new();
                }
            },
            {
                name: "se-newWindow",
                displayName: "New Window",
                accelerator: [
                    {
                        ctrlKey: true,
                        shiftKey: true,
                        key: 'n'
                    }
                ],
                global: true,
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
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'o'
                    }
                ],
                global: true,
                run() {
                    simpleEdit.file.openDlg();
                }
            },
            {
                name: "se-openRecent",
                displayName: "Open Recent",
                accelerator: [
                    {
                        ctrlKey: true,
                        shiftKey: true,
                        key: 'o'
                    }
                ],
                global: true,
                run() {
                    simpleEdit.window.recent();
                }
            },
            {
                separator: true
            },
            {
                name: "se-save",
                displayName: "Save",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 's'
                    }
                ],
                global: true,
                run() {
                    simpleEdit.file.save();
                }
            },
            {
                name: "se-saveAs",
                displayName: "Save As",
                accelerator: [
                    {
                        ctrlKey: true,
                        shiftKey: true,
                        key: 's'
                    }
                ],
                global: true,
                run() {
                    simpleEdit.file.saveAs();
                }
            },
            {
                separator: true
            },
            {
                name: "se-settings",
                displayName: "Settings"
            },
            {
                separator: true
            },
            {
                name: "se-closeWindow",
                displayName: "Close Window",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'w'
                    }
                ],
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
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'z'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.undo();
                }
            },
            {
                name: "se-redo",
                displayName: "Redo",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'y'
                    }
                ],
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
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'x'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.cut();
                }
            },
            {
                name: "se-copy",
                displayName: "Copy",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'c'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.copy();
                }
            },
            {
                name: "se-paste",
                displayName: "Paste",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'v'
                    }
                ],
                alreadyRegistered: false,
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
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'f'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.find();
                }
            },
            {
                name: "se-replace",
                displayName: "Replace",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'h'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.replace();
                }
            },
            {
                separator: true
            },
            {
                name: "se-selectAll",
                displayName: "Select All",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'a'
                    }
                ],
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
                accelerator: [
                    {
                        ctrlKey: true,
                        key: '\u00A7'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.comment.toggleLine();
                }
            },
            {
                name: "se-blockComment",
                displayName: "Block Comment",
                accelerator: [
                    {
                        altKey: true,
                        shiftKey: true,
                        key: 'a'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.comment.toggleBlock();
                }
            }
        ],
        "Document": [
            {
                name: "se-changeLanguage",
                displayName: "Change Language",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'k'
                    },
                    {
                        ctrlKey: true,
                        key: 'm'
                    }
                ],
                run() {
                    simpleEdit.editor.language.change();
                }
            },
            {
                name: "se-languageDocs",
                displayName: "Language Docs",
                run() {
                    simpleEdit.editor.language.openDocs();
                }
            },
            {
                name: "se-learnLanguage",
                displayName: "Learn Language",
                run() {
                    simpleEdit.editor.language.openLearn();
                }
            },
            {
                separator: true
            },
            {
                name: "se-gotoLine",
                displayName: "Goto Line",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'g'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.editor.gotoLine();
                }
            },
            {
                separator: true
            },
            {
                name: "se-changeSpacing",
                displayName: "Change Spacing",
                accelerator: [
                    {
                        ctrlKey: true,
                        key: 'e'
                    }
                ],
                run() {
                    simpleEdit.editor.spacing.change();
                }
            },
            {
                name: "se-changeEndOfLine",
                displayName: "Change End of Line Sequence",
                accelerator: [
                    {
                        ctrlKey: true,
                        shiftKey: true,
                        key: 'e'
                    }
                ],
                run() {
                    simpleEdit.editor.endofline.change();
                }
            },
            {
                separator: true
            },
            {
                name: "se-saveAsTemplate",
                displayName: "Save as Template",
                run() {
                    simpleEdit.file.saveAsTemplate();
                }
            }
        ],
        "Help": [
            {
                name: "se-toggleDevTools",
                displayName: "Toggle Dev Tools",
                accelerator: [
                    {
                        ctrlKey: true,
                        shiftKey: true,
                        key: 'i'
                    }
                ],
                alreadyRegistered: true,
                run() {
                    simpleEdit.window.devTools.toggle();
                }
            },
            {
                name: "se-reloadWindow",
                displayName: "Reload Window",
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

    const parentE = $(appendTo);
    parentE.empty();

    Object.keys(mainCtxMenu).forEach(key => {
        const menuDropdown = $("<div>", { class: 'menuDropdown' });
        parentE.append(menuDropdown);

        const menuDropdownTitle = $("<span>", { class: 'menuDropdownTitle', text: key });
        const menuDropdownContent = $("<div>", { class: 'menuDropdownContent' });
        menuDropdown.append(menuDropdownTitle, menuDropdownContent);

        mainCtxMenu[key].forEach(item => {
            if (item.separator) {
                const separator = $("<div>", { class: 'menuDropdownSeparator' });
                menuDropdownContent.append(separator);
            } else {
                const menuDropdownButton = $("<div>", { class: 'menuDropdownButton ' + item.name });
                menuDropdownContent.append(menuDropdownButton);
                
                const menuDropdownButtonLbl = $("<span>", { class: 'menuDropdownButtonLbl', text: item.displayName });
                menuDropdownButton.append(menuDropdownButtonLbl);

                if (item.accelerator) {
                    let keyComb = [];

                    item.accelerator.forEach(comb => {
                        let keyInscance = [];
                        if (comb.ctrlKey) keyInscance.push("CTRL");
                        if (comb.altKey) keyInscance.push("ALT");
                        if (comb.shiftKey) keyInscance.push("SHIFT");
                        keyInscance.push(comb.key.toUpperCase());
                        keyComb.push(keyInscance.join(" + "));
                    });

                    const keyShortcut = $("<span>", { class: 'keyShortcut', text: keyComb.join(", ") });
                    menuDropdownButton.append(keyShortcut);

                    if (!item.alreadyRegistered) {
                        if (item.global) {
                            if (item.accelerator > 1) throw new Error("A global keyCombination cannot be complex!"); 
                            $(document).on('keydown', (e) => {
                                const ctrlKey = (item.accelerator[0].ctrlKey)?true:false;
                                const altKey = (item.accelerator[0].altKey)?true:false;
                                const shiftKey = (item.accelerator[0].shiftKey)?true:false;
                                const key = item.accelerator[0].key.toUpperCase();
                                
                                const eventKey = e.key.toUpperCase();

                                /* console.log(ctrlKey, e.ctrlKey, altKey, e.altKey, shiftKey, e.shiftKey, key, eventKey)
                                console.log((ctrlKey == e.ctrlKey), (altKey == e.altKey), (shiftKey == e.shiftKey), (key == eventKey)) */
                                if ((ctrlKey == e.ctrlKey) && (altKey == e.altKey) && (shiftKey == e.shiftKey) && (key == eventKey)) {
                                    item.run();
                                }
                            });
                        }/*  else {
                            const keyConfig = item.accelerator;
                            const keybinding = [];
                            for (let i = 0; i < keyConfig.length; i++) {
                                keybinding[i] = (keyConfig.ctrlKey)?monaco.KeyMod.CtrlCmd:null || (keyConfig.altKey)?monaco.KeyMod.AltCmd:null || (keyConfig.shiftKey)?monaco.KeyMod.ShiftCmd:null;
                            }
                            const keybindingChord = monaco.KeyMod.chord();

                            mainEditor.addAction({
                                // An unique identifier of the contributed action.
                                id: item.name + '_custom',
                            
                                // A label of the action that will be presented to the user.
                                label: item.displayName,
                            
                                // An optional array of keybindings for the action.
                                keybindings: [
                                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10,
                                    // chord
                                    monaco.KeyMod.chord(
                                        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
                                        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM
                                    )
                                ],
                            
                                // A precondition for this action.
                                precondition: null,
                            
                                // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
                                keybindingContext: null,
                            
                                contextMenuGroupId: 'navigation',
                            
                                contextMenuOrder: 1.5,
                            
                                // Method that will be executed when the action is triggered.
                                // @param editor The editor instance is passed in as a convenience
                                run: function (ed) {
                                    alert("i'm running => " + ed.getPosition());
                                }
                            });
                        } */
                    }
                }

                // add action
                if (item.run) {
                    $(menuDropdownButton).on('click', () => {
                        item.run();
                        $(menuDropdownButton).parents(".menuDropdownContent").hide();
                    });
                }
            }
        });
    });

}
loadContext("#mainMenuStrip");

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

$("body").click((e) => {
    if ($(e.target).parents(".menuDropdownContent").length){return;}
    $(".menuDropdownContent").hide();
});

$(document).on('keydown', (e) => {
    /* if((e.ctrlKey || e.altKey || e.shiftKey) && e.key) { //keyboard shortcut
        if (mainEditor.hasTextFocus()) { //Global Monaco keys
            if (e.ctrlKey && e.key == 'n') simpleEdit.file.new();
        }

        return;
    } */
    switch (e.key){
        case "Escape":
            $(".menuDropdownContent").hide();
            break;
        default:
            break;
    }
});

$(window).blur(()=>{
    $(".menuDropdownContent").hide();
});

/* $(window).resize((e) => {
    loadMonaco("#mainEditor", mainEditor.getValue(), $(".search").val());
}); */

function appendLang(target){
    monaco.editor.setModelLanguage(mainEditor.getModel(), $(target).val());
    const docsURL = $(target).find("option:selected").attr("data-docsURL");
    const learnURL = $(target).find("option:selected").attr("data-learnURL");
    if (docsURL == "undefined"){
        $(".docsIcon").attr("onclick", "");
        $(".docsIcon").hide();
    } else{
        $(".docsIcon").attr("onclick", "ipc.send('openExtURL', '" + docsURL +"')");
        $(".docsIcon").show();
    }
    if (learnURL == "undefined"){
        $(".learnIcon").attr("onclick", "");
        $(".learnIcon").hide();
    } else{
        $(".learnIcon").attr("onclick", "ipc.send('openExtURL', '" + learnURL +"')");
        $(".learnIcon").show();
    }
    if (mainEditor.getModel().getLanguageIdentifier().language != $(target).val()){
        loadLanguageList(programmingLanguages);
        alert("An error occured while changing the language.");
    }
}

$(".search").change((e)=>{
    appendLang(e.target);
});

function changeLang(lang, target){
    monaco.editor.setModelLanguage(mainEditor.getModel(), lang);
    $(target).val(lang);
}

class programmingLanguage{
    constructor(displayname, name, extensions, docs, learn, isDefault){
        this.displayname = displayname;
        this.name = name;
        this.extensions = extensions;
        this.docs = undefined || docs;
        this.learn = undefined || learn;
        this.isDefault = false || isDefault;
    }
}

var programmingLanguages = [
    new programmingLanguage("Batch", "bat", ["bat", "cmd"], undefined, "https://www.tutorialspoint.com/batch_script/index.htm"),
    new programmingLanguage("C", "c", ["c", "i"], "https://devdocs.io/c/", "https://www.w3schools.com/c/index.php"),
    new programmingLanguage("C#", "csharp", ["cs", "csx", "cake"], "https://learn.microsoft.com/en-us/dotnet/csharp/", "https://www.w3schools.com/cs/index.php"),
    new programmingLanguage("C++", "cpp", ["cpp", "cc", "cxx", "c++", "hpp", "hh", "hxx", "h++", "h", "i"], "https://devdocs.io/cpp/", "https://www.w3schools.com/cpp/default.asp"),
    new programmingLanguage("Clojure", "clojure", ["clj", "cljs", "cljc", "clojure", "edn"], "https://clojure.org/index", "https://clojure.org/guides/learn/clojure"),
    new programmingLanguage("CoffeeScript", "coffeescript", ["coffee", "cson", "iced"], "https://coffeescript.org/#introduction", "https://www.tutorialspoint.com/coffeescript/index.htm"),
    new programmingLanguage("CSS", "css", ["css"], "https://developer.mozilla.org/en-US/docs/Web/CSS", "https://www.w3schools.com/css/default.asp"),
    new programmingLanguage("Dart", "dart", ["dart"], "https://dart.dev/guides", "https://dart.dev/tutorials"),
    new programmingLanguage("Docker", "dockerfile", ["dockerfile", "containerfile"], "https://docs.docker.com/engine/reference/builder/", undefined),
    new programmingLanguage("F#", "fsharp", ["fs", "fsi", "fsx", "fsscript"], "https://fsharp.org/docs/", "https://fsharp.org/learn/"),
    new programmingLanguage("Go", "go", ["go"], "https://go.dev/doc/", "https://go.dev/learn/"),
    new programmingLanguage("HTML", "html", ["html", "htm", "shtml", "xhtml", "xht", "mdoc", "jsp", "asp", "aspx", "jshtm"], "https://developer.mozilla.org/en-US/docs/Web/HTML", "https://www.w3schools.com/html/default.asp"),
    new programmingLanguage("Ini", "ini", ["ini"], undefined, "https://www.w3schools.io/file/ini-extension-introduction/"),
    new programmingLanguage("Java", "java", ["java", "jav", "class"], "https://dev.java/learn/", "https://www.w3schools.com/java/default.asp"),
    new programmingLanguage("JavaScript", "javascript", ["js", "es6", "mjs", "cjs", "pac", "jsx"], "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "https://www.w3schools.com/js/default.asp"),
    new programmingLanguage("JSON", "json", ["json", "bowerrc", "jscsrc", "webmanifest", "map", "har", "jslintrc", "jsonld"], "https://www.json.org/json-en.html", "https://www.w3schools.com/js/js_json_intro.asp"),
    new programmingLanguage("Julia", "julia", ["jl"], "https://docs.julialang.org/en/v1/", "https://julialang.org/learning/"),
    new programmingLanguage("Lua", "lua", ["lua"], "https://www.lua.org/docs.html", "https://www.tutorialspoint.com/lua/index.htm"),
    new programmingLanguage("Markdown", "markdown", ["md", "mkd", "mdwn", "mdown", "markdown", "markdn", "mdtxt", "mdtext", "workbook"], "https://www.markdownguide.org/basic-syntax/", "https://www.markdowntutorial.com/"),
    new programmingLanguage("Objective-C", "objective-c", ["m"], "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html", "https://www.tutorialspoint.com/objective_c/index.htm"),
    new programmingLanguage("Perl", "perl", ["pl", "pm", "pod", "t", "PL", "psgi"], "https://www.perl.org/docs.html", "https://www.tutorialspoint.com/perl/index.htm"),
    new programmingLanguage("PHP", "php", ["php", "php4", "php5", "phtml", "ctp"], "https://www.php.net/manual/en/", "https://www.w3schools.com/php/default.asp"),
    new programmingLanguage("Plain Text", "plaintext", ["txt"], undefined, undefined, true),
    new programmingLanguage("PowerShell", "powershell", ["ps1", "psm1", "psd1", "pssc", "psrc"], "https://learn.microsoft.com/en-us/powershell/", "https://www.tutorialspoint.com/powershell/index.htm"),
    new programmingLanguage("Pug", "pug", ["pug", "jade"], "https://pugjs.org/api/getting-started.html", "https://www.sitepoint.com/a-beginners-guide-to-pug/"),
    new programmingLanguage("Python", "python", ["py", "rpy", "pyw", "cpy", "gyp", "gypi", "pyi", "ipy", "pyt"], "https://docs.python.org/", "https://www.w3schools.com/python/default.asp"),
    new programmingLanguage("R", "r", ["r", "rhistory", "rprofile", "rt"], "https://cran.r-project.org/manuals.html", "https://www.w3schools.com/r/default.asp"),
    new programmingLanguage("reStructuredText", "restructuredtext", ["rst"], "https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html", "https://www.writethedocs.org/guide/writing/reStructuredText/"),
    new programmingLanguage("Ruby", "ruby", ["rb", "rbx", "rjs", "gemspec", "rake", "ru", "erb", "podspec", "rbi"], "https://www.ruby-lang.org/de/documentation/", "https://www.tutorialspoint.com/ruby/index.htm"),
    new programmingLanguage("Rust", "rust", ["rs"], "https://doc.rust-lang.org/std/", "https://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/README.html"),
    new programmingLanguage("Shell Script", "shell", ["sh", "bash", "bashrc", "bash_aliases", "bash_profile", "bash_login", "ebuild", "profile", "bash_logout", "xprofile"], "https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html", "https://learnxinyminutes.com/docs/bash/"),
    new programmingLanguage("SQL", "sql", ["sql", "dsql"], undefined, "https://www.w3schools.com/sql/default.asp"),
    new programmingLanguage("Swift", "swift", ["swift"], "https://www.swift.org/documentation/", "https://docs.swift.org/swift-book/GuidedTour/GuidedTour.html"),
    new programmingLanguage("TypeScript", "typescript", ["ts", "cts", "mts"], "https://www.typescriptlang.org/docs/", "https://www.w3schools.com/typescript/"),
    new programmingLanguage("Visual Basic", "vb", ["vb", "brs", "vbs", "bas", "vba"], "https://learn.microsoft.com/en-us/dotnet/visual-basic/", "https://www.tutorialspoint.com/vb.net/index.htm"),
    new programmingLanguage("XML", "xml", ["xml", "xsd", "ascx", "atom", "axml", "axaml", "bpmn", "cpt", "csl", "csproj"], "https://www.w3.org/TR/xml/", "https://www.w3schools.com/xml/default.asp"),
    new programmingLanguage("YAML", "yaml", ["yml", "cyaml", "cyml", "yaml", "cff"], "https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html", "https://www.cloudbees.com/blog/yaml-tutorial-everything-you-need-get-started")
];

function loadLanguageList(list){
    $(".search").empty();
    list.forEach(e => {
        const defaultStr = (e.isDefault)?" selected":"";
        $(".search").append('<option value="' + e.name + '" data-docsURL="' + e.docs + '" data-learnURL="' + e.learn + '"' + defaultStr + '>' + e.displayname + '</option>');
    });
    appendLang(".search");
}

loadLanguageList(programmingLanguages);

/* var currentFile = ""; */

/* function openFile(file, detectFileExt=false){
    const buffer = fs.readFileSync(file);
    const content = buffer.toString();
    mainEditor.setValue(content);
    if (detectFileExt){
        const ext = path.parse(file).ext;
        programmingLanguages.forEach(e => {
            e.extensions.forEach(f => {
                if('.' + f == ext){
                    changeLang(e.name, ".search");
                }
            });
        });
    }
    currentFile = file;
    $(".fileName").text(path.parse(currentFile).base);
    changeAutoSaveStatus(false, $("#autoSave"));
} */

/* function closeFile(newFileExt="plaintext"){
    currentFile = "";
    mainEditor.setValue("");
    $(".fileName").text("New Document");
    changeAutoSaveStatus(false, $("#autoSave"));
} */

/* function saveFile(file){
    fs.writeFile(file, mainEditor.getValue(), function (err){
        if (err) throw err;
        console.log("Saved successfully!");
    });
} */

/* function saveFile(){
    if (currentFile){
        fs.writeFile(currentFile, mainEditor.getValue(), function (err){
            if (err) throw err;
            console.log("Saved successfully!");
        });
    }
} */

/* $(".se-newFile").on('click', () => {
    simpleEdit.file.new();
}); */


$(".menuDropdownButton").on('click', () => {

});

var autosave = false;

mainEditor.getModel().onDidChangeContent((evt) => {
    if (simpleEdit.file.current && simpleEdit.file.autoSave.status){
        simpleEdit.file.save();
    }
});

/* function warnUserDevTools(title, text){
    style = {
        title: "color:red;font-size:4rem;font-weight:bold;-webkit-text-stroke: 1px black;",
        text: "color:red;font-size:1.5rem;font-weight:bold;"
    };

    if (title){
        title = "%c" + title;
        console.log(title, style["title"]);
    }

    if (text){
        text = "%c" + text;
        console.log(text, style["text"]);
    }
}

warnUserDevTools("Stop!", "Don't enter anything, unless you know what you're doing!"); */

mainEditor.onDidChangeCursorPosition((evt) => {
    const pos = mainEditor.getPosition();
    $(".lineData").text("Ln " + pos.lineNumber + ", Col " + pos.column);
});

/* function changeAutoSaveStatus(turnOn, element){
    autosave = turnOn;

    if (!currentFile && (autosave || turnOn)){
        changeAutoSaveStatus(false, element);
        return false;
    }

    if (element){
        $(element).get().forEach(item => {
            item.checked = turnOn;
        });
    }
} */

function triggerMonacoEvt(action, editor=mainEditor){
    editor.focus();
    editor.trigger('action', action);
}

$(".lineData").click(() => {
    triggerMonacoEvt('editor.action.gotoLine', mainEditor);
});

ipcRenderer.on('openFile', function (event, data) {
    alert(data);
});

const simpleEdit = {
    file: {
        current: "",
        new() {
            simpleEdit.window.create(); //dep

            /* if (this.current) {
            } else {
                this.close();
            } Later */ 
        },
        open(file, detectFileExt=true) {
            if (this.current) {
                
            } else {
                const buffer = fs.readFileSync(file);
                const content = buffer.toString();
                mainEditor.setValue(content);
                if (detectFileExt) {
                    const ext = path.parse(file).ext;
                    programmingLanguages.forEach(e => { //dep
                        e.extensions.forEach(f => {
                            if('.' + f == ext){
                                changeLang(e.name, ".search");
                            }
                        });
                    });
                }
                this.current = file;
                $(".fileName").text(path.parse(this.current).base);
                this.autoSave.setStatus(false); //dep
            }
        },
        openDlg() {
            console.log("open Dlg"); //dep
        },
        save(file) {
            fs.writeFile(file, mainEditor.getValue(), function (err){
                if (err) throw err;
                console.log("Saved successfully! (" + file + ")");
            });
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
            if (this.current){
                fs.writeFile(this.current, mainEditor.getValue(), function (err){
                    if (err) throw err;
                    console.log("Saved successfully! (" + this.current + ")");
                });
            } else {
                this.saveAs();
            }
        },
        saveAs() {

        },
        saveAsTemplate() {

        },
        close(force=false) {
            if (!force && !confirm("Sure?")) return false; //dep
            this.current = "";
            mainEditor.setValue("");
            monaco.editor.setModelLanguage(mainEditor.getModel(), "plaintext");
            $(".fileName").text("New Document");
            this.autoSave.setStatus(false); //dep
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
                alert("keyMapping");
            }
        },
        about: {
            show() {
                alert("about");
            }
        },
        recent: {
            show() {
                alert("recent");
            }
        }
    },
    settings: {
        show() {
            alert("settings");
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
            change() {
                alert("Change Lang");
            },
            openDocs() {

            },
            openLearn() {

            }
        },
        gotoLine() {
            triggerMonacoEvt('editor.action.gotoLine');
        },
        spacing: {
            change: {
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
                alert("Change End of Line");
            }
        }
    }
}
simpleEdit.security.warnConsole("Stop!", "Don't enter anything, unless you know what you're doing!");


// Experimental
const shell = require('node-powershell');