const colorCodeToName = (colorCode) => {
    var colorName = '';
    switch(colorCode) {
        case '#800000':
            colorName += 'maroon'
            break;
        case '#c0392b':
            colorName += 'red'
            break;
        case '#ffa500':
            colorName += 'orange'
            break;
        case '#ffff00':
            colorName += 'yellow'
            break;
        case '#808000':
            colorName += 'olive'
            break;
        case '#16a085':
            colorName += 'green'
            break;
        case '#8e44ad':
            colorName += 'purple'
            break;
        case '#ff00ff':
            colorName += 'fuchsia'
            break;
        case '#00ff00':
            colorName += 'lime'
            break;
        case '#008080':
            colorName += 'teal'
            break;
        case '#00ffff':
            colorName += 'aqua'
            break;
        case '#2980b9':
            colorName += 'blue'
            break;
        case '#000080':
            colorName += 'navy'
            break;
        case '#000000':
            colorName += 'black'
            break;
        case '#808080':
            colorName += 'gray'
            break;
        case '#c0c0c0':
            colorName += 'silver'
            break;
        case '#ffffff':
            colorName += 'white'
            break;
        default:
            colorName += 'blue'
    }
    return colorName
};

const colorCodeToTableBgColorName = (colorCode) => {
    return 'table-header-' + colorCodeToName(colorCode);
}
exports.colorCodeToTableBgColorName = colorCodeToTableBgColorName;