#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yamljs = require('yamljs');
const argv = require('yargs')
    .option('path', { alias: 'p', default: process.cwd(), description: 'Root path for finding yml files to generate from.' })
    .option('delete', { alias: 'd', type: 'boolean', description: 'Delete files that were generated.' })
    .argv;

const del = argv.d;
if (del) {
    const puffin = `    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒████████░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░░░      ░░▓▓░░░░░░░░░░░░░░
    ░░░░░░░░▒▒▒▒▒▒▒▒░░░░░░            ██░░░░░░░░░░░░
    ░░░░░░▒▒▒▒▒▒▒▒░░  ░░░░            ░░▓▓░░░░░░░░░░
    ░░░░▒▒▒▒▒▒▒▒░░░░░░░░░░    ████      ████░░░░░░░░
    ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░    ████      ████░░░░░░░░
    ░░░░▒▒▒▒░░░░░░░░░░░░░░              ██████░░░░░░
    ░░░░▒▒▒▒▒▒░░░░░░░░░░░░              ██████░░░░░░
    ░░░░░░▒▒▒▒░░  ░░░░░░░░              ██████░░░░░░
    ░░░░░░░░▒▒░░░░░░░░░░                ████░░░░░░░░
    ░░░░░░░░░░▒▒▒▒░░░░                ██▓▓██░░░░░░░░
    ░░░░░░░░░░░░▒▒▒▒                ▒▒▓▓▓▓  ░░░░░░░░
    ░░░░░░░░░░░░  ▒▒              ▒▒██▒▒░░  ░░░░░░░░
    ░░░░░░░░░░░░▒▒▓▓░░▒▒        ▒▒▒▒██▓▓▒▒░░░░░░░░░░
    ░░░░░░░░░░▒▒██████▒▒░░░░░░░░▒▒▓▓▓▓▓▓▓▓▒▒░░░░░░░░
    ░░░░░░░░▒▒████▓▓██▒▒░░░░░░░░▒▒██████████▒▒░░░░░░
    ░░░░░░▒▒██▓▓██████▒▒░░░░░░░░▒▒████████████▒▒░░░░
    ░░░░▒▒▓▓██████████▒▒░░░░░░░░▒▒██▓▓████████▒▒░░░░
    ░░░░▒▒████████████▒▒░░░░░░░░▒▒████▓▓▓▓████▒▒░░░░
    ░░░░▒▒████████████▒▒░░░░░░░░▒▒▓▓██████████▒▒░░░░
    ░░░░▒▒████████████▒▒░░░░░░░░▒▒▓▓▓▓██▓▓██████▒▒░░
    ░░▒▒██████████████▒▒░░░░░░░░▒▒██▓▓██▓▓▓▓▓▓██▒▒░░
    ░░▒▒████████████▓▓▒▒░░░░░░░░▒▒██▓▓▓▓▓▓▓▓▓▓██▓▓▒▒
    ░░▒▒████████████▓▓▒▒        ▒▒▓▓▓▓████▓▓▓▓████▒▒
    ░░▒▒▓▓▓▓████████▒▒            ▒▒▓▓██▓▓▓▓▓▓████▒▒
    ░░░░▒▒▓▓██▓▓██▒▒                ▒▒████▓▓▓▓██▒▒░░
    ░░░░▒▒██████▒▒                    ▒▒██▓▓▓▓██▒▒░░
    ░░░░░░▒▒████                        ▒▒██▓▓▓▓▒▒░░
    ░░░░░░▒▒██▒▒                          ▒▒██▒▒░░░░
    ░░░░░░░░▒▒                              ▒▒░░░░░░
    ░░░░░░░░░░▒▒                          ▒▒░░░░░░░░
    ░░░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▒▒░░░░░░░░░░
    ░░░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░
    ░░░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░
    ░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░
    ░░░░░░░░░░░░  ▓▓▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░`
    console.log(puffin);
    console.log('deleting generated files...');
}
else {
    const jelly = `
                                    ▒▒▒▒▒▒▒▒▒▒                                      
                                  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                    
                                ▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒                                  
                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                  
                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                  
                                  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                    
                                  ▒▒  ▒▒  ▒▒  ▒▒                                    
                                ▒▒▒▒  ▒▒  ▒▒  ▒▒                                    
                                ▒▒  ▒▒  ▒▒  ▒▒  ▒▒                                  
                                ▒▒  ▒▒  ▒▒  ▒▒  ▒▒                                  
                                  ▒▒  ▒▒▒▒▒▒  ▒▒                                    
                                  ▒▒  ▒▒  ▒▒  ▒▒`
    console.log(jelly);
    console.log('generating files...');
}

