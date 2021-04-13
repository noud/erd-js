const colorCodeToName = (colorCode) => {
    var colorName = '';
    switch(colorCode) {
        case '#800000':
            colorName += 'maroon'
            break;
        case '#c0392b':
        case '#fcecec':
            colorName += 'red'
            break;
        case '#ffa500':
            colorName += 'orange'
            break;
        case '#ffff00':
        case '#eee0a0':
            colorName += 'yellow'
            break;
        case '#808000':
            colorName += 'olive'
            break;
        case '#16a085':
        case '#d0e0d0':
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
        case '#ececfc':
            colorName += 'silver'
            break;
        case '#ffffff':
            colorName += 'white'
            break;
        // others
        // case '#fcecec':
        //     colorName += 'linen'
        //     break;
        // case '#eee0a0':
        //     colorName += 'primrose'
        //     break;
        // case '#d0e0d0':
        //     colorName += 'tasman'
        //     break;
        // case '#ececfc':
        //     colorName += 'selago'
        //     break;
        default:
            colorName += 'white'
    }
    return colorName
};

const colorCodeToTableBgColorName = (colorCode) => {
    return 'table-header-' + colorCodeToName(colorCode);
}
exports.colorCodeToTableBgColorName = colorCodeToTableBgColorName;