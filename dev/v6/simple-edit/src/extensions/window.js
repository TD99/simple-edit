customElements.define('electron-window', class extends HTMLElement{
    static observedAttributes = []; /* registered attributes */
    constructor(){
        super();
    }
    connectedCallback(){
        this.style.cssText = `
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 1px solid #343B48;
            box-sizing: border-box;
            background: transparent;
        `;
    }
});