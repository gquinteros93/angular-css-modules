const path = require('path');
const AngularCompilerPlugin = require('@ngtools/webpack');

module.exports = (config, options) => {

    /*  HTML EXTEND */
    config.module.rules.unshift(
        {
            test: /\.html$/,
            use:(info) => {
                return [
                    { loader: 'raw-loader' },
                    {
                        loader: path.resolve('./scripts/loaders/html-plain-class-name.loader.js'),
                        options: {
                            file: info.resource
                        }
                    }
                ]
            }
        },
    );

    const index = config.plugins.findIndex(p => p instanceof AngularCompilerPlugin.AngularCompilerPlugin);
    const oldOptions = config.plugins[index]._options;
    oldOptions.directTemplateLoading = false;
    config.plugins.splice(index);
    config.plugins.push(new AngularCompilerPlugin.AngularCompilerPlugin(oldOptions));
    return config;
};