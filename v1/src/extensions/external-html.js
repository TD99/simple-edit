const fs = require('fs');
const path = require('path');

function pathExists(objectPath){
    try{ fs.accessSync(path.resolve(__dirname, objectPath), fs.constants.F_OK); }
    catch(e){ return false; }
    return true;
  }

customElements.define('external-html', class extends HTMLElement{
    static observedAttributes = ['href']; /* registered attributes */
    constructor(){
      super();
    }
    refreshTagContent(){
        this.innerHTML = '';
        var href = path.resolve(__dirname, this.getAttribute("href")); /* get href attribute */
        if (href){
            if (pathExists(href)){
                if (fs.lstatSync(href).isFile()){
                    fs.readFile(href, 'utf8', (err, data) => {
                        if (err){
                            console.error(err);
                            return;
                        }
                        this.innerHTML = data;
                    });
                } else{
                    console.error("Error: The specified path is not a file: " + href + "\n" + this);
                }
            } else{
                console.error("The specified path does not exist: " + href + "\n" + this);
            }
        } else{
            console.error("No href-attribute was specified: " + "\n" + this);
        }
    }
    connectedCallback(){ /* on tag load */
      this.refreshTagContent();
    }
    attributeChangedCallback() {
      this.refreshTagContent();
    }
  });