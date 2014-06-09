var path = require('path'),

    vow = require('vow'),
    vowFs = require('vow-fs');

    //config = require('./config'),
    //constants = require('./constants'),
    //providers = require('./providers');

modules.define('util', function(provide) {

    provide({

        isDev: function() {
            return 'development' === config.get('NODE_ENV');
        },

        clearCache: function() {
            return providers.getFileProvider().removeDir({ path: constants.DIRS.CACHE }).then(this.makeCache);
        },

        makeCache: function() {
            return vow.all([
                vowFs.makeDir(path.join(constants.DIRS.CACHE, constants.DIRS.BRANCH)),
                vowFs.makeDir(path.join(constants.DIRS.CACHE, constants.DIRS.TAG))
            ]);
        },

        loadSitemapXml: function() {
            var provider = util.isDev() ? providers.getFileProvider() : providers.getYaDiskProvider(),
                opts = { path: path.join(config.get('common:model:dir'),
                    util.isDev() ? '' : config.get('NODE_ENV'), constants.SITEMAP) };


            return provider.load(opts).then(function(content) {
                return provider.save({
                    data: content,
                    path: path.join(process.cwd(), constants.SITEMAP)
                });
            });
        }
    });
});
