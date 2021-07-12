const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const sign = () => {
    const getAllFilesToSign = (hudDir) => {
        const files = [];
        const getFiles = (dir) => {
            fs.readdirSync(dir).forEach(file => {
                const fileDirectory = path.join(dir, file);
                if (fs.statSync(fileDirectory).isDirectory()) return getFiles(fileDirectory);
                else if (fileDirectory.endsWith('.js') || fileDirectory.endsWith('.css')) return files.push(fileDirectory);
            })
        }
        getFiles(hudDir)
        return files;
    }
    
    const dir = path.join(__dirname, 'build');
    
    const keyFile = path.join(dir, 'key');
    
    if (fs.existsSync(keyFile)) {
        return true;
    }
    
    const filesToSign = getAllFilesToSign(dir);
    const passphrase  = crypto.randomBytes(48).toString('hex');
    
    filesToSign.push(path.join(dir, 'hud.json'));
    
    const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase
        }
    });
    
    let success = true;
    
    const fileToContent = {};
    
    filesToSign.forEach(file => {
        if (!success) {
            return;
        }
        const content = fs.readFileSync(file, 'utf8');
        try {
            const signed = jwt.sign(content, { key: keys.privateKey.toString(), passphrase }, { algorithm: 'RS256' });
            fileToContent[file] = signed;
        } catch {
            success = false;
        }
    
    });
    
    if (!success) return false;
    
    filesToSign.forEach(file => {
        fs.writeFileSync(file, fileToContent[file]);
    });
    
    fs.writeFileSync(keyFile, keys.publicKey.toString());
    
    return success;
}
sign();