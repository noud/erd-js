const fs = require('fs');

// @todo
// convert
// erd to vuerd

const parseOject = object => {
    // console.log('<object', object);
    console.log('name', object.name);
    return object;
};

const ErdVuerd = () => {
    const source = openJson()
    // console.log('@todo', source);
    source.objects.map((object) => {parseOject(object)});
    return 'output';
};

exports.ErdVuerd = ErdVuerd;