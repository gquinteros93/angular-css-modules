var lodash = require('lodash');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
    var options = loaderUtils.getOptions(this);
    var newTemplate = removeCssModulesAttribute(source, options.file);; // Default response current html file without css-module
    try {
      if (newTemplate.includes('getHashedClass')) {
        var replacerResult = modifyTemplateLodash(newTemplate, options.file);
        if (!replacerResult) {
            replacerResult = modifyTemplateManually(newTemplate, options.file);
            if (!replacerResult) {
                replacerResult = source;
            }
        }
        newTemplate = replacerResult;
      }
    }
    catch(error) {
        console.log(`Fail on file: ${options.file} \n Error Details: + ${error}`);
    }
    finally {
        return newTemplate;
    }
}

function removeCssModulesAttribute(template, file) {
    try {
        if (!template) {
            return template;
        }
        return template.replace(/css-module/gi, "class");
    }
    catch (error) {
        console.log(`Fail on file: ${file} \n Error Details: + ${error}`);
        return template;
    }
}

function modifyTemplateLodash(source, file) {
    let newTemplate = source;
    try {
        if (!newTemplate) {
            newTemplate = null;
            return;
        }
        var getHashedClass = function (unhashedClass) {
            return unhashedClass;
        }
        var compiled = lodash.template(newTemplate);
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

function modifyTemplateManually(source, file) {
    let newTemplate = source;
    try {
        if (!newTemplate) {
            newTemplate = null;
            return;
        }
        const arrayClassNames = newTemplate.match(/<%=[ ]{0,}getHashedClass.*?\(([^)]*)\)[ ]{0,}%>/gi);
        let className;
        if (arrayClassNames) {
            for (let classToReplace of arrayClassNames) {
                className = classToReplace.replace(/<%=[ ]{0,}getHashedClass.*?\(/gi, '').replace(/\)[ ]{0,}%>/gi, '');
                if (className) {
                    className = className.replace(/`/gi, '').replace(/'/gi, '').replace(/"/gi, '');
                    newTemplate = newTemplate.replace(classToReplace, className);
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
