const fs = require('fs');
const inquirer = require('inquirer');
const path = require ('path');

const WORLD_FILE = path.join(__dirname, 'world.json');

//Load world data or start a new world
let world = {};
if (fs.existsSync(WORLD_FILE)) {
    world = JSON.parse(fs.readFileSync(WORLD_FILE));
}

async function main() {
    const room = await inquirer.prompt([
        {name: 'id', message: 'Room ID:'},
        {name: 'desc', message: 'Room description:'},
        {name: 'exits', message: 'Exits (format: north:hall, east:kitchen):'}
    ]);

    const exitPairs = room.exits.split(',').map(pair => pair.trim().split(':'));
    const exits = Object.fromEntries(exitPairs);

    world[room.id] = {
        description: room.desc,
        exits
    };

    fs.writeFileSync(WORLD_FILE, JSON.stringify(world, null, 2));
    console.log(`Room "${room.id}" saved to ${WORLD_FILE}`);
}

main();
