export const InputManager = {
    keys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Enter: false,
        Space: false
    },

    init() {
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
                e.preventDefault(); // Prevent scrolling
            } else if (e.code === 'Space') {
                this.keys.Space = true;
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            } else if (e.code === 'Space') {
                this.keys.Space = false;
            }
        });
    },

    isKeyDown(key) {
        return this.keys[key];
    },

    clearInputs() {
        for(let key in this.keys) {
            this.keys[key] = false;
        }
    }
};
