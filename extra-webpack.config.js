const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.component\.(css|sass|scss)$/,
                exclude: [path.resolve('node_modules'), path.resolve('src/styles.scss')],
                include: [path.resolve('src/app')],
                use: [
                    'raw-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('postcss-modules')({
                                    generateScopedName: "[hash:base64:5]"
                                }),
                                require('postcss-import')
                            ]
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    }
};