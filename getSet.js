function getSet(objParent, propertyPath, setValue) {
    'use strict';
    var path;
    var matchOr = new RegExp('\\s*\\|\\|\\s*$');
    var matchOperator = new RegExp('\\s*(\\+\\+|\\-\\-)\\s*$');
    var matchFunction = new RegExp('\\s*\\(\\)\\s*$');

    function isFunction(obj) {
        var plainObj = {};
        return obj && (typeof obj === 'function' || plainObj.toString.call(obj) === '[object Function]' || (typeof obj === 'object' && (/^\s*function/i).test(obj + '')));
    }
    function isObject(obj) {
        return obj && (typeof obj === 'object' || isFunction(obj));
    }
    function typeErrMsg(loop, obj, operation) {
        return 'Cannot ' + operation + ' ' + path.slice(0, loop + 1).join('.') + ' (typeof ' + (path.slice(0, loop).join('.') || obj) + ' = \'' + typeof obj + '\')';
    }
    if (!propertyPath) {
        path = ['propertyPath'];
        throw new TypeError(typeErrMsg(1, propertyPath, 'determine'));
    }
    if (propertyPath.join) {
        propertyPath = propertyPath.join('.');
    }
    propertyPath = propertyPath + '';

    path = propertyPath.replace(/\[(?:'|")?(.+?)(?:'|")?\]/g, '.$1').replace(matchOr, '').replace(matchOperator, '').replace(matchFunction, '');
    path = path.split('.');
    var len = path.length;
    var loop;
    var parentObj = objParent;
    var property;
    var settingValue = arguments.length === 3;
    var getOrMake = matchOr.test(propertyPath);
    var operator = propertyPath.match(matchOperator);
    operator = operator && operator[1];
    var functionRequired = matchFunction.test(propertyPath);
    var retainExisting = getOrMake || operator;
    var objectIsRequired = settingValue || retainExisting;

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
                        if (operator) {
                            setValue = settingValue ? setValue : 1;
                            setValue = operator === '++' ? +setValue : -setValue;
                            if (!isObject(parentObj[property])) {
                                parentObj[property] = (+parentObj[property] || 0) + setValue;
                            } else {
                                throw new TypeError(typeErrMsg(loop + 1, parentObj[property], 'in/decrement'));
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
