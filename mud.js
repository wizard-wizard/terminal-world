// Command system and rendering

function render(text) {
    const output = document.getElementById("output");
    output.innerText = `\n\n${text}`;
    output.scrollTop = output.scrollHeight;
}

function processInput(input) {
    const command = input.trim().toLowerCase();

    if (command === "look") {
        render("You are in the abyss. It's not very cozy here, but it's yours.")
        return;
    }
    render("That won't work here.");
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