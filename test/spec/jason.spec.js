describe("jasonPath dupe tests", function() {
    it("JASON can reproduce example 1 results", function() {
        var jasonPath = new JasonPath("$..author"),
            result = jasonPath.query(testJsonObject),
            expectedResult = JSON.stringify(testResult1);
        expect(expectedResult).toEqual(JSON.stringify(result));
    });
    it("JASON can reproduce example 2 results", function() {
        var jasonPath = new JasonPath("$..author"),
            result = jasonPath.query(testJsonObject, true),
            expectedResult = JSON.stringify(testResult2);
        expect(expectedResult).toEqual(JSON.stringify(result));
    });
});