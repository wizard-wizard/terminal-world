const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const WORLD_FILE = path.join(__dirname, 'world.json');

// Load existing world data or start from nothing
let world = {};
if (fs.existsSync(WORLD_FILE)) {
    const raw = fs.readFileSync(WORLD_FILE, 'utf-8');
    world = raw.trim() ? JSON.parse(raw) : {};
}

async function main() {
    const answers = await inquirer.prompt([
        { name: 'id', message: 'Room ID (e.g., attic)' },
        { name: 'desc', message: 'Room description' },
        { name: 'exits', message: 'Exits (e.g., north:kitchen, south:hall)' }
    ]);

    const exits = {};
    if (answers.exits.trim()) {
        answers.exits.split(',').forEach(pair => {
            const [dir, dest] = pair.split(':').map(p => p.trim());
            exits[dir] = dest;
        });
    }

    world[answers.id] = {
        description: answers.desc,
        exits
    };

    fs.writeFileSync(WORLD_FILE, JSON.stringify(world, null, 2));
    console.log(`Saved room "${answers.id}" to world.json`);
}

main();
