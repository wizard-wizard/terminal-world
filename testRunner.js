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
    container.style = "background: ghostwhite; border: 2px dashed grey; padding: 1rem; font-family: monospace; margin-top: 2rem";

    let passed = 0;
    let failed = 0;

    testResults.forEach(result => {
        const line = document.createElement("div");
        if (result.type === "section") {
            line.innerHTML = `<strong>${result.desc}</strong>`;
            line.style.color = "red";
            line.style.marginBottom = "1rem";
        } else if (result.type === "pass") {
            line.textContent = `☺︎ ${result.desc}`;
            line.style.color = "green";
            passed++;
        } else if (result.type === "fail") {
            line.textContent = `☹︎ ${result.desc}`;
            line.style.color = "red";
            failed++;
        }
        container.appendChild(line);
    });

    const summary = document.createElement("div");
    summary.style = "margin-top: 1rem; font-weight: bold;";
    summary.innerHTML = `
    <hr>
    Tests completed at ${new Date().toLocaleTimeString()} <br>
    🔆 Passed: ${passed} &nbsp; 💔 Failed: ${failed}
  `;
    container.appendChild(summary);

    document.body.appendChild(container);
}