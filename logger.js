/**
 * Created by zhanghongtao on 2014/09/13.
 */
function init() {
    var me = {};

    function log_time() {
        var msg = '[' + (new Date()).format('MM-dd hh:mm:ss') + ']';
        return msg;
    }

    me.log = function(msg){
        console.log(log_time() + (JSON.stringify(msg) || ''));
    };

    me.newLine = function(msg){
        console.log('\n' + log_time() + (JSON.stringify(msg) || ''));
    };

    me.print_all = me.p = me.print = function(err, reply) {
        if (err) { me.log("Err: " + err); }
        else { me.log(reply); }
    };

    me.just_res = function(err, reply) {
        if (err) { console.log("Err: " + err); }
        else { console.log(reply); }
    };

    me.err = function(err, ret) {
        if (err) { me.log("Err: " + err); }
    };

    me.errExit = function(err, ret) {
        if (err) {
            me.log(err);
            me.log(ret);
            process.exit();
        }
    };

    return me;
}

module.exports = init();