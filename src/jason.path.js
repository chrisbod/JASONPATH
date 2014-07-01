function JasonPath(path) {
    this.path = path || this.path;
    this.queryMethod = this.buildQuery(this.path);
}
JasonPath.prototype.path = "";
JasonPath.prototype.normalizedPath = "";
JasonPath.prototype.currentMode = null;
JasonPath.prototype.currentResult = null;
JasonPath.prototype.queryObjects = function jasonPath_queryObjects(object) {
    this.currentMode = "VALUE";
    this.currentResult = [];
    this.trace(this.normalizedPath.replace(/^\$;/, ""), object, "$");
    var result = this.currentResult;
    delete this.currentResult;
    delete this.currentMode;
    return result;
};
JasonPath.prototype.queryPaths = function jasonPath_queryPaths(object) {
    this.currentMode = "PATH";
    this.currentResult = [];
    this.trace(this.normalizedPath.replace(/^\$;/, ""), object, "$");
    var result = this.currentResult;
    delete this.currentResult;
    delete this.currentMode;
    return result;
};
JasonPath.prototype.query = function jasonPath_query(object, returnAsPaths) {
    if (!returnAsPaths) {
        return this.queryObjects(object);
    } else {
        return this.queryPaths(object);
    }
};
JasonPath.prototype.buildQuery = function jasonPath_buildQuery(pathAsString) {
    this.normalizedPath = this.normalize(pathAsString);

};
JasonPath.prototype.normalize = function jasonPath_normalize(pathAsString) {
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
JasonPath.prototype.trace = function jasonPath_trace(expr, val, path) {
    if (expr) {
        var x = expr.split(";"),
            loc = x.shift(),
            jasonPath = this;
        x = x.join(";");
        if (val && val.hasOwnProperty(loc))
            this.trace(x, val[loc], path + ";" + loc);
        else if (loc === "*") {
            this.walk(loc, x, val, path, function(m, l, x, v, p) {
                this.trace(m + ";" + x, v, p);
            });
        } else if (loc === "..") {
            this.trace(x, val, path);
            this.walk(loc, x, val, path, function(m, l, x, v, p) {
                typeof v[m] === "object" && jasonPath.trace("..;" + x, v[m], p + ";" + m);
            });
        } else if (/,/.test(loc)) { // [name1,name2,...]
            for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
                this.trace(s[i] + ";" + x, val, path);
        } else if (/^\(.*?\)$/.test(loc)) { // [(expr)]
            this.trace(this.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
        } else if (/^\?\(.*?\)$/.test(loc)) { // [?(expr)]
            this.walk(loc, x, val, path, function(m, l, x, v, p) {
                if (jasonPath.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) jasonPath.trace(m + ";" + x, v, p);
            });
        } else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) { // [start:end:step]  phyton slice syntax
            this.slice(loc, x, val, path);
        }
    } else {
        this.store(path, val);
    }
};

JasonPath.prototype.walk = function jasonPath_walk(loc, expr, val, path, f) {
    if (val instanceof Array) {
        for (var i = 0, n = val.length; i < n; i++)
            if (i in val)
                f(i, loc, expr, val, path);
    } else if (typeof val === "object") {
        for (var m in val)
            if (val.hasOwnProperty(m))
                f(m, loc, expr, val, path);
    }
};

JasonPath.prototype.slice = function jasonPath_slice(loc, expr, val, path) {
    if (val instanceof Array) {
        var len = val.length,
            start = 0,
            end = len,
            step = 1;
        loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0, $1, $2, $3) {
            start = parseInt($1 || start);
            end = parseInt($2 || end);
            step = parseInt($3 || step);
        });
        start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
        end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
        for (var i = start; i < end; i += step)
            this.trace(i + ";" + expr, val, path);
    }
};
JasonPath.prototype.asPath = function(path) {
    var x = path.split(";"),
        p = "$";
    for (var i = 1, n = x.length; i < n; i++)
        p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
    return p;
};
JasonPath.prototype.eval = function jasonPath_eval(x, _v, _vname) {
    try {
        return _v && eval(x.replace(/@/g, "_v"));
    } catch (e) {
        throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a"));
    }
};
JasonPath.prototype.store = function(p, v) {
    if (p) {
        this.currentResult.push(this.currentMode == "PATH" ? this.asPath(p) : v);
    }
    return !!p;
};