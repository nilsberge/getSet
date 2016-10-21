function getSet(parentObject, propertyPath, setValueOrOption, optionValue) {
    'use strict';
    var argsLen = arguments.length;
    var settingValue = argsLen === 3;
    var usingOption = argsLen === 4;
    var propertyPathStr = String((propertyPath && propertyPath.join) ? propertyPath.join('.') : propertyPath);
    var optionOr = setValueOrOption === 'or' && usingOption;
    var optionAs = setValueOrOption === 'as' && usingOption;
    var optionIncrement = setValueOrOption === '++' && usingOption;
    var optionDecrement = setValueOrOption === '--' && usingOption;
    var operatorValue;
    var retainExisting = optionOr || optionIncrement || optionDecrement;
    var pathRequired = settingValue || retainExisting;
    var path = propertyPathStr.replace(/\[(?:'|")?(.+?)(?:'|")?\]/g, '.$1');
    var loop = 0;

    function getType(obj) {
        var type = Object.prototype.toString.call(obj).slice(8, -1);
        if (type === 'Number') {
            if (!isFinite(obj)) {
                type = 'Infinity';
                if (isNaN(obj)) {
                    type = 'NaN';
                }
            }
        }
        return type;
    }
    function isNumeric(obj) {
        return (getType(obj) === 'Number' || getType(obj) === 'String') && !isNaN(parseFloat(obj)) && isFinite(obj.toString().replace(/^-/, ''));
    }
    function isFunction(obj) {
        var type = typeof obj;
        return obj && (type === 'function' || (type === 'object' && (/^\s*function/i).test(obj + '')));
    }
    function isObject(obj) {
        return obj && (typeof obj === 'object' || isFunction(obj));
    }
    function typeErrMsg(cycle, obj, operation) {
        return 'getSet: Could not ' + operation + ' \'' + path.slice(0, cycle + 1).join('.') + '\'. \'' + (path.slice(0, cycle).join('.') || obj) + '\' is of type \'' + getType(obj) + '\'.';
    }
    function result(obj) {
        var typeProvided = getType(optionValue);
        if (optionAs && typeProvided !== getType(obj)) {
            if (window.console) {
                window.console.log(typeErrMsg(loop + 1, obj, 'get as \'' + typeProvided + '\':'));
            }
            obj = optionValue;
        }
        return obj;
    }

    var propertyPathType = getType(propertyPath);
    if ((path === '' && !optionAs) || (propertyPathType !== 'String' && propertyPathType !== 'Array')) {
        path = argsLen === 0 ? ['parentObject'] : ['propertyPath'];
        throw new TypeError(typeErrMsg(1, argsLen === 0 ? parentObject : propertyPath, 'determine argument'));
    }

    var pathToResolve = path;
    if (optionAs) {
        if (pathToResolve) {
            if (!isObject(parentObject)) {
                path = ['parentObject', pathToResolve];
                return result(parentObject);
            }
        } else {
            path = ['parentObject'];
            return result(parentObject);
        }
    } else {
        if (!isObject(parentObject)) {
            if (pathToResolve) {
                path = ['parentObject', pathToResolve];
                throw new TypeError(typeErrMsg(1, parentObject, 'read'));
            }
        }
    }

    path = (path && path.split) ? path.split('.') : [];
    var len = path.length;
    var property;

    for (loop = 0; loop < len; loop += 1) {
        property = path[loop];
        if (parentObject || pathRequired) {
            if (pathRequired) {
                if (!parentObject.hasOwnProperty(property)) {
                    if (isObject(parentObject)) {
                        if (loop + 1 < len) {
                            parentObject[property] = {};
                        }
                    } else {
                        throw new TypeError(typeErrMsg(loop, parentObject, 'create'));
                    }
                }
                if (loop + 1 === len) {
                    if (retainExisting) {
                        if (optionIncrement || optionDecrement) {
                            operatorValue = usingOption ? optionValue : 1;
                            operatorValue = optionIncrement ? +operatorValue : -operatorValue;
                            if ((parentObject[property] === undefined || isNumeric(parentObject[property])) && isNumeric(operatorValue)) {
                                parentObject[property] = (+parentObject[property] || 0) + operatorValue;
                            } else {
                                throw new TypeError(typeErrMsg(loop + 1, parentObject[property], 'in/decrement with value \'' + optionValue + '\' on property'));
                            }
                        } else {
                            parentObject[property] = parentObject[property] || optionValue;
                        }
                    } else {
                        parentObject[property] = setValueOrOption;
                    }
                }
            }
            if (isObject(parentObject)) {
                parentObject = parentObject[property];
            } else {
                throw new TypeError(typeErrMsg(loop, parentObject, 'read'));
            }
        } else {
            return result(parentObject);
        }
    }
    return result(parentObject);
}
