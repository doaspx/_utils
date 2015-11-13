/**
 * Created by zhanghongtao on 2014/09/13.
 */
var uHttp = require('./../http/util_http');

var uBase = require('./../base/base');

// 短信平台系统
module.exports = function(opt) {
    var me = {};
    me.opt = opt || {};

    me.send = function(cnf, ct, mcb) {
        if (mcb) {
            cnf = {
                mobiles: cnf,
                content: ct
            };
        } else {
            mcb = cnf.cb || function() {};
            cnf.cb && delete cnf.cb;
        }
        uHttp.webReqJson({
            url: opt.host,
            pms: uBase.apply({
                access_key: opt.access_key
            }, cnf),
            cb: mcb
        }, true);
    };

    return me;
};