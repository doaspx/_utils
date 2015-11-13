/**
 * Created by zhanghongtao on 2014/09/13.
 */
module.exports = function(opt) {
    var me = {};
    opt = me.opt = opt || {};

    if (opt.host) {
        me.nodemailer = require("nodemailer");
        me.transport = me.nodemailer.createTransport(opt);
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // 可用的方法
    me.send = function(mail, cb){
        me.transport.sendMail(mail || {}, function(error, response) {
            if (error) { logger.log(error.message); }
            cb(error, response);
        });
    };

    me.close = function(){
        me.transport.close();
        logger.log("========== Mailer Server Quit Success.==========");
    };

    return me;
};
