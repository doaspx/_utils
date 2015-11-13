/**
 * Created by zhanghongtao on 2015/11/13.
 */

function getNextNum (cur, max, cb) {
    max = max || 100000000;
    cur = parseInt(cur);
    cur += 1;
    if (cur.toString().indexOf('4') >= 0) { getNextNum(cur, max, cb); }
    else { cb && cb(cur > max ? 0 : cur); }
};

module.exports = getNextNum;