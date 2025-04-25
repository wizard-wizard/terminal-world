// Command system and rendering

function render(text) {
    const output = document.getElementById("output");
    output.innerText = `\n\n${text}`;
    output.scrollTop = output.scrollHeight;
}

class Room {
    constructor(descriptionFn, exits = {}, actions = {}) {
        this.getDescription = descriptionFn;
        this.exits = exits;
        this.actions = actions;
    }
}

const rooms = {
    start: new Room(
        (state) => {
            return " You are in a quiet little room. The wallpaper is smiling.";
        },
        { north: "attic"},
        {
            sit: () => " You sit cross-legged on the floor. The carpet is soft and warm."
        }
    ),
    attic: new Room(
        (state) => {
            let desc = " You are in a dusty attic full of neatly labeled boxes."
            if (state.flags.hasSatInAttic) {
                desc  += "The rocking chair casts a contented shadow. It remembers you.";
            } else {
                desc += " A rocking chair waits patiently in the corner.";
            }
            if (state.flags.hasPettedCat) {
                desc += " The cat is closer now, almost friendly.";
            } else {
                desc += " A cat eyes you suspiciously from the shadows."
            }
            return desc;
        },
        { south: "start"},
        {
            sit: () => {
                state.flags.hasSatInAttic = true;
                return "You settle down into a rocking chair. It creaks with approval."
            },
            pet: () => {
                state.flags.hasPettedCat = true;
                return "The cat purrs enthusiastically."
            }
        }
    )
};

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