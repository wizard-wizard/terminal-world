let inputBuffer = "";
let cursor;
let playerTurn = false;
const rooms = {};
const state = {
    location: "start",
    flags: {}
};

// --- Utility Functions ---

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setPromptActive(active) {
    playerTurn = active;
    const inputArea = document.getElementById("input-area");

    if (active) {
        while (inputArea.firstChild) {
            inputArea.removeChild(inputArea.firstChild);
        }

        const promptText = document.createTextNode("> ");
        inputArea.appendChild(promptText);

        cursor = document.createElement("span");
        cursor.className = "cursor";
        cursor.innerText = "_";
        inputArea.appendChild(cursor);

        inputBuffer = "";
    } else {
        inputArea.innerHTML = "";
    }
}

async function typeLine(text, type = "default") {
    playerTurn = false;

    const outputArea = document.getElementById("output-area");
    const line = document.createElement("div");
    line.className = `line ${type}`;
    outputArea.appendChild(line);

    let index = 0;
    const glitchChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{};':\",./<>?";

    function randomChar() {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }

    async function typeNext() {
        if (index < text.length) {
            const realChar = text.charAt(index);

            if (Math.random() < 0.15 && realChar !== " " && realChar !== "\n") {
                line.innerText += randomChar();
                await delay(30);
                line.innerText = line.innerText.slice(0, -1);
            }

            line.innerText += realChar;
            index++;
            outputArea.scrollTop = outputArea.scrollHeight;

            setTimeout(typeNext, 20);
        } else {
            playerTurn = true;
            setPromptActive(true);
        }
    }

    typeNext();
}

function render(text, options = {}) {
    const outputArea = document.getElementById("output-area");
    const outputLine = document.createElement("div");
    outputLine.className = "output-line";
    outputLine.innerText = text;
    outputArea.appendChild(outputLine);

    if (!options.noScroll) {
        outputArea.scrollTop = outputArea.scrollHeight;
    }
}

// --- Room and World Loader ---

class Room {
    constructor(descriptionFn, exits = {}, actions = {}) {
        this.getDescription = descriptionFn;
        this.exits = exits;
        this.actions = actions;
    }
}

function createRoomsFromData(data) {
    for (const id in data) {
        const roomData = data[id];
        const descFn = typeof roomData.description === "function"
            ? roomData.description
            : () => roomData.description;

        rooms[id] = new Room(
            descFn,
            roomData.exits || {},
            roomData.actions || {}
        );
    }
}

async function loadWorld() {
    const res = await fetch('./world.json');
    const data = await res.json();
    createRoomsFromData(data);
}

// --- Command Handling ---

function processInput(input) {
    const command = input.trim().toLowerCase();

    if (command === "look") {
        const currentRoom = rooms[state.location];
        typeLine(currentRoom.getDescription(state));
        return;
    }

    if (command.startsWith("go ")) {
        const direction = command.slice(3);
        const currentRoom = rooms[state.location];

        if (currentRoom.exits[direction]) {
            state.location = currentRoom.exits[direction];
            typeLine(`You go ${direction}.`);
            typeLine(rooms[state.location].getDescription(state));
        } else {
            typeLine("You can't go that way.");
        }
        return;
    }

    if (command === "help") {
        showHelp();
        return;
    }

    const currentRoom = rooms[state.location];
    if (currentRoom.actions && currentRoom.actions[command]) {
        const result = currentRoom.actions[command]();
        typeLine(result);
        return;
    }

    typeLine("That won't work here.");
}

function showHelp() {
    const helpText = `
Commands you can try:
  look - observe your surroundings
  go [direction] - move to another place (e.g., 'go north')
  sit, pet, examine [object] - interact with things around you
  help - show this list again
  `;
    typeLine(helpText.trim(), "hint");
}

// --- Onboarding Boot Sequence ---

async function playOnboarding() {
    await typeLine("Soft static fades. Something flickers to life.", "system");
    await delay(1000);
    await typeLine("You are connected to the Worldbuilder Interface.", "system");
    await delay(800);
    await typeLine("A cursor blinks, waiting for your first command.", "system");
    await delay(800);
    await typeLine("(Type 'look' to begin.)", "hint");
    await delay(500);
    setPromptActive(true);
}

// --- Main Setup ---

document.addEventListener("DOMContentLoaded", async () => {
    terminal = document.getElementById("terminal");

    terminal.focus();

    await loadWorld();
    triggerFlicker();
    state.location = "start";

    await playOnboarding();

    document.addEventListener("keydown", function(e) {
        if (!terminal || !cursor) return;

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            inputBuffer += e.key;
            cursor.insertAdjacentText("beforebegin", e.key);
        }
        else if (e.key === "Backspace") {
            if (inputBuffer.length > 0) {
                inputBuffer = inputBuffer.slice(0, -1);

                let prev = cursor.previousSibling;
                while (prev && prev.nodeType !== Node.TEXT_NODE) {
                    prev = prev.previousSibling;
                }

                if (prev) {
                    prev.textContent = prev.textContent.slice(0, -1);
                    if (prev.textContent.length === 0) {
                        prev.remove();
                    }
                }
            }
        }
        else if (e.key === "Enter") {
            const input = inputBuffer;
            inputBuffer = "";

            const outputArea = document.getElementById("output-area");
            const echoLine = document.createElement("div");
            echoLine.className = "output-line";
            echoLine.innerText = "> " + input;
            outputArea.appendChild(echoLine);

            outputArea.scrollTop = outputArea.scrollHeight;

            // 🧹 Clear the input prompt manually
            const inputArea = document.getElementById("input-area");
            while (inputArea.firstChild) {
                inputArea.removeChild(inputArea.firstChild);
            }

            processInput(input);
        }
    });
});

// --- CRT Flicker Effect ---

function triggerFlicker() {
    const flicker = document.getElementById("flicker-overlay");
    if (!flicker) return;

    flicker.style.transition = "opacity 0.1s ease";
    flicker.style.opacity = "0.8";

    setTimeout(() => {
        flicker.style.opacity = "0";
        setTimeout(() => {
            flicker.style.opacity = "0.4";
            setTimeout(() => {
                flicker.style.opacity = "0";
            }, 80);
        }, 100);
    }, 100);
}
