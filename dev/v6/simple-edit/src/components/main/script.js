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
        default:
            break;
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
    $(div).empty();
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
    loadMonaco("#mainEditor", mainEditor.getValue(), $(".search").val());
});

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

function openFile(file, detectFileExt=false){
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
}