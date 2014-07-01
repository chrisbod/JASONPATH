describe("jasonPath dupe tests", function() {
    testAll(function(obj, path) {
        var jasonPath = new JasonPath(path);
        return jasonPath.queryObjects(obj);
    })
});