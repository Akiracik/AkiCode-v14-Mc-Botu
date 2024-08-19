const fs = require('fs').promises;
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', '..', 'data');

async function readData(fileName) {
    const filePath = path.join(DATA_PATH, `${fileName}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {};
        }
        throw error;
    }
}

async function writeData(fileName, data) {
    const filePath = path.join(DATA_PATH, `${fileName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function getUserData(userId) {
    const users = await readData('users');
    return users[userId] || { inventory: {}, upgrades: {}, enchants: {} };
}

async function updateUserData(userId, userData) {
    const users = await readData('users');
    users[userId] = userData;
    await writeData('users', users);
}

module.exports = {
    getUserData,
    updateUserData
};