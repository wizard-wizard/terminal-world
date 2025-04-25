// Command system and rendering

function render(text) {
    const output = document.getElementById("output");
    console.log("🖋️ Rendering:", JSON.stringify(text));

    if (!output) {
        console.error("❌ Output element not found!");
        return;
    }

    // New: force log of current content
    console.log("🔍 Before render, output innerText is:", output.innerText);

    output.innerText += `\n\n${text}`;

    console.log("✅ After render, output innerText is:", output.innerText);
}

//render("💥 HELLO FROM THE TOP OF THE FILE 💥");

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

        console.log(`Creating room: ${id}`);
        console.log("  description:", roomData.description);

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
const rooms = {};

const state = {
    location: "start",
    flags: {
        hasSatInAttic: false,
        hasPettedCat: false
    }
};

function processInput(input) {
    const command = input.trim().toLowerCase();

    if (command === "look") {
        const currentRoom = rooms[state.location];
        render(currentRoom.getDescription(state));
        return;
    }

    if (command.startsWith("go ")) {
        const direction = command.slice(3); // e.g., "north"
        const currentRoom = rooms[state.location];

        if (currentRoom.exits[direction]) {
            state.location = currentRoom.exits[direction];
            render(`You go ${direction}.`);
            render(rooms[state.location].getDescription(state));
        } else {
            render("You can't go that way.");
        }
        return;
    }

    const currentRoom = rooms[state.location];
    if (currentRoom.actions[command]) {
        const result = currentRoom.actions[command]();
        render(result);
        return;
    }

    render("That won't work here.")
}

console.log("Script loaded: mud.js"); // Sanity check, remove when sane
// render("This is a test. If you see this, rendering works.");

function showRoom() {
    const currentRoom = rooms[state.location];
    console.log("Calling showRoom()");
    console.log("Current room ID:", state.location);
    console.log("Room object:", currentRoom);

    if (!currentRoom) {
        render("You are nowhere. The void echoes.");
        return;
    }

    const desc = currentRoom.getDescription(state);
    console.log("📝 Room description:", desc);
    render(desc);
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadWorld(); // from index.html
    createRoomsFromData(window.MUD_WORLD_DATA);

    console.log("World loaded:", Object.keys(rooms));

    state.location = "start";

    console.log("DOM fully loaded, about to render welcome text...");
    render("Welcome to the Worldbuilder.");
    showRoom();

    const input = document.getElementById("input");
    if (!input) {
        console.error("Input element not found");
        return;
    }

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const userInput = this.value;
            this.value = '';
            render(`> ${userInput}`);
            processInput(userInput);
        }
    });
});