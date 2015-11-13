/**
 * Created by zhanghongtao on 2014/09/13.
 */
function utilBase(){
    var me = {};

    me.Fn = me.fn = function(){};
    // 适合 Asy使用的callback
    me.asyCb = function(cb) {
        return function(err, rows, fields) {
            cb && cb(err, rows);
        };
    };
    // ---------------------------------------
    // each item [JSON Object Or Array]
    me.forEach = function(obj, cb) {
        var len = obj.length;
        if (len !== undefined) {
            for (var i = 0; i < len; i++) {
                if (cb.call(obj[i], i, obj[i]) === false) { break; }
            }
        } else if (obj.toString() === '[object Object]') {
            for (var k in obj) {
                if (!obj.hasOwnProperty(k)) { continue; }
                if (cb.call(obj[k], k, obj[k]) === false) { break; }
            }
        }
    };

    // 返回一个集合的所有 keys 数组。
    me.getKeys = function(obj) {
        var keys = [];
        for (var k in obj || {}) {
            if (!obj.hasOwnProperty(k)) { continue; }
            keys.push(k);
        }
        return keys;
    };

    me.apply = me.merge = function(t, c, def) {
        if (def) { me.apply(t, def); }
        if (t && c && typeof c === 'object') {
            for (var i in c) {
                if (!c.hasOwnProperty(i)) { continue; }
                t[i] = c[i];
            }
        }
        return t;
    };

    me.applyStrict = function(t, c) {
        t = t || {};
        if (t && c) {
            for (var p in c) {
                if (!c.hasOwnProperty(p)) { continue; }
                if (c[p]) { t[p] = c[p]; }
            }
        }
        return t;
    };

    me.applyIf = function(t, c) {
        if (t && c) {
            for (var p in c) {
                if (!c.hasOwnProperty(p)) { continue; }
                if (t[p] === undefined) { t[p] = c[p]; }
            }
        }
        return t;
    };

    // 目前支持 Function 和 object
    // 得到的都将是一个Object.
    me.applyClone = function(c) {
        var t = {};
        var keys = Object.getOwnPropertyNames(c);
        if (typeof c == 'object') { keys = keys.concat(Object.getOwnPropertyNames(Object.getPrototypeOf(c))); }
        for (var i = 0; i < keys.length; i++) { t[keys[i]] = c[keys[i]]; }
        return t;
    };

    return me;
}


module.exports = utilBase();