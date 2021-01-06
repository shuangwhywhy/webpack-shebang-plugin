const fs = require('fs');
const path = require('path');
const { ReplaceSource } = require('webpack-sources');

module.exports = class ShebangPlugin {

    constructor(opts = {}) {
        this.entries = {};
        this.options = {
            shebangRegExp: /[\s\n\r]*(#!.*)[\s\n\r]*/gm,
            chmod: 0o755,
            ...(opts || {})
        };
        if (!this.options.shebangRegExp) {
            this.options.shebangRegExp = /[\s\n\r]*(#!.*)[\s\n\r]*/gm;
        }
        if (!this.options.chmod && this.options.chmod !== 0) {
            this.options.chmod = 0o755;
        }
    }

    apply(compiler) {
        compiler.hooks.entryOption.tap('ShebangPlugin', (context, entries) => {
            this.entries = {};
            for (const name in entries) {
                const entry = entries[name];
                const first = entry.import[0];
                const file = path.resolve(context, first);
                if (fs.existsSync(file)) {
                    const content = fs.readFileSync(file).toString();
                    const matches = new RegExp(this.options.shebangRegExp).exec(content);
                    if (matches && matches[1]) {
                        this.entries[name] = { shebang: matches[1] };
                    }
                }
            }
        });
        compiler.hooks.thisCompilation.tap('ShebangPlugin', compilation => {
            compilation.hooks.chunkAsset.tap('ShebangPlugin', (mod, filename) => {
                const name = mod.name;
                if (name in this.entries) {
                    this.entries[filename] = this.entries[name];
                }
            });
            compilation.hooks.buildModule.tap('ShebangPlugin', mod => {
                if (mod.loaders instanceof Array) {
                    mod.loaders.push({
                        loader: path.resolve(__dirname, 'loader.js'),
                        options: this.options || {}
                    });
                }
            });
        });
        compiler.hooks.make.tap('ShebangPlugin', compilation => {
            compilation.hooks.afterProcessAssets.tap('ShebangPlugin', assets => {
                for (const name in assets) {
                    const source = assets[name];
                    if (name in this.entries) {
                        const { shebang } = this.entries[name];
                        const rep = new ReplaceSource(source, 'shebang');
                        rep.insert(0, shebang + '\n\n', 'shebang');
                        compilation.updateAsset(name, rep);
                    }
                }
            });
        });
        compiler.hooks.assetEmitted.tap('ShebangPlugin', (file, { targetPath }) => {
            if (this.options.chmod !== 0) {
                fs.chmodSync(targetPath, this.options.chmod);
            }
        });
    }
}