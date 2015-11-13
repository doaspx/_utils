/**
 * Created by zhanghongtao on 2015/11/13.
 */
var utl = require('../base/base');

function utilArray(){
    utl.apply(Array, {
        in_array: function(n, v) {
            for(var i = 0; i < n.length; i++){
                if(n[i] == v) { return true; }
            }
            return false;
        }
    });
    utl.apply(Array.prototype, {
        // add by cd.net on 2013-01-15 数组中加入不重复的值
        push_uniq: function(v){
            for(var i=0;i<this.length;i++){
                if(this[i] === v){return false;}
            }
            this.push(v);
            return true;
        },
        in_array: function(v) {
            for(var i = 0; i < this.length; i++){
                if(this[i] == v) { return true; }
            }
            return false;
        },
        any_start_with: function(v) {
            for (var i = 0; i < this.length; i++) {
                if(v.indexOf(this[i]) == 0) { return true; }
            }
            return false;
        }
    });

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    return Array;
}

module.exports = utilArray();

