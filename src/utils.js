const fs = require('fs');

const openEr = (basename) => {
    try {  
        var data = fs.readFileSync('/home/noud/workspace/erd-transform/' + basename + '.er', 'utf8');
        return data.toString();    
    } catch(e) {
        console.log('Error:', e.stack);
    }
};
exports.openEr = openEr;

const openJson = (basename) => {
    return JSON.parse(fs.readFileSync('/home/noud/workspace/erd-transform/' + basename + '.json', 'utf8'));
};
exports.openJson = openJson;

const saveJson = (basename, jsonContent) => {
    fs.writeFile('/home/noud/workspace/erd-transform/' + basename + '.json', JSON.stringify(jsonContent), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}
exports.saveJson = saveJson;
