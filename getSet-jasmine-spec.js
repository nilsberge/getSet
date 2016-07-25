describe("getSet function", function () {
    // vars for all tests
    var stubParentObject;

    // setup and teardown
    beforeAll(function () {
        stubParentObject = {};
    });
    beforeEach(function () {});
    afterEach(function () {});

    // specs
    describe("called without arguments", function () {
        it("should throw a TypeError for parentObject", function () {
            expect(function () {
                getSet();
            }).toThrowError(TypeError, "getSet: Cannot determine argument 'parentObject'. 'parentObject' is of type 'Undefined'.");
        });
    });

    describe("called without a propertyPath", function () {
        it("should throw a TypeError for propertyPath", function () {
            expect(function () {
                getSet(stubParentObject);
            }).toThrowError(TypeError, "getSet: Cannot determine argument 'propertyPath'. 'propertyPath' is of type 'Undefined'.");
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
        var testSetValue = 123;

        it("should create the path to the property, set the value and return it", function () {
            expect(getSet(stubParentObject, 'foo.bar', testSetValue)).toBe(testSetValue);
        });
        it("should set the value at the full path supplied", function () {
            expect(stubParentObject.foo.bar).toBe(testSetValue);
        });
    });

    describe("setting a value as a property of a string object", function () {
        it("should throw a TypeError for that property", function () {
            stubParentObject.foo = 'some string value';
            expect(function () {
                getSet(stubParentObject, 'foo.bar', 123);
            }).toThrowError(TypeError, "getSet: Cannot create 'foo.bar'. 'foo' is of type 'String'.");
        });
        it("should not create the property", function () {
            expect(stubParentObject.foo.bar).toBeUndefined();
        });
    });

    describe("setting a value as a property of a number object", function () {
        it("should throw a TypeError for that property", function () {
            stubParentObject.foo = 123;
            expect(function () {
                getSet(stubParentObject, 'foo.bar', 'some string value');
            }).toThrowError(TypeError, "getSet: Cannot create 'foo.bar'. 'foo' is of type 'Number'.");
        });
        it("should not create the property", function () {
            expect(stubParentObject.foo.bar).toBeUndefined();
        });
    });

    describe("called with || operator in propertyPath, and a setValue defined", function () {
        it("should get the value if the property already existed", function () {
            stubParentObject.foo = 123;
            expect(getSet(stubParentObject, 'foo || ', 456)).toBe(123);
        });
        it("should return the passed value if the property didn't exist", function () {
            expect(getSet(stubParentObject, 'bar || ', 789)).toBe(789);
        });
        it("should set the property if it didn't exist", function () {
            expect(stubParentObject.bar).toBe(789);
        });
    });
});
