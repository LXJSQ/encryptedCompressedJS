/*
	Packer version 3.0 (final) - copyright 2004-2007, Dean Edwards
	http://www.opensource.org/licenses/mit-license
*/

eval(base2.namespace);
eval(JavaScript.namespace);

var IGNORE = RegGrp.IGNORE;
var REMOVE = "";
var SPACE = " ";
var WORDS = /\w+/g;

var Packer = Base.extend({
    minify: function(script) {
        script = script.replace(Packer.CONTINUE, "");
        script = Packer.data.exec(script);
        script = Packer.whitespace.exec(script);
        script = Packer.clean.exec(script);
        return script;
    },

    pack: function(script, base62) {
        script = this.minify(script + "\n");
        if (base62) script = this._base62Encode(script);
        return script;
    },

    _base62Encode: function(script) {
        var words = new Words(script);
        var encode = function(word) {
            return words.get(word).encoded;
        };

        /* build the packed script */

        var p = this._escape(script.replace(WORDS, encode));
        var a = Math.min(Math.max(words.size(), 2), 62);
        var c = words.size();
        var k = words;
        var e = Packer["ENCODE" + (a > 10 ? a > 36 ? 62 : 36 : 10)];
        var r = a > 10 ? "e(c)" : "c";

        // the whole thing
        return format(Packer.UNPACK, p, a, c, k, e, r);
    },

    _escape: function(script) {
        // single quotes wrap the final string so escape them
        // also escape new lines required by conditional comments
        return script.replace(/([\\'])/g, "\\$1").replace(/[\r\n]+/g, "\\n");
    },
}, {
    CONTINUE: /\\\r?\n/g,

    ENCODE10: "String",
    ENCODE36: "function(c){return c.toString(a)}",
    ENCODE62: "function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))}",

    UNPACK: "eval(function(p,a,c,k,e,r){e=%5;if(!''.replace(/^/,String)){while(c--)r[%6]=k[c]" +
        "||%6;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p." +
        "replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('%1',%2,%3,'%4'.split('|'),0,{}))",

    init: function() {
        this.data = reduce(this.data, function(data, replacement, expression) {
            data.put(this.javascript.exec(expression), replacement);
            return data;
        }, new RegGrp, this);
        this.clean = this.data.union(this.clean);
        this.whitespace = this.data.union(this.whitespace);
    },

    clean: {
        "\\(\\s*;\\s*;\\s*\\)": "(;;)", // for (;;) loops
        "throw[^};]+[};]": IGNORE, // a safari 1.3 bug
        ";+\\s*([};])": "$1"
    },

    data: {
        // strings
        "STRING1": IGNORE,
        'STRING2': IGNORE,
        "CONDITIONAL": IGNORE, // conditional comments
        "(COMMENT1)\\n\\s*(REGEXP)?": "\n$3",
        "(COMMENT2)\\s*(REGEXP)?": " $3",
        "([\\[(\\^=,{}:;&|!*?])\\s*(REGEXP)": "$1$2"
    },

    javascript: new RegGrp({
        COMMENT1: /(\/\/|;;;)[^\n]*/.source,
        COMMENT2: /\/\*[^*]*\*+([^\/][^*]*\*+)*\//.source,
        CONDITIONAL: /\/\*@|@\*\/|\/\/@[^\n]*\n/.source,
        REGEXP: /\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*/.source,
        STRING1: /'(\\.|[^'\\])*'/.source,
        STRING2: /"(\\.|[^"\\])*"/.source
    }),

    whitespace: {
        "(\\d)\\s+(\\.\\s*[a-z\\$_\\[(])": "$1 $2", // http://dean.edwards.name/weblog/2007/04/packer3/#comment84066
        "([+-])\\s+([+-])": "$1 $2", // c = a++ +b;
        "\\b\\s+\\$\\s+\\b": " $ ", // var $ in
        "\\$\\s+\\b": "$ ", // object$ in
        "\\b\\s+\\$": " $", // return $object
        "\\b\\s+\\b": SPACE,
        "\\s+": REMOVE
    }
});