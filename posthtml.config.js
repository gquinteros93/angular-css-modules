module.exports = ({ file, options, env }) => {
    return ({
        plugins: [
            require('posthtml-css-modules')(file.dirname.concat('/').concat(file.basename.replace('.html', '.scss.json')))
        ]
    })
};
