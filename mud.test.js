describe("Command system" , () => {
    it('can parse the look command', () => {
        let testOutput = "";
        const originalRender = render;
        render = (text) => testOutput += text;
        processInput("look");
        render = originalRender;
        assert(testOutput.includes("abyss"), "Look should show description of the room the user is in.");
    });

    it("fails gracefully on invalid command", () => {
        let testOutput = "";
        const originalRender = render;
        render = (text) => testOutput += text;
        processInput("dance");
        render = originalRender;
        assert(testOutput.includes("won't work"), "Should show fallback error message");
    });
});

runTests();
