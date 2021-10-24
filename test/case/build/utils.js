const webpacks = {
    v4: require('webpack-4'),
    v5: require('webpack-5')
};
const path = require('path');
const fs = require('fs');

module.exports.build = (version, config, cb) => {
    webpacks[version](
        config(version),
        cb
    );
};

module.exports.loadAssets = (_stats, length = 30) => {
    const stats = _stats.toJson({
        assets: true,
        chunks: true
    });
    const results = [];
    let buff = Buffer.alloc(length);
    for (const asset of stats.assets) {
        for (const chid of asset.chunks) {
            const chunk = stats.chunks.find(chunk => chunk.id === chid);
            if (chunk) {
                chunk.files.map(name => {
                    const file = path.resolve(stats.outputPath, name);
                    const fd = fs.openSync(file);
                    fs.readSync(fd, buff, 0, length, 0);
                    const mode = (fs.fstatSync(fd).mode & 0777).toString(8);
                    fs.closeSync(fd);
                    results.push({name, mode, content: buff.toString()});
                });
            }
        }
    }
    buff = null;
    return results;
};
