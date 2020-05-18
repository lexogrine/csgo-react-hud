String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
const fs = require('fs');
const lines = fs.readdirSync('./').map(file => {
    let name = file.replace('.png','').replace("icon_", "").replace("_default", "");
    name = name.charAt(0).toUpperCase() + name.substr(1);
    name = name.replaceAll(/_([a-z])/g, function(v) { return v.toUpperCase(); }).replace("_","");
    name = name.replace("_", "").replace("_", "").replace("_", "");
    return `import ${name} from './../assets/images/${file}';`
});
lines.map(x => {console.log(x);return x;})