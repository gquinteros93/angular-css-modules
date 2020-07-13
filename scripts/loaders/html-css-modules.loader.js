const lodash = require('lodash');
const loaderUtils = require('loader-utils');
const commonFunctions = require('../common-functions');

module.exports = function(source) {
    var options = loaderUtils.getOptions(this); // loader options
    var newTemplate = source; // Default response current html file
    try {
        // Read the Component Json File that contains the mapped classes names with hashed names.
        var componentJson = commonFunctions.importJson(options.file.replace('.html', '.scss.json'));
        // If the template includes the lodash function getHashedClass we should change it by the non hashed class name
        if (!componentJson || !newTemplate.includes('getHashedClass')) {
            return;
        }
        var replacerResult = modifyTemplateLodash(source, options.file, componentJson);
        if (!replacerResult) {
            replacerResult = modifyTemplateManually(source, options.file, componentJson);
            if (!replacerResult) {
                replacerResult = source;
            }
        }
        newTemplate = replacerResult;
    }
    catch(error) {
        console.log(`Fail on file: ${options.file} \n Error Details: + ${error}`);
    }
    finally {
        return newTemplate;
    }
}

function modifyTemplateLodash(source, file, json) {
    let newTemplate = source;
    try {
        if (!newTemplate || !json) {
            newTemplate = null;
            return;
        }
        // Function to lookup hashed class names
        let getHashedClass = function (unhashedClass) {
            return json[unhashedClass];
        }
        // Use lodash to template it, passing the class lookup function
        let compiled = lodash.template(newTemplate);
        newTemplate = compiled({
            getHashedClass: getHashedClass
        });
    }
    catch (error) {
        console.log(`Lodash Fail on file: ${file} \n Error Details: + ${error}`);
        newTemplate = null;
    }
    finally {
        return newTemplate;
    }
}

function modifyTemplateManually(source, file, json) {
    let newTemplate = source;
    try {
        if (!newTemplate || !json) {
            newTemplate = null;
            return;
        }
        // Get all the places where use getHashedClass
        const arrayClassNames = newTemplate.match(/<%=[ ]{0,}getHashedClass.*?\(([^)]*)\)[ ]{0,}%>/gi);
        let hashedClassName;
        let className;
        if (arrayClassNames) {
            for (let classToReplace of arrayClassNames) {
                className = classToReplace.replace(/<%=[ ]{0,}getHashedClass.*?\(/gi, '').replace(/\)[ ]{0,}%>/gi, '');
                if (className) {
                    className = className.replace(/`/gi, '').replace(/'/gi, '').replace(/"/gi, '');
                    hashedClassName = json[className];
                    if (hashedClassName) {
                        newTemplate = newTemplate.replace(classToReplace, hashedClassName);
                    }
                }
            }
        }
        return newTemplate;
    } catch (error) {
        console.log(`Html Manually Fail on file: ${file} \n Error Details: + ${error}`);
        newTemplate = null;
    }
    finally {
        return newTemplate;
    }
}
