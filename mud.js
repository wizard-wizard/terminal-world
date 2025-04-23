// Command system and rendering

function render(text) {
    const output = document.getElementById("output");
    output.innerText = `\n\n${text}`;
    output.scrollTop = output.scrollHeight;
}

class Room {
    constructor(description, exits = {}) {
        this.description = description;
        this.exits = exits;
    }
}

const rooms = {
    start: new Room(
        "You are in a quiet little room. The wallpaper is smiling.",
        { north: "attic"}
    ),
    attic: new Room(
        "You are in a dusty attic full of neatly labeled boxes.",
        { south: "start"}
    )
};

const state = {
    location: "start"
};


function processInput(input) {
    const command = input.trim().toLowerCase();

    if (command === "look") {
        const currentRoom = rooms[state.location];
        render(currentRoom.description);
        return;
    }

    if (command.startsWith("go ")) {
        const direction = command.slice(3); // e.g., "north"
        const currentRoom = rooms[state.location];

        if (currentRoom.exits[direction]) {
            state.location = currentRoom.exits[direction];
            render(`You go ${direction}.`);
            render(rooms[state.location].description);
        } else {
            render("You can't go that way.");
        }
        return;
    }
    render("That won't work here.")
}

console.log("Script loaded: mud.js"); // Sanity check, remove when sane

document.addEventListener("DOMContentLoaded", () => {
    console.log("Concept MUD loaded");

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