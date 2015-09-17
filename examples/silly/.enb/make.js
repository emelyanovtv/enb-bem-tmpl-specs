var path = require('path'),
    _ = require('lodash'),
    rootPath = path.join(__dirname, '..', '..', '..'),
    engines = {
        bh: {
            tech: 'enb-bh/techs/bh-bundle',
            options: {
                sourcemap: true,
                bhOptions: {
                    jsAttrName: 'data-bem',
                    jsAttrScheme: 'json'
                }
            }
        },
        bemhtml: {
            tech: 'enb-bemxjst/techs/bemhtml'
        }
    };

module.exports = function (config) {
    config.includeConfig(rootPath);

    var module = config.module('enb-bem-tmpl-specs'),
        helper = module.createConfigurator('tmpl-specs');

    declareSpec('no lang', {
        langs: false,
        coverage: false
        // levels: ['common.blocks'] by default
    });

    declareSpec('custom deps', {
        depsTech: 'deps',
        langs: false,
        coverage: false
        // levels: ['common.blocks'] by default
    });

    declareSpec('no lang with coverage', {
        langs: false,
        coverage: true
    });

    declareSpec('langs: true', {
        langs: true,
        coverage: false,
        levels: ['mock-i18n.blocks']
    });

    declareSpec('langs: true with coverage', {
        langs: true,
        coverage: true,
        levels: ['mock-i18n.blocks']
    });

    declareSpec('many langs', {
        langs: ['ru', 'en'],
        coverage: false,
        levels: ['i18n.blocks']
    });

    declareSpec('many langs with coverage', {
        langs: ['ru', 'en'],
        coverage: true,
        levels: ['i18n.blocks']
    });

    // helper
    function declareSpec(name, opts) {
        var destPath = name.replace(/[^\w\d]+/ig, '-') + '.tmpl-specs'; // sluggified

        opts.destPath = destPath;

        helper.configure(_.assign({}, {
            engines: {
                'BH': opts.langs ? _.assign({}, engines.bh, {
                    options: { requires: { i18n: { globals: 'BEM.I18N' } } }
                }) : engines.bh,
                'BEMHTML dev': _.assign({}, engines.bemhtml, { options: { devMode: true } }),
                'BEMHTML prod': _.assign({}, engines.bemhtml, { options: { devMode: false } })
            },
            // levels for specs
            levels: [
                'common.blocks'
            ],
            // sourceLevels for block sources
            sourceLevels: [].concat([
                '../libs/bem-core/common.blocks',
                '../blocks'
            ], opts.levels || 'common.blocks')
        }, opts));
    }

};
