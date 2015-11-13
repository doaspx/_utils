/**
 * Created by zhanghongtao on 2014/09/13.
 */
function isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};


module.exports = isNumber;