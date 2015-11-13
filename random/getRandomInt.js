/**
 * Created by zhanghongtao on 2015/11/13.
 */

function getRandomInt(min, max) {
    if (max === undefined) { max = min; min = 0; }
    return parseInt(Math.random()*(max - min) + min);
};

module.exports = getRandomInt;