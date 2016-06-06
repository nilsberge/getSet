function getSet(objParent, propertyPath, setValue) {
    'use strict';
    var matchOr = new RegExp('\\s*\\|\\|\\s*$');
    var matchIncrement = new RegExp('\\s*\\+\\+\\s*$');
    var path = propertyPath.replace(/\[(?:'|")?(.+?)(?:'|")?\]/g, '.$1').replace(matchOr, '').replace(matchIncrement, '');
    path = path.split('.');
    var len = path.length;
    var loop;
    var parentObj = objParent;
    var property;
    var settingValue = arguments.length === 3;
    var getOrMake = matchOr.test(propertyPath);
    var incrementAppend = matchIncrement.test(propertyPath);
    var retainExisting = getOrMake || incrementAppend;
    var objectIsRequired = settingValue || retainExisting;
    
    function isObjType(obj) {
        return typeof obj === 'object';
    }
    function typeErrMsg(loop, obj, operation) {
        return 'Cannot ' + operation + ' ' + path.slice(0, loop + 1).join('.') + '. typeof ' + path.slice(0, loop).join('.') + ' = \'' + typeof obj + '\'.';
    }
    
    for (loop = 0; loop < len; loop += 1) {
        property = path[loop];
        if (parentObj || objectIsRequired) {
            if (objectIsRequired) {
                if (!parentObj.hasOwnProperty(property)) {
                    if (isObjType(parentObj)) {
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
                            if (!isObjType(parentObj[property])) {
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
            if (isObjType(parentObj)) {
                parentObj = parentObj[property];
            } else {
                throw new TypeError(typeErrMsg(loop, parentObj, 'read'));
            }
        } else {
            return;
        }
    }
    return parentObj;
}
