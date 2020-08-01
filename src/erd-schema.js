const clonedeep = require('lodash.clonedeep');
const { openEr, openJson, saveJson } = require('./utils');
const { lastIndexOf } = require('lodash');

const createId = () => {
    return Math.random().toString(36).substring(7)
};

const removeQuotes = string => {
    if (-1 !== string.indexOf( " {" )) {
        string = string.substring( 0, string.indexOf( " {" ) )
    }
    return string
    .replace(/`/g,'').replace(/'/g,'').replace(/"/g,'')
};

const unrelaxJSON = string => {
    var stringJSON = string.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
    return JSON.parse(stringJSON)
};

const ErdSchema = () => {
    // erBaseName = 'nfldb'
    // erBaseName = 'simple'
    erBaseName = 'politiebureaus'
    // erBaseName = 'politiebureaus.en'
    let template = openJson('templates/template.schema')
    const lines = openEr('database/er/' + erBaseName).split('\n')

    schema = [];
    table = null;
    regExpSquareBrackets = /^\[(.*?)\]/g
    relationships = [];
    regExpRelationship = /(.+) (\?|1|\*|\+)--(\?|1|\*|\+) (.+)/
    
    schemaName = 'db'
    regExpCurlyBrackets = /\{(.*?)\}/
    if (0 === lines[0].indexOf('title')) {
        let titleAttributesString = lines[0].match(regExpCurlyBrackets)
        schemaName = unrelaxJSON(titleAttributesString[0]).label
    }

    lines.map((line) => {
        if ('[' === line.charAt(0)) {
            let result = line.match(regExpSquareBrackets).map(b=>b.replace(regExpSquareBrackets,"$1"))
            tableName = removeQuotes(result[0])

            tableBgColor = 'table-header-blue'
            if (-1 !== lines[0].indexOf(' {')) {
                let tableAttributesString = line.match(regExpCurlyBrackets)
                tableBgColorCode = unrelaxJSON(tableAttributesString[0]).bgcolor
                tableBgColor = 'table-header-'
                switch(tableBgColorCode) {
                    case '#fbfbdb':
                        tableBgColor += 'dark-blue' // yellow
                        break;
                    case '#eee0a0':
                        tableBgColor += 'purple'    // orange
                        break;
                    case '#d0e0d0':
                        tableBgColor += 'green'
                        break;
                    case '#fcecec':
                        tableBgColor += 'red'
                        break;
                    default:
                        tableBgColor += 'blue'
                }
            }

            table = {
                id: createId(),
                name: tableName,
                "color": tableBgColor,
                "softDelete": false,
                "timeStamp": true,
                attributes: []}
        } else if (line.match(regExpRelationship)) {
            let RelationshipResult = line.match(regExpRelationship)

            attributLabel = null
            if (-1 !== line.indexOf(' {')) {
                let RelationshipAttributesString = line.match(regExpCurlyBrackets)
                attributLabel = unrelaxJSON(RelationshipAttributesString[0]).label
            }

            // console.log(RelationshipResult)
            relationships.push([
                removeQuotes(RelationshipResult[1]).replace(/^\s+|\s+$/g, ''),  // leading and tailing spaces
                RelationshipResult[2],
                RelationshipResult[3],
                removeQuotes(RelationshipResult[4]).replace(/^\s+|\s+$/g, ''),
                attributLabel
            ])
        } else {
            if (null != table) {
                if (0 != line.length) {

                    nullable = true;
                    unsigned = false;

                    attributeType = 'string'
                    if (-1 !== line.indexOf(' {')) {
                        let attributeAttributesString = line.match(regExpCurlyBrackets)
                        attributLabel = unrelaxJSON(attributeAttributesString[0]).label
                        attributLabelArray = attributLabel.split(', ')
                        switch(attributLabelArray[0]) {
                            case 'text':
                                attributeType = 'text'
                                break;
                            case 'usmallint':
                                attributeType = 'integer'
                                unsigned = true
                                break;
                            case 'smallint':
                                attributeType = 'integer'
                                break;
                            case 'bigint':
                                attributeType = 'integer'
                                break;
                            case 'boolean':
                                attributeType = 'boolean'
                                break;
                            case 'utctime':
                                attributeType = 'timestamp'
                                break;
                            // nfl related
                            case 'player_pos':
                                attributeType = ''
                                break;
                            case 'player_status':
                                attributeType = ''
                                break;
                            case 'gameid':
                                attributeType = ''
                                break;
                            case 'season_phase':
                                attributeType = ''
                                break;
                            case 'field_pos':
                                attributeType = ''
                                break;
                            case 'game_time':
                                attributeType = 'timestamp'
                                break;
                            case 'pos_period':
                                attributeType = ''
                                break;
                            default:
                                attributeType = 'string'
                        }
                        // catch
                        if ('' === attributeType) {
                            attributeType = 'string'
                        }
                        
                        if ('not null' === attributLabelArray[1]) {
                            nullable = false
                        }
                    }

                    line = line.replace(/^\s+|\s+$/g, '')  // leading and tailing spaces
                    line = removeQuotes(line)
                    index = fk = false
                    if ('*' === line.charAt(0)) {
                        line = line.replace(/\*/g,'')
                        index = true
                    }
                    if ('+' === line.charAt(0)) {
                        line = line.replace(/\+/g,'')
                        fk = true
                    }

                    attribute = {
                        id: createId(),
                        name: line,
                        type: attributeType,
                        length: "",
                        defValue: "",
                        comment: "",
                        autoInc: index,
                        nullable: nullable,
                        unique: index,
                        index: false,
                        unsigned: unsigned,    // @todo must be true in target
                        // fk: fk
                        foreignKey: {
                            references: {
                                id: "",
                                name: ""
                            },
                            on: {
                                id: "",
                                name: ""
                            }
                        }
                    };
                    (table.attributes).push(attribute)
                } else {
                    schema.push(table)
                    table = null;
                }
            }
        }
    });

    // fuzzy part
    relationships.map((relationship, index) => {
        relationshipsIndex = index
        from = to = false
        schema.map((table, index) => {
            schemaIndex = index

            if (table.name === relationship[0] ) {
                relationships[relationshipsIndex][5] = table.id
                // find fk
                table.attributes.map((attribute, index) => {

                    if ('game' === relationship[0]) {
                        possibleFfNamePart = 'gsis'
                    } else {
                        possibleFfNamePart = relationship[3].toLowerCase().replace(" ", "_")
                    }
                    possibleFfNamePartId = possibleFfNamePart

                    // relation is named in label
                    if (relationship[4]) {
                        possibleFfNamePart = relationship[4]
                    }

                    if (relationship[0] + '_id' === attribute.name ||
                        possibleFfNamePart + '_id' === attribute.name ||
                        possibleFfNamePart === attribute.name
                    ) {
                        relationships[relationshipsIndex][7] = attribute.id
                        relationships[relationshipsIndex][8] = attribute.name
                        // @todo fill fks

                        // @todo done so bad
                        // find target table
                        // attributeName = attribute.name
                        // correctedSchemaIndex = correctedIndex = 0
                        // schema.map((table, index) => {
                        //     if (table.name === relationship[3] ) {
                        //         correctedSchemaIndex = index
                        //         table.attributes.map((attribute, index) => {
                        //             if (relationship[0] + '_id' === attribute.name ||
                        //                 possibleFfNamePart + '_id' === attribute.name ||
                        //                 possibleFfNamePart === attribute.name
                        //             ) {
                        //                 correctedIndex = index
                        //             }
                        //         });
                        //     }
                        // });
                        // schemaIndex = correctedSchemaIndex
                        // corrected

                        schema[schemaIndex].attributes[index].unsigned = true
                        schema[schemaIndex].attributes[index].type = 'integer'  // @todo should be dependent from fk pointed field
                        schema[schemaIndex].attributes[index].foreignKey.on.name = relationship[3]  // <<<<<
                        from = true
                        fromSchemaIndex = schemaIndex
                        fromIndex = index
                        // fromIndex = correctedIndex
                    }
                });
            }
            
            if (table.name === relationship[3]){    // @todo 3?
                to = table.id
                toRelationshipId = table.id
                relationships[relationshipsIndex][6] = table.id
                // find index
                table.attributes.map((attribute, index) => {
                    // could be multile index
                    if (attribute.autoInc) {
                        relationships[relationshipsIndex][9] = attribute.id
                        relationships[relationshipsIndex][10] = attribute.name
                        toAttributeId = attribute.id
                        toAttributeName = attribute.name
                    }
                });
            }
            if (from && to) {
                schema[fromSchemaIndex].attributes[fromIndex].foreignKey.references.id = toAttributeId
                schema[fromSchemaIndex].attributes[fromIndex].foreignKey.references.name = toAttributeName
                schema[fromSchemaIndex].attributes[fromIndex].foreignKey.on.id = to
            }
        });
    });

    // relations
    relations = []
    relationships.map((relationship, index) => {
        relations.push({
            source: {columnId: relationship[7], tableId: relationship[5]},
            target: {columnId: relationship[9], tableId: relationship[6]}
        })
    });
    template.relations = relations

    tables = clonedeep(schema)
    tables.map((table, index) => {
        delete tables[index].attributes
    });
    template.tables = tables

    positions = {}
    x = y = 0
    schema.map((table) => {
        x += 40
        positions[table.id] = {x: x, y: y}
    })
    template.ui.positions = positions

    attributes = {}
    attributesSchema = schema
    attributesSchema.map((table, index) => {
        attributes[table.id] = attributesSchema[index].attributes
    })
    template.columns = attributes

    template.database.name = schemaName
    saveJson(erBaseName, template)
};

exports.ErdSchema = ErdSchema();