describe("Command system" , () => {
    it("responds to 'look' command", () => {
        let testOutput = "";
        const originalRender = window.render;
        window.render = (text) => { testOutput += text; };
        state.location = "start"; // setting the location to test
        processInput("look");
        window.render = originalRender;
        assert(testOutput.includes("quiet little room"), "Expected start room description.");
    });

    it("fails gracefully on invalid command", () => {
        let testOutput = "";
        const originalRender = render;
        window.render = (text) => testOutput += text;
        processInput("dance");
        render = originalRender;
        assert(testOutput.includes("won't work"), "Should show fallback error message");
    });

    it("starts in the correct room", () => {
        assert(state.location === "start", "Player should start in the 'start' room");
    });

    it("moves to attic with 'go north'", () => {
        state.location = "start";
        processInput("go north");
        assert(state.location === "attic", "Player should be in the attic after going north");
    });
});

window.onload = () => {
    runTests()
};