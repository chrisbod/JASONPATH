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
    it("can run the first example expression on the home page ($.store.book[*].author)", function() {
        var result = jsonPath(testJsonObject, "$.store.book[*].author"),
            expectedResult = JSON.stringify(["Nigel Rees", "Evelyn Waugh", "Herman Melville", "J. R. R. Tolkien"]);
        expect(expectedResult).toEqual(JSON.stringify(result));
    });

    it("can run the third example expression on the home page ($.store.*)", function() {
        var result = jsonPath(testJsonObject, "$.store.*"),
            expectedResult = JSON.stringify([
                [{
                    "category": "reference",
                    "author": "Nigel Rees",
                    "title": "Sayings of the Century",
                    "price": 8.95
                }, {
                    "category": "fiction",
                    "author": "Evelyn Waugh",
                    "title": "Sword of Honour",
                    "price": 12.99
                }, {
                    "category": "fiction",
                    "author": "Herman Melville",
                    "title": "Moby Dick",
                    "isbn": "0-553-21311-3",
                    "price": 8.99
                }, {
                    "category": "fiction",
                    "author": "J. R. R. Tolkien",
                    "title": "The Lord of the Rings",
                    "isbn": "0-395-19395-8",
                    "price": 22.99
                }], {
                    "color": "red",
                    "price": 19.95
                }
            ]);
        expect(expectedResult).toEqual(JSON.stringify(result));

    });
    it("can run the fourth expression on the home page ($.store..price)", function() {
        var result = jsonPath(testJsonObject, "$.store..price"),
            expectedResult = JSON.stringify([8.95, 12.99, 8.99, 22.99, 19.95]);
        expect(expectedResult).toEqual(JSON.stringify(result));
    });
    it("can run the fifth example expression on the home page ($..book[2])", function() {
        var result = jsonPath(testJsonObject, "$..book[2]"),
            expectedResult = JSON.stringify([{
                "category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99
            }]);
        expect(expectedResult).toEqual(JSON.stringify(result));
    });
    /*  it("can run the sixth example expressions on the home page ($..book[(@.length-1)] and $..book[-1:])", function() {
        console.log(jsonPath(testJsonObject, "$.store.book[*].author"));
    });*/
});