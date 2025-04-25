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

    it("executes a room-specific command", () => {
        state.location = "attic";
        let output = "";
        const originalRender = window.render;
        window.render = (text) => output += text;

        processInput("sit");

        window.render = originalRender;
        assert(output.includes("rocking chair"), "Should describe sitting in the attic chair");
    });

    it("updates description based on flags", () => {
        state.location = "attic";
        state.flags.hasSatInAttic = true;
        state.flags.hasPettedCat = false;

        let output = "";
        const originalRender = window.render;
        window.render = (text) => output += text;

        processInput("look");

        window.render = originalRender;
        assert(output.includes("contented"), "Should reflect sitting");
        assert(output.includes("suspiciously"), "Cat hasn't been petted");
    });
});

window.onload = () => {
    runTests()
};