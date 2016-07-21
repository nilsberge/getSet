describe("Calling getSet", function () {
    // setup and teardown
    beforeAll(function () {
        delete window.getSetTestObject;
    });
    beforeEach(function () {});
    afterEach(function () {});

    // specs
    describe("with no arguments", function () {
        it("should throw a TypeError for parentObject", function () {
            expect(function () {
                getSet();
            }).toThrowError(TypeError, 'getSet: Cannot determine argument \'parentObject\'. \'parentObject\' is of type \'Undefined\'.');
        });
    });

    describe("without a propertyPath", function () {
        it("should throw a TypeError for propertyPath", function () {
            expect(function () {
                getSet(window);
            }).toThrowError(TypeError, 'getSet: Cannot determine argument \'propertyPath\'. \'propertyPath\' is of type \'Undefined\'.');
        });
    });

    describe("to get a deep undefined property", function () {
        it("should just return undefined", function () {
            expect(getSet(window, 'getSetTestObject.foo.bar')).toBeUndefined();
        });
        it("should not create any path to the deep property that didn't already exist", function () {
            expect(window.getSetTestObject).toBeUndefined();
        });
    });

    describe("to set a value on a deep property path", function () {
        var testSetValue = 123;

        it("should create the path to the property, set the value and return it", function () {
            expect(getSet(window, 'getSetTestObject.foo.bar', testSetValue)).toBe(testSetValue);
        });
        it("the property should be set at the full path supplied", function () {
            expect(window.getSetTestObject.foo.bar).toBe(testSetValue);
        });
    });

    describe("to set a value as a property of a string", function () {
        it("should throw a TypeError for that property", function () {
            window.getSetTestObject = {
                foo: 'some string value'
            };
            expect(function () {
                getSet(window, 'getSetTestObject.foo.bar', 123);
            }).toThrowError(TypeError, 'getSet: Cannot create \'getSetTestObject.foo.bar\'. \'getSetTestObject.foo\' is of type \'String\'.');
        });
        it("should not create the property", function () {
            expect(window.getSetTestObject.foo.bar).toBeUndefined();
        });
    });

    describe("to set a value as a property of a number", function () {
        it("should throw a TypeError for that property", function () {
            window.getSetTestObject = {
                foo: 123
            };
            expect(function () {
                getSet(window, 'getSetTestObject.foo.bar', 'some string value');
            }).toThrowError(TypeError, 'getSet: Cannot create \'getSetTestObject.foo.bar\'. \'getSetTestObject.foo\' is of type \'Number\'.');
        });
        it("should not create the property", function () {
            expect(window.getSetTestObject.foo.bar).toBeUndefined();
        });
    });
});
