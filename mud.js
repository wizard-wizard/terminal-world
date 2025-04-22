// Command system and rendering

function render(text) {
    const output = document.getElementById("output");
    output.innerText = text;
    output.scrollTop = output.scrollHeight;
}

function processInput(input) {
    const command = input.trim().toLowerCase();

    if (command === "look") {
        render("You are in the abyss. It's not very cozy here, but it's yours.")
    }
    render("That won't work here.");
}