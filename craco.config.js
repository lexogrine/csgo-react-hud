const path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();
const internalIp = require('internal-ip');
const OpenBrowserPlugin = require('./OpenBrowserPlugin');

const pathToConfig = path.join(process.env.APPDATA || path.join(homedir, '.config'), 'hud-manager', 'databases', 'config');
let port = 1349;

const getPort = () => {
    if(!fs.existsSync(pathToConfig)){
        console.warn('LHM Config file unavailable');
        return port;
    }

    try {
        const config = JSON.parse(fs.readFileSync(pathToConfig, 'utf-8'));

        if(!config.port){
            console.warn('LHM Port unavailable');
        }

        console.warn('LHM Port detected as', config.port);
        return config.port;
        
    } catch {
        console.warn('LHM Config file invalid');
        return port;
    }
}

port = getPort();

module.exports = {
    devServer: {
        port: 3500,
        open: false
    },
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.plugins.push(new OpenBrowserPlugin({ url: `http://${internalIp.v4.sync()}:${port}/development/`}))
            return webpackConfig;
        }
    }
};