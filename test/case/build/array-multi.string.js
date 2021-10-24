const { build, loadAssets } = require('./utils');
const should = require('chai').should();
const config = require('../configs/array-multi.string');

function test (version) {
    describe('webpack ' + version, () => {
        let res = null;
        let assets = null;
        before(done => {
            build(
                version,
                config,
                (err, stats) => {
                    res = {err, stats};
                    assets = loadAssets(stats, 25);
                    done();
                }
            );
        });
        // it('no errors',  done => {
        //     const {err, stats} = res;
        //     should.not.exist(err);
        //     should.equal(stats.hasErrors(), false);
        //     assets.should.be.an('array');
        //     done();
        // });
        // it('shebang in place',  done => {
        //     for (const result of assets) {
        //         should.equal(/^#!\/usr\/bin\/env node\s+/.test(result.content), true);
        //     }
        //     done();
        // });
        it('chmod ok',  done => {
            for (const result of assets) {
                should.equal(result.mode, '755');
            }
            done();
        });
    });
}

module.exports = () => {
    describe('entry JS has shebang', () => {
        describe('entry JS has no imports', () => {
            describe('config.entries is string', () => {
                test('v4');
                test('v5');
            });
        });
    });
};