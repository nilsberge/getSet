function getSet(parentObject, propertyPath, setValueOrOption, optionValue) {
    'use strict';
    var argsLen = arguments.length;
    var usingOption = argsLen === 4;
    var optionOr = setValueOrOption === 'or' && usingOption;
    var optionAs = setValueOrOption === 'as' && usingOption;
    var optionAddition = setValueOrOption === '+=' && usingOption;
    var optionSubtraction = setValueOrOption === '-=' && usingOption;
    //var operatorValue;
    var optionSpecified = optionOr || optionAs || optionAddition || optionSubtraction;
    var pathRequired = argsLen === 3 || optionOr || optionAddition || optionSubtraction;
    var path = String((propertyPath && propertyPath.join) ? propertyPath.join('.') : propertyPath).replace(/\[(?:'|")?(.+?)(?:'|")?\]/g, '.$1');
    var loop = 0;
    var winConsole = window.console;

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
    //function isNumeric(obj) {
    //    return (getType(obj) === 'Number' || getType(obj) === 'String') && !isNaN(parseFloat(obj)) && isFinite(obj.toString().replace(/^-/, ''));
    //}
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
    function consoleMsg(msg) {
        if (winConsole) {
            winConsole.log(msg);
        }
    }
    function result(obj) {
        var typeProvided = getType(optionValue);
        if (optionAs && typeProvided !== getType(obj)) {
            if (!path.length) {
                path = ['parentObject'];
                loop = 1;
            }
            consoleMsg(typeErrMsg(loop, obj, 'get as \'' + typeProvided + '\';'));
            obj = optionValue;
        }
        return obj;
    }

    if ((path === '' && !optionSpecified) || !(/String|Array/).test(getType(propertyPath))) {
        path = argsLen === 0 ? ['parentObject'] : ['propertyPath'];
        throw new TypeError(typeErrMsg(1, argsLen === 0 ? parentObject : propertyPath, 'determine argument'));
    }
    if (usingOption && !optionSpecified) {
        var pathOrig = path;
        path = ['setValueOrOption'];
        consoleMsg(typeErrMsg(1, setValueOrOption, 'determine argument \'' + setValueOrOption + '\' in'));
        path = pathOrig;
    }

    path = (path && path.split) ? path.split('.') : [];
    var len = path.length;
    var property;

    for (loop = 0; loop < len; loop += 1) {
        property = path[loop];
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
                if (optionSpecified) {
                    if (optionAddition || optionSubtraction) {
                        //operatorValue = usingOption ? optionValue : 1;
                        //operatorValue = optionAddition ? +operatorValue : -operatorValue;
                        //if ((parentObject[property] === undefined || isNumeric(parentObject[property])) && isNumeric(operatorValue)) {
                        if (parentObject[property] === undefined) {
                            parentObject[property] = getType(optionValue) === 'Number' ? 0 : '';
                        }
                        if (optionAddition) {
                            parentObject[property] += optionValue;
                        } else {
                            parentObject[property] -= optionValue;
                        }
                    } else {
                        if (optionOr) {
                            parentObject[property] = parentObject[property] || optionValue;
                        }
                    }
                } else {
                    parentObject[property] = setValueOrOption;
                }
            }
        }
        if (isObject(parentObject)) {
            if (!(optionAs && loop + 1 < len && !isObject(parentObject[property]))) {
                if (loop + 1 < len) {
                    if (parentObject[property]) {
                        parentObject = parentObject[property];
                    }
                } else {
                    parentObject = parentObject[property];
                }
            }
        } else {
            if (!optionAs) {
                throw new TypeError(typeErrMsg(loop, parentObject, 'read'));
            }
        }
    }
    return result(parentObject);
}
