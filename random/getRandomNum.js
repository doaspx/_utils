/**
 * Created by zhanghongtao on 2015/11/13.
 */

function getRandomNum (len) {
    return(Math.random().toString()).substring(2, 2 + len);
};

module.exports = getRandomNum ;