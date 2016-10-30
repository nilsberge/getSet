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

    describe("called with '+=' operator in setValueOrOption (without optionValue)", function () {
        it("should set the value of an undefined path to '+=' and return the value", function () {
            expect(getSet(stubParentObject, 'foo', '+=')).toBe('+=');
        });
    });

    describe("called with '-=' operator in setValueOrOption (without optionValue)", function () {
        it("should set the value of an undefined path to '-=' and return the value", function () {
            expect(getSet(stubParentObject, 'foo', '-=')).toBe('-=');
        });
    });

    describe("called with '+=' operator in setValueOrOption (with numeric optionValue)", function () {
        it("should set the value of an undefined path as if it were zero and return the value (Number)", function () {
            expect(getSet(stubParentObject, 'foo', '+=', 3)).toBe(3);
        });
        it("should add the value of optionValue to a defined path and return the value (Number)", function () {
            getSet(stubParentObject, 'foo', 3);
            expect(getSet(stubParentObject, 'foo', '+=', 3)).toBe(6);
        });
        it("should set the value of an undefined path and return the value (String)", function () {
            expect(getSet(stubParentObject, 'foo', '+=', '3')).toBe('3');
        });
        it("should concatenate the value of a defined path and return the value (String)", function () {
            getSet(stubParentObject, 'foo', '3');
            expect(getSet(stubParentObject, 'foo', '+=', '3')).toBe('33');
        });
    });

    describe("called with '-=' operator in setValueOrOption (with numeric optionValue)", function () {
        it("should set the value of an undefined path as if it were zero and return the value (Number)", function () {
            expect(getSet(stubParentObject, 'foo', '-=', 3)).toBe(-3);
        });
        it("should subtract the value of optionValue from a defined path and return the value (Number)", function () {
            getSet(stubParentObject, 'foo', -3);
            expect(getSet(stubParentObject, 'foo', '-=', 3)).toBe(-6);
        });
        it("should set the value of an undefined path and return the value (String)", function () {
            expect(getSet(stubParentObject, 'foo', '-=', '3')).toBe(-3);
        });
        it("should subtract the value of a defined path and return the value (String)", function () {
            getSet(stubParentObject, 'foo', '-3');
            expect(getSet(stubParentObject, 'foo', '-=', '3')).toBe(-6);
        });
    });

    describe("called with '+=' operator in setValueOrOption (with a non-numeric optionValue)", function () {
        it("should concatenate that value to an empty string", function () {
            expect(getSet(stubParentObject, 'foo', '+=', 'some string value')).toBe('some string value');
        });
        it("should concatenate two string values", function () {
            getSet(stubParentObject, 'foo', 'some string value');
            expect(getSet(stubParentObject, 'foo', '+=', 'some string value')).toBe('some string valuesome string value');
            expect(stubParentObject.foo).toBe('some string valuesome string value');
        });
        it("should concatenate that value on an existing Number property", function () {
            getSet(stubParentObject, 'foo', 123);
            expect(getSet(stubParentObject, 'foo', '+=', 'some string value')).toBe('123some string value');
            expect(stubParentObject.foo).toBe('123some string value');
        });
    });

    describe("called with '-=' operator in setValueOrOption (with a non-numeric optionValue)", function () {
        it("should set and return NaN on a property that didn't exist", function () {
            expect(getSet(stubParentObject, 'foo', '-=', 'some string value')).toBeNaN();
        });
        it("should set and return NaN on an existing Number property", function () {
            getSet(stubParentObject, 'foo', 123);
            expect(getSet(stubParentObject, 'foo', '-=', 'some string value')).toBeNaN();
            expect(stubParentObject.foo).toBeNaN();
        });
    });
});
    
