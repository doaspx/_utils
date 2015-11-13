/**
 * Created by zhanghongtao on 2014/09/13.
 */
var utl  = require('./../base/base');
var logger  = require('./../logger').init;

var server = [
    {host: '10.111.111.162', port: 26300},
    {host: '10.111.111.179', port: 26300},
    {host: '10.111.111.180', port: 26300}
];

var server_test = [
    {host: '10.10.11.188', port: 26300},
    {host: '10.10.11.189', port: 26300},
    {host: '10.10.11.190', port: 26300}
];

exports.connRedis = function (c, rw) {
    var me = {};
    if (c.n) { me.sentinel = require('redis-sentinel'); }

    if (rw.indexOf('r') >= 0) {
        if (c.n) {
            logger.log('[+++++R] ' + c.n);
            me.read = me.sentinel.createClient(c.test ? server_test : server, c.n, utl.applyIf({role: 'slave'}, c));
            me.read.on('ready', function() { logger.log(me.read.connectionOption); });
            me.read.on('error', function(err) { if (err.message) { logger.log(err); }});
        } else {
            var p = c.port || c.p, h = c.host || c.h;
            me.read = require("redis").createClient(p, h, {auth_pass: c.pass});

            me.read.on("error", function (err) {
                logger.log("[R*****Error]" + h + ':' + p + '. Info:' + err);
            });
            me.read.on("connect", function () {
                logger.log('[+++++R]' + h + ':' + p + ' connected. ');
            });
        }
    }
    if (rw.indexOf('w') >= 0) {
        if (c.n) {
            logger.log('[+++++W] ' + c.n);
            me.write = me.sentinel.createClient(c.test ? server_test : server, c.n, utl.applyIf({role: 'master'}, c));
            me.write.on('ready', function() { logger.log(me.write.connectionOption); });
            me.write.on('error', function(err) { if (err.message) { logger.log(err); }});
        } else {
            var pw = c.port || c.p, hw = c.host || c.h;
            me.write = require('redis').createClient(pw, hw, {auth_pass: c.pass});

            me.write.on("error", function (err) {
                logger.log("[W*****Error]" + hw + ':' + pw + '. Info:' + err);
            });
            me.write.on("connect", function () {
                logger.log('[+++++W]' + hw + ':' + pw + ' connected. ');
            });
        }
    }
    return me;
};

exports.connSession = function(cnf) {
    if (cnf.n) {
        logger.log('[SESSION] ' + cnf.n);
        var sentinel = require('redis-sentinel');
        var master = sentinel.createClient(cnf.test ? server_test : server, cnf.n, utl.applyIf({role: 'master'}, cnf));
        master.on('ready', function() { logger.log(master.connectionOption); });
        master.on('error', function(err) { if (err.message) { logger.log(err); }});
        return master;
    } else {
        var p = cnf.p || cnf.port, h = cnf.h || cnf.host;
        var res = require('redis').createClient(p, h, cnf);
        res.on("error", function(err) { logger.log("[SESSION-Error]" + h + ':' + p + '. Info:' + err); });
        res.on("connect", function() { logger.log('[SESSION]' + h + ':' + p + ' connected.'); });
        return res;
    }
};
