function JasonPath2(path) {
    this.compile(path);
}
JasonPath2.prototype.compile = function(path) {
    console.log(path);
    debugger;
};
JasonPath2.prototype.queryObjects = function(object) {

};
JasonPath2.prototype.normalize = function jasonPath2_normalize(pathAsString) {
    var subx = [];
    return pathAsString.replace(/[\['](\??\(.*?\))[\]']/g, function($0, $1) {
        return "[#" + (subx.push($1) - 1) + "]";
    })
        .replace(/'?\.'?|\['?/g, ";")
        .replace(/;;;|;;/g, ";..;")
        .replace(/;$|'?\]|'$/g, "")
        .replace(/#([0-9]+)/g, function($0, $1) {
            return subx[$1];
        });
};