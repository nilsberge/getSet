describe("getSet function", function () {
    // vars for all tests
    var stubParentObject;

    // setup and teardown
    beforeAll(function () {});

    beforeEach(function () {
        stubParentObject = {};
    });

    afterEach(function () {});

    // specs
    describe("called without arguments", function () {
        it("should throw a TypeError for parentObject", function () {
            expect(function () {
                getSet();
            }).toThrowError(TypeError, "getSet: Could not determine argument 'parentObject'. 'parentObject' is of type 'Undefined'.");
        });
    });

    describe("called without a propertyPath", function () {
        it("should throw a TypeError for propertyPath", function () {
            expect(function () {
                getSet(stubParentObject);
            }).toThrowError(TypeError, "getSet: Could not determine argument 'propertyPath'. 'propertyPath' is of type 'Undefined'.");
        });
    });

    describe("getting a deep undefined property", function () {
        it("should just return undefined", function () {
            expect(getSet(stubParentObject, 'foo.bar')).toBeUndefined();
        });
        it("should not create any path to the deep property that didn't already exist", function () {
            expect(stubParentObject.foo).toBeUndefined();
        });
    });

    describe("setting a value on a deep property path", function () {
        var testSetValue;
        beforeEach(function () {
            testSetValue = 123
        });
        it("should create the path to the property, set the value and return it", function () {
            expect(getSet(stubParentObject, 'foo.bar', testSetValue)).toBe(testSetValue);
        });
        it("should set the value at the full path supplied", function () {
            getSet(stubParentObject, 'foo.bar', testSetValue);
            expect(stubParentObject.foo.bar).toBe(testSetValue);
        });
    });

    describe("setting a value as a property of a string object", function () {
        beforeEach(function () {
            stubParentObject.foo = 'some string value';
        });
        it("should throw a TypeError for that property", function () {
            expect(function () {
                getSet(stubParentObject, 'foo.bar', 123);
            }).toThrowError(TypeError, "getSet: Could not create 'foo.bar'. 'foo' is of type 'String'.");
        });
        it("should not create the property", function () {
            expect(function () {
                getSet(stubParentObject, 'foo.bar', 123);
            }).toThrowError(TypeError, "getSet: Could not create 'foo.bar'. 'foo' is of type 'String'.");
            expect(stubParentObject.foo.bar).toBeUndefined();
        });
    });

    describe("setting a value as a property of a number object", function () {
        beforeEach(function () {
            stubParentObject.foo = 123;
        });
        it("should throw a TypeError for that property", function () {
            expect(function () {
                getSet(stubParentObject, 'foo.bar', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not create 'foo.bar'. 'foo' is of type 'Number'.");
        });
        it("should not create the property", function () {
            expect(function () {
                getSet(stubParentObject, 'foo.bar', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not create 'foo.bar'. 'foo' is of type 'Number'.");
            expect(stubParentObject.foo.bar).toBeUndefined();
        });
    });

    describe("called with 'or' option in setValueOrOption, and an optionValue defined", function () {
        it("should get the value if the property already existed", function () {
            stubParentObject.foo = 123;
            expect(getSet(stubParentObject, 'foo', 'or', 456)).toBe(123);
        });
        it("should set the property if it didn't exist", function () {
            getSet(stubParentObject, 'bar', 'or', 789);
            expect(stubParentObject.bar).toBe(789);
        });
        it("should return the passed value if the property didn't exist", function () {
            expect(getSet(stubParentObject, 'bar', 'or', 789)).toBe(789);
        });
    });

    describe("called with '++' operator in setValueOrOption (without optionValue)", function () {
        it("should increment the value of an undefined path to 1 and return the value", function () {
            expect(getSet(stubParentObject, 'foo', '++')).toBe('++');
        });
    });

    describe("called with '--' operator in setValueOrOption (without optionValue)", function () {
        it("should decrement the value of an undefined path to -1 and return the value", function () {
            expect(getSet(stubParentObject, 'foo', '--')).toBe('--');
        });
    });

    describe("called with '++' operator in setValueOrOption (with numeric optionValue)", function () {
        it("should set the value of an undefined path and return the value (Number)", function () {
            expect(getSet(stubParentObject, 'foo', '++', 3)).toBe(3);
        });
        it("should increment the value of a defined path and return the value (Number)", function () {
            getSet(stubParentObject, 'foo', 3);
            expect(getSet(stubParentObject, 'foo', '++', 3)).toBe(6);
        });
        it("should set the value of an undefined path and return the value (String)", function () {
            expect(getSet(stubParentObject, 'foo', '++', '3')).toBe(3);
        });
        it("should increment the value of a defined path and return the value (String)", function () {
            getSet(stubParentObject, 'foo', '3');
            expect(getSet(stubParentObject, 'foo', '++', '3')).toBe(6);
        });
    });

    describe("called with '--' operator in setValueOrOption (with numeric optionValue)", function () {
        it("should set the value of an undefined path and return the value (Number)", function () {
            expect(getSet(stubParentObject, 'foo', '--', 3)).toBe(-3);
        });
        it("should decrement the value of a defined path and return the value (Number)", function () {
            getSet(stubParentObject, 'foo', -3);
            expect(getSet(stubParentObject, 'foo', '--', 3)).toBe(-6);
        });
        it("should set the value of an undefined path and return the value (String)", function () {
            expect(getSet(stubParentObject, 'foo', '--', '3')).toBe(-3);
        });
        it("should decrement the value of a defined path and return the value (String)", function () {
            getSet(stubParentObject, 'foo', '-3');
            expect(getSet(stubParentObject, 'foo', '--', '3')).toBe(-6);
        });
    });

    describe("called with '++' operator in setValueOrOption (with a non-numeric optionValue)", function () {
        it("should throw a TypeError for setting that value on an undefined property", function () {
            expect(function () {
                getSet(stubParentObject, 'foo', '++', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not in/decrement with value 'some string value' on property 'foo'. 'foo' is of type 'Undefined'.");
            expect(stubParentObject.foo).toBeUndefined();
        });
        it("should throw a TypeError for setting that value on an existing String property", function () {
            getSet(stubParentObject, 'foo', 'some string value');
            expect(function () {
                getSet(stubParentObject, 'foo', '++', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not in/decrement with value 'some string value' on property 'foo'. 'foo' is of type 'String'.");
            expect(stubParentObject.foo).toBe('some string value');
        });
        it("should throw a TypeError for setting that value on an existing Number property", function () {
            getSet(stubParentObject, 'foo', 123);
            expect(function () {
                getSet(stubParentObject, 'foo', '++', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not in/decrement with value 'some string value' on property 'foo'. 'foo' is of type 'Number'.");
            expect(stubParentObject.foo).toBe(123);
        });
    });

    describe("called with '--' operator in setValueOrOption (with a non-numeric optionValue)", function () {
        it("should throw a TypeError for setting that value on an undefined property", function () {
            expect(function () {
                getSet(stubParentObject, 'foo', '--', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not in/decrement with value 'some string value' on property 'foo'. 'foo' is of type 'Undefined'.");
            expect(stubParentObject.foo).toBeUndefined();
        });
        it("should throw a TypeError for setting that value on an existing String property", function () {
            getSet(stubParentObject, 'foo', 'some string value');
            expect(function () {
                getSet(stubParentObject, 'foo', '--', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not in/decrement with value 'some string value' on property 'foo'. 'foo' is of type 'String'.");
            expect(stubParentObject.foo).toBe('some string value');
        });
        it("should throw a TypeError for setting that value on an existing Number property", function () {
            getSet(stubParentObject, 'foo', 123);
            expect(function () {
                getSet(stubParentObject, 'foo', '--', 'some string value');
            }).toThrowError(TypeError, "getSet: Could not in/decrement with value 'some string value' on property 'foo'. 'foo' is of type 'Number'.");
            expect(stubParentObject.foo).toBe(123);
        });
    });
});
