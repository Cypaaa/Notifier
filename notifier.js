/*
    Copyright (c) 2024 Cyprien (github: @Cypaaa)

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

class Notifier {
    #position = 9;

    /**
     * @description Create a new Notifier object
     * @param {Number} position from 1 to 9 (1: top-left, 2: top-center, 3: top-right, 4: center-left, 5: center-center, 6: center-right, 7: bottom-left, 8: bottom-center, 9: bottom-right)
     */
    constructor(position) {
        if (!isNaN(position) && position >= 1 && position <= 9) {
            this.#position = Number(position); // requires Number(...) else doesn't work, idk why
        }
    }

    /**
     * @description change the current position of the notifications
     * @param {Number} position from 1 to 9 (1: top-left, 2: top-center, 3: top-right, 4: center-left, 5: center-center, 6: center-right, 7: bottom-left, 8: bottom-center, 9: bottom-right)
     */
    setPosition(position) {
        if (!isNaN(position) && position >= 1 && position <= 9) {
            this.#position = Number(position); // requires Number(...) else doesn't work, idk why
        }
    }

    /**
     * 
     * @param {Object} settings {precall: Callback, postcall: Callback, duration: Number, data: {title: String, message: String}}
     */
    error(settings) { this.#show("error", settings); }

    /**
     * 
     * @param {Object} settings {precall: Callback, postcall: Callback, duration: Number, data: {title: String, message: String}}
     */
    warning(settings) { this.#show("warning", settings); }

    /**
     * 
     * @param {Object} settings {precall: Callback, postcall: Callback, duration: Number, data: {title: String, message: String}}
     */
    success(settings) { this.#show("success", settings); }

    /**
     * 
     * @param {Object} settings {precall: Callback, postcall: Callback, duration: Number, data: {title: String, message: String}}
     */
    info(settings) { this.#show("info", settings); }

    /**
     * 
     * @param {String} name the name of the class to be added to the notification (for custom styling), e.g "custom" will add the class "notifier-custom", "potatoe-chips" will add the class "notifier-potatoe-chips"
     * @param {Object} settings {precall: Callback, postcall: Callback, duration: Number, data: {title: String, message: String}}
     */
    custom(name, settings) { this.#show(name, settings); }

    getPosition() {
        switch (this.#position) {
            case 1:
                return "top: 1rem; left: 1rem;";
            case 2:
                return "top: 1rem; left: 50%; transform: translateX(-50%);";
            case 3:
                return "top: 1rem; right: 1rem;";
            case 4:
                return "top: 50%; left: 1rem; transform: translateY(-50%);";
            case 5:
                return "top: 50%; left: 50%; transform: translate(-50%, -50%);";
            case 6:
                return "top: 50%; right: 1rem; transform: translateY(-50%);";
            case 7:
                return "bottom: 1rem; left: 1rem;";
            case 8:
                return "bottom: 1rem; left: 50%; transform: translateX(-50%);";
            case 9:
                return "bottom: 1rem; right: 1rem;";
            default:
                this.#position = 9;
                return "bottom: 1rem; right: 1rem;";
        }
    }

    /**
     * @description Show a notification, call precall and postcall functions before and after showing the notification respectively
     * @param {Object} settings {precall: Callback, postcall: Callback, duration: Number, data: {title: String, message: String}}
     * @returns {void}
     */
    #show(type, settings) {
        // call precall
        if (settings.precall) {
            settings.precall();
        }

        // build popup
        let node = this.#builder(type, settings.data);

        // handle close button
        node.querySelector(".notifier-close").addEventListener("click", () => {
            this.#removeNode(node, settings.postcall);
        });

        // append popup to body
        document.body.appendChild(node);

        // remove popup after duration if set (else infinite)
        // could have done (Number(settings.duration) != NaN) but I prefer not to compare with a constant value
        if (!isNaN(settings.duration) && settings.duration > 0) {
            setTimeout(() => {
                this.#removeNode(node, settings.postcall);
            }, settings.duration);
            if (settings.duration_bar) {
                let duration = 15; // start at 15ms to avoid division by 0
                let interval = setInterval(() => {
                    let bar = node.querySelector(".duration-bar");
                    bar.style.width = `${(duration / settings.duration) * 100}%`;
                    duration += 16;
                    if (duration >= settings.duration) {
                        clearInterval(interval);
                    }
                }, 15);
            }
        }
    }

    #builder(type, data) {
        // Build the notification
        let notification = document.createElement("div");
        notification.classList.add("notifier-notification");
        notification.classList.add(`notifier-${type}`);
        notification.innerHTML = `
            <span class="notifier-close">&#x2715</span>
            <span>${data.title}</span>
            <p>${data.message}</p>
            <div class="duration-bar"></div>
        `;

        // should override the default position
        notification.style.cssText = this.getPosition();

        return notification; // return the first child of the container (the notification)
    }

    #removeNode(node, postcall) {
        node.remove();
        if (postcall) {
            postcall();
        }
    }
}

// make a lambda function so it won't interfere with the global scope or other scripts
(() => {
    // inject css styles
    let style = document.createElement('style');
    style.innerText = `.notifier-notification{z-index:9999;position:fixed;display:flex;flex-direction:column;justify-content:space-evenly;min-width:10rem;min-height:3rem;max-width:20rem;padding:5px 10px;color:#00f;font-family:'Roboto',sans-serif;border-left:4px solid #00f;border-radius:5px;background-color:#d8deec;box-shadow:0 0 10px #0000ff73}.notifier-close:hover{color:red}.notifier-notification>*{padding:5px 0}.notifier-notification>span{font-size:1.25rem;font-weight:700}.notifier-notification>p{margin:0;overflow:none;overflow-wrap:break-word}.notifier-close{position:absolute;top:3px;right:5px;padding:0;color:#000;cursor:pointer}.duration-bar{position:absolute;bottom:0;left:0;width:0;height:1px;margin:0;padding:0;background-color:#00f}.notifier-error{color:red;border-left-color:red;background-color:#f8d7da}.notifier-error .duration-bar{background-color:red}.notifier-warning{color:orange;border-left-color:orange;background-color:#fff3cd}.notifier-warning .duration-bar{background-color:orange}.notifier-success{color:green;border-left-color:green;background-color:#d4edda}.notifier-success .duration-bar{background-color:green}`;
    document.head.appendChild(style);
})();
