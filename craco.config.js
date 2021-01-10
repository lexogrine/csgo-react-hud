const path = require('path');
const fs = require('fs');
const pathToConfig = path.join(process.env.APPDATA, 'hud-manager', 'databases', 'config');
let query = '';
if (fs.existsSync(pathToConfig)) {
    try {
        const config = JSON.parse(fs.readFileSync(pathToConfig, 'utf-8'));
        if (config.port) {
            query = `?port=${config.port}`
            console.log('LHM Port detected as', config.port);
        } else {
            console.log('LHM Port unavailable');
        }
    } catch {
        console.log('LHM Config file invalid');
    }
} else {
    console.log('LHM Config file unavailable');
}

module.exports = {
    devServer: {
        port: 3500,
        open: true,
        host: 'localhost',
        openPage: query
    }
};