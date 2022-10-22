class CustomActions {
    constructor(editorObj) {
        try {
            editorObj._id;
        } catch (e) {
            throw new Error("editorObj is invalid!");
        }
        this.editorObj = editorObj;
    }

    file = {
        new: () => {
            
        },
        open: () => {

        },
        showRecent: () => {

        },
        save: () => {

        },
        saveAs: () => {

        },
        close: () => {
            
        }
    }

    window = {
        close: () => {

        },
        minimize: () => {

        },
        maximize: () => {

        },
        create: () => {

        },
        devTools: {
            toggle: () => {
                
            }
        },
        reload: () => {

        },
        keyMapping: {
            show: () => {
                
            }
        },
        about: {
            show: () => {

            }
        }
    }

    app = {
        settings: {
            show: () => {

            }
        }
    }

    editor = {
        undo: () => {

        },
        redo: () => {

        },
        cut: () => {

        },
        copy: () => {

        },
        paste: () => {

        },
        find: () => {

        },
        replace: () => {

        },
        selectAll: () => {

        },
        comment: {
            toggleLine: () => {

            },
            toggleBlock: () => {

            }
        },
        language: {
            change: () => {

            },
            openDocs: () => {

            },
            openLearn: () => {

            }
        },
        gotoLine: () => {

        },
        changeSpacing: () => {

        },
        changeEncoding: () => {

        },
        saveAsTemplate: () => {

        }
    }
}