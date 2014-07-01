describe("jsonPath original tests", function() {
    it("can reproduce example 1 results", function() {
        var result = jsonPath(testJsonObject, "$..author"),
            expectedResult = JSON.stringify(testResult1);
        expect(expectedResult).toEqual(JSON.stringify(result));
    });
    it("can reproduce example 2 results", function() {
        var result = jsonPath(testJsonObject, "$..author", {
            resultType: "PATH"
        }),
            expectedResult = JSON.stringify(testResult2);
        expect(expectedResult).toEqual(JSON.stringify(result))
    });
});