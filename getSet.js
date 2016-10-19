function getSet(parentObject, propertyPath, setValue) {
    'use strict';
    var argsLen = arguments.length;
    var settingValue = argsLen === 3;
    var propertyPathArray = propertyPath && propertyPath.join;
    var propertyPathStr = String(propertyPathArray ? propertyPath.join('.') : propertyPath);
    var matchOr = /\s*\|\|\s*$/;
    var matchOperator = /\s*(\+\+|--)\s*$/;
    var matchAs = /^(.*\s)?as$/;
    var getOrMake = matchOr.test(propertyPathStr);
    var operator = propertyPathStr.match(matchOperator);
    operator = operator && operator[1];
    var operatorValue;
    var typeExpected = settingValue && matchAs.test(propertyPathStr) && !propertyPathArray;
    if (typeExpected) {
        settingValue = false;
    }
    var retainExisting = getOrMake || operator;
    var pathRequired = settingValue || retainExisting;
    var path = propertyPathStr.replace(/\[(?:'|")?(.+?)(?:'|")?\]/g, '.$1').replace(matchOr, '').replace(matchOperator, '');
    if (!typeExpected) {
        path.replace(matchAs, '');
    }
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
        var typeProvided = getType(setValue);
        if (typeExpected && typeProvided !== getType(obj)) {
            if (window.console) {
                window.console.log(typeErrMsg(loop + 1, obj, 'get as \'' + typeProvided + '\':'));
            }
            obj = setValue;
        }
        return obj;
    }

    var propertyPathType = getType(propertyPath);
    if ((path === '' && !matchAs.test(propertyPathStr)) || (propertyPathType !== 'String' && propertyPathType !== 'Array')) {
        path = argsLen === 0 ? ['parentObject'] : ['propertyPath'];
        throw new TypeError(typeErrMsg(1, argsLen === 0 ? parentObject : propertyPath, 'determine argument'));
    }

    var pathToResolve = path;
    if (typeExpected) {
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
                        if (operator) {
                            operatorValue = settingValue ? setValue : 1;
                            operatorValue = operator === '++' ? +operatorValue : -operatorValue;
                            if ((parentObject[property] === undefined || isNumeric(parentObject[property])) && isNumeric(operatorValue)) {
                                parentObject[property] = (+parentObject[property] || 0) + operatorValue;
                            } else {
                                throw new TypeError(typeErrMsg(loop + 1, parentObject[property], 'in/decrement with value \'' + setValue + '\' on property'));
                            }
                        } else {
                            parentObject[property] = parentObject[property] || setValue;
                        }
                    } else {
                        parentObject[property] = setValue;
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
