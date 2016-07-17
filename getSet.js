function getSet(parentObject, propertyPath, setValue) {
    'use strict';
    var path;
    var matchOr = /\s*\|\|\s*$/;
    var matchOperator = /\s*(\+\+|--)\s*$/;
    var matchFunction = /\s*\(\)\s*$/;

    function isFunction(obj) {
        var type = typeof obj;
        return obj && (type === 'function' || (type === 'object' && (/^\s*function/i).test(obj + '')));
    }
    function isObject(obj) {
        return obj && (typeof obj === 'object' || isFunction(obj));
    }
    function typeErrMsg(loop, obj, operation) {
        return 'getSet: Cannot ' + operation + ' \'' + path.slice(0, loop + 1).join('.') + '\'. \'' + (path.slice(0, loop).join('.') || obj) + '\' is of type \'' + Object.prototype.toString.call(obj).slice(8, -1) + '\'.';
    }

    var parentIsObject = isObject(parentObject);
    if (!parentIsObject || !propertyPath || !propertyPath.length) {
        path = [parentIsObject ? 'propertyPath' : 'parentObject'];
        throw new TypeError(typeErrMsg(1, parentIsObject ? propertyPath : parentObject, 'determine argument'));
    }
    if (propertyPath.join) {
        propertyPath = propertyPath.join('.');
    }
    propertyPath += '';

    path = propertyPath.replace(/\[(?:'|")?(.+?)(?:'|")?\]/g, '.$1').replace(matchOr, '').replace(matchOperator, '').replace(matchFunction, '');
    path = path.split('.');
    var len = path.length;
    var loop;
    var objParent = parentObject;
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
                return;
            };
        }
        return obj;
    }

    for (loop = 0; loop < len; loop += 1) {
        property = path[loop];
        if (objParent || objectIsRequired) {
            if (objectIsRequired) {
                if (!objParent.hasOwnProperty(property)) {
                    if (isObject(objParent)) {
                        if (loop + 1 < len) {
                            objParent[property] = {};
                        }
                    } else {
                        throw new TypeError(typeErrMsg(loop, objParent, 'create'));
                    }
                }
                if (loop + 1 === len) {
                    if (retainExisting) {
                        if (operator) {
                            setValue = settingValue ? setValue : 1;
                            setValue = operator === '++' ? +setValue : -setValue;
                            if (!isObject(objParent[property])) {
                                objParent[property] = (+objParent[property] || 0) + setValue;
                            } else {
                                throw new TypeError(typeErrMsg(loop + 1, objParent[property], 'in/decrement'));
                            }
                        } else {
                            objParent[property] = objParent[property] || setValue;
                        }
                    } else {
                        objParent[property] = setValue;
                    }
                }
            }
            if (isObject(objParent)) {
                objParent = objParent[property];
            } else {
                throw new TypeError(typeErrMsg(loop, objParent, 'read'));
            }
        } else {
            return result(objParent);
        }
    }
    return result(objParent);
}