const rootDir = argv.p;
const template = {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {}
};

glob(rootDir + '/**/*.yml', {}, (err, files) => {
    let count = 0;
    for (var i = 0; i < files.length; i++) {
        const yml = files[i];
        if (!yml.includes('node_modules') && !yml.includes('azure-pipelines')) {

            const dir = path.dirname(yml);
            const d = yamljs.load(yml);

            let name = path.parse(yml).name;
            console.log('processing', name);
            puff(del, template, dir, name, d);

            count++;
        }
    }

    console.log('processed:', count);
});

async function puff(del, template, dir, n, data) {
    let name = data.name || n;
    const baseLayer = layer(data.default || data);

    Service(del, template, dir, name, baseLayer, data.environments, data.services);
}

async function Service(del, template, dir, name, baseLayer, environments, services) {

    let serviceLayer;
    if (undefined !== services) {
        name = services.puffprefix || name;
        console.log("prefix: ", name);
        Object.keys(services).forEach(service => {
            console.log(service);
        });
    }

    Env(del, template, dir, name, baseLayer, serviceLayer, environments)
}

async function Env(del, template, dir, name, baseLayer, serviceLayer, environments) {
    Object.keys(environments).forEach(env => {
        const envLayer = merge(baseLayer, layer(environments[env]));

        if (null != environments[env].region) {
            const region = environments[env].region;
            const finalLayer = envLayer;
            finalLayer.set('region', { value: region });

            const filename = path.join(dir, name + '.' + env + '.' + region + '.json');
            Io(filename, template, finalLayer, filename);
        }
        else if (null != environments[env].regions && 0 < environments[env].regions.length) {
            environments[env].regions.forEach(r => {
                const region = Object.keys(r)[0];
                const finalLayer = merge(envLayer, layer(r[region]));
                finalLayer.set('region', { value: region });

                const filename = path.join(dir, name + '.' + env + '.' + region + '.json');
                Io(filename, template, finalLayer, filename);
            });
        }
        else if (envLayer.has('region')) {
            const region = envLayer.get('region').value;
            const filename = path.join(dir, name + '.' + env + '.' + region + '.json');
            Io(filename, template, envLayer, filename);
        }
        else {
            const filename = path.join(dir, name + '.' + env + '.json');
            Io(filename, template, envLayer, filename);
        }
    });
}


async function Io(filename, template, layer, filename) {
    if (del) Delete(filename)
    else Write(template, layer, filename);
}

async function Delete(filename) {
    fs.unlink(filename, function (err) {
        if (err) {
            if (err.code != 'ENOENT') return console.log(err);
        } else {
            console.log('-', path.basename(filename));
        }
    });
}

async function Write(template, final, filename) {
    const contents = template;
    contents.parameters = MapToObject(final);

    fs.writeFile(filename
        , JSON.stringify(contents, null, 1)
        , {
            flag: 'w+',
            encoding: "utf8"
        }
        , function (err, data) {
            if (err) console.log(err);
            else {
                console.log('+', path.basename(filename));
            }
        }
    );
}

function MapToObject(m) {
    function selfIterator(map) {
        return Array.from(map).reduce((acc, [key, value]) => {
            if (value instanceof Map) {
                acc[key] = selfIterator(value);
            } else {
                acc[key] = value;
            }

            return acc;
        }, {})
    }

    return selfIterator(m);
}

function layer(data) {
    const map = new Map();

    if (null != data) {
        const keys = Object.keys(data);
        if (0 < keys.length) {
            keys.forEach(element => {
                if ('regions' !== element
                    && 'environments' !== element
                    && 'services' !== element
                    && 'puffprefix' !== element) {
                    const val = (data[element].reference) ? data[element] : { value: data[element] };

                    map.set(element, val);
                }
            });
        }
    }

    return map;
}

function merge(a, b) {
    return new Map(function* () { yield* a; yield* b; }());
}