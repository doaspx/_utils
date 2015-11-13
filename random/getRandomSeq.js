/**
 * Created by zhanghongtao on 2015/11/13.
 */

// 自动生成指定长度的随机数字验证码
var chars = "235679ACDEFGHJKMNPQRSTUVWXYZ";
function getRandomSeq (len) {
    var code = '';
    for (var i = 0; i < len; i++) { code += chars[parseInt(Math.random()*28)]; }
    return code;
};

module.exports = getRandomSeq ;
