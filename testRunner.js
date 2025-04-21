// Lightweight MUD Testing Framework

const testResults = [];

function describe(desc, fn) {
    testResults.push({ type: "section", desc });
    fn();
}

function it(desc, fn) {
    try {
        fn();
        testResults.push({ type: "pass", desc });
    } catch (e) {
        testResults.push({ type: "fail", desc, error: e });
    }
}

function assert(condition, message = "Assertion failed") {
    if (!condition) throw new Error(message);
}

function runTests() {
    const container = document.createElement("div");
    container.style = "background: #f8f5ef; border: 2px dashed #e4e4e4; padding: 1rem; font-family: monospace; margin-top: 2rem";

    testResults.forEach(result => {
        const line = document.createElement("div");
        if (result.type === "section") {
            line.innerHTML = `<strong>${result.desc}</strong>`;
            line.style.color = "red";
            line.style.marginBottom = "1rem";
        } else if (result.type === "pass") {
            line.textContent = `☺︎ ${result.desc}`;
            line.style.color = "green";
        } else if (result.type === "fail") {
            line.textContent = `☹︎ ${result.desc}`;
            line.style.color = "red";
        }
        container.appendChild(line);
    })
    document.body.appendChild(container);
}