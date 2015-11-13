/**
 * Created by zhanghongtao on 2014/09/13.
 */
console.log(new Date());


var c = (new Date()).toString().format('MM-dd hh:mm:ss');

console.log(c)
module.exports = {
    logger : require('./logger'),

    nStr : require('./string/utilString'),

    sms: require('./sms/util_sms'),

    mailer: require('./mail/util_mail'),

    nArr:  require('./array/utilArray')

};