function getSet(objParent, propertyPath, setValue) {
    'use strict';
    var matchOr = new RegExp('\\s*\\|\\|\\s*$');
    var matchIncrement = new RegExp('\\s*\\+\\+\\s*$');
    var matchFunction = new RegExp('\\s*\\(\\)\\s*$');
    if (propertyPath.join) {
        propertyPath = propertyPath.join('.');
    }
    var path = propertyPath.replace(/\[(?:'|")?(.+?)(?:'|")?\]/g, '.$1').replace(matchOr, '').replace(matchIncrement, '').replace(matchFunction, '');
    path = path.split('.');
    var len = path.length;
    var loop;
    var parentObj = objParent;
    var property;
    var settingValue = arguments.length === 3;
    var getOrMake = matchOr.test(propertyPath);
    var incrementAppend = matchIncrement.test(propertyPath);
    var functionRequired = matchFunction.test(propertyPath);
    var retainExisting = getOrMake || incrementAppend;
    var objectIsRequired = settingValue || retainExisting;

    function isObject(obj) {
        return typeof obj === 'object';
    }
    function isFunction(obj) {
        var plainObj = {};
        return typeof obj === 'function' || (obj && plainObj.toString.call(obj) === '[object Function]') || (isObject(obj) && (/^\s*function/i).test(obj + ''));
    }
    function typeErrMsg(loop, obj, operation) {
        return 'Cannot ' + operation + ' ' + path.slice(0, loop + 1).join('.') + '. typeof ' + path.slice(0, loop).join('.') + ' = \'' + typeof obj + '\'.';
    }
    function result(obj) {
        if (functionRequired && !isFunction(obj)) {
            if (window.console) {
                window.console.log(typeErrMsg(loop + 1, obj, 'execute'));
            }
            return function () {
                return undefined;
            };
        } else {
            return obj;
        }
    }

    for (loop = 0; loop < len; loop += 1) {
        property = path[loop];
        if (parentObj || objectIsRequired) {
            if (objectIsRequired) {
                if (!parentObj.hasOwnProperty(property)) {
                    if (isObject(parentObj)) {
                        if (loop + 1 < len) {
                            parentObj[property] = {};
                        }
                    } else {
                        throw new TypeError(typeErrMsg(loop, parentObj, 'create'));
                    }
                }
                if (loop + 1 === len) {
                    if (retainExisting) {
                        if (incrementAppend) {
                            if (!isObject(parentObj[property])) {
                                parentObj[property] = (parentObj[property] || 0) + (settingValue ? setValue : 1);
                            } else {
                                throw new TypeError(typeErrMsg(loop + 1, parentObj[property], 'increment'));
                            }
                        } else {
                            parentObj[property] = parentObj[property] || setValue;
                        }
                    } else {
                        parentObj[property] = setValue;
                    }
                }
            }
            if (isObject(parentObj)) {
                parentObj = parentObj[property];
            } else {
                throw new TypeError(typeErrMsg(loop, parentObj, 'read'));
            }
        } else {
            return result(parentObj);
        }
    }
    return result(parentObj);
}
