describe("jasonPath dupe tests", function() {
    testAll(function(obj, path) {
        var jasonPath = new JasonPath2(path);
        return jasonPath.queryObjects(obj);
    })
});