/**
 * Created by zhanghongtao on 2014/09/13.
 */
function utilSec () {
    var me = {};
    var crypto = require('crypto');

    me.parse_session_key = function(str, secret){
        return me.tl50_unsign(str.slice(2), secret);
    };

    me.parse_uid = function(str){
        return 0 == str.indexOf('t:') ? str.slice(2, str.lastIndexOf('.')) : str;
    };

    me.get_session_key = function(secret){
        var uid = me.tl50_uid(24);
        return {id: uid, token: 't:' + me.tl50_sign(uid, secret)};
    };

    // 如果传入一个 无效的 uid，这里将自动给创建一个新的uid.
    me.calc_token = function(uid, secret){
        return 't:' + me.tl50_sign(uid, secret);
    };

    me.tl50_unsign = function(val, secret){
        var str = val.slice(0, val.lastIndexOf('.'));
        return me.tl50_sign(str, secret) == val
            ? str
            : false;
    };

    me.tl50_sign = function(val, secret){
        return val + '.' + crypto
                .createHmac('sha256', secret)
                .update(val)
                .digest('base64')
                .replace(/[+=]/g, '');
    };

    me.tl50_uid = function(len) {
        return crypto.randomBytes(Math.ceil(len * 3 / 4))
            .toString('base64')
            .replace(/[+=]/g, '')
            .slice(0, len);
    };

    me.md5 = function(str, encoding){
        return crypto.createHash('md5').update(str).digest(encoding || 'hex');
    };

    me.sha1 = function(str, encoding){
        return crypto.createHash('sha1').update(str).digest(encoding || 'hex');
    };

    me.check_interface_md5 = function(source, md5, key){
        key = key || 'bmc';
        return me.md5(source+key) == md5.toLowerCase();
    };

    me.check_md5 = function(source, md5, key){
        return me.check_interface_md5(source, md5, key);
    };

    me.check_interface_sha1 = function(source, sha1, key){
        key = key || 'bmc';
        return me.sha1(source+key) == sha1.toLowerCase();
    };

    me.check_sha1 = function(source, sha1, key){
        return me.check_interface_sha1(source, sha1, key);
    };

    me.get_interface_md5 = function(source, key){
        key = key || 'bmc';
        return me.md5(source+key);
    };

    me.get_interface_sha1 = function(source, key){
        key = key || 'bmc';
        return me.sha1(source+key);
    };

    return me;
}
module.exports = utilSec();