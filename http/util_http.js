/**
 * Created by zhanghongtao on 2014/09/13.
 */

function utilHttp(){

    var http = require('http')
        , https = require('https')
        , me = {} ;

    // 封装 app 对象
    me.wrapApp = function(app){
        app.getAjax = function(url, fn){
            app.get(url, function(req, res, next){
                try{
                    fn(req, res, next);
                }
                catch(e){
                    me.renderExc(res, e);
                }
            })
        };
        app.postAjax = function(url, fn){
            app.post(url, function(req, res, next){
                try{
                    fn(req, res, next);
                }
                catch(e){
                    me.renderExc(res, e);
                }
            })
        };
        app.allAjax = function(url, fn){
            app.all(url, function(req, res, next){
                try{
                    fn(req, res, next);
                }
                catch(e){
                    me.renderExc(res, e);
                }
            })
        };
    };

    // 得到 客户端的真实 IP 地址
    me.realIp = me.remoteRealIp = function(req) {
        return req.headers['x-real-ip'] || req.connection.remoteAddress;
    };

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // 代理请求，目前仅支持 GET 请求
    me.webAgent = me.agentRequest = function(opt, debug) {
        opt = me.applyIf(opt || {}, {
            agent: '',
            url: '',
            pms: {}
        });

        var tg = opt.agent;
        if (tg.indexOf('?') < 0) { tg += '?real_url='; }
        else { tg += "&real_url="; }
        tg += opt.url;
        for (var item in opt.pms) {
            if (!opt.pms.hasOwnProperty(item)) { continue; }
            tg += '&' + item + '=' + opt.pms[item];
        }

        web_exec(tg, opt.cb, debug);
    };

    // 采用代理请求，并以Json格式解析返回结果
    me.webAgentJson = me.agentReqJson = function (opt, debug) {
        opt = web_json(opt);
        me.webAgent(opt, debug);
    };

    // http 或 https 请求
    me.webReq = function(opt, debug) {
        opt = me.applyIf(opt || {}, {
            url: '',
            pms: {}
        });

        var tg = opt.url;
        if (tg.indexOf('?') < 0) { tg += '?__by=core'; }
        for (var item in opt.pms) {
            if (!opt.pms.hasOwnProperty(item)) { continue; }
            tg += '&' + item + '=' + opt.pms[item];
        }

        web_exec(tg, opt.cb, debug);
    };

    // 请求，以Json格式解析返回结果
    me.webReqJson = function (opt, debug) {
        opt = web_json(opt);
        me.webReq(opt, debug);
    };

    function web_exec(tg, cb, debug) {
        var inter = http;
        if (tg && tg.indexOf('https://') == 0) { inter = https; }

        if (debug === true) { console.log(tg); }
        var buf = [], buf_length = 0;
        inter.get(tg, function(r) {
            r.on('data', function(d) {
                buf.push(d);
                buf_length += d.length;
            });
            r.on('end', function() {
                var ret = Buffer.concat(buf, buf_length).toString();
                if (debug === true) { console.log(ret); }
                cb && cb(null, ret);
            });
        }).on('error', function(e) {
            cb && cb(e.message, null);
        });
    }

    function web_json(opt) {
        opt = opt || {};
        opt.__cb = opt.cb || function(err, ret) {};
        opt.cb = function(err, ret) {
            try {
                opt.__cb(err, JSON.parse(ret || '{}'));
            } catch (e) {
                opt.__cb(err + e.toString(), {});
            }
        };
        return opt;
    }
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // JSON special
    me.renderRes = function (res, err_str, val_core, val_ext) {
        if (err_str) {
            me.renderFai(res, {msg: err_str || ''});
        } else {
            if (val_core instanceof Array) {
                val_core = { records: val_core };
            }  else {
                val_core = { record: val_core };
            }

            me.renderSuc(res, me.merge(val_core, val_ext));
        }
    };

    me.renderMysqlRollback = function(res, trans, obj){
        trans.rollback();
        if(typeof obj == 'string') { obj =  {msg: obj}; }
        me.renderFai(res, obj);
    };

    me.renderCallBack = function(req, res, val, t) {
        if(typeof val === 'string') { val = {msg: val, tg: t} }

        var r =  me.genRenderVal(res, val, t);
        return res.redirect(req.pms['back_url'] + '?result_val=' + JSON.stringify(r));
    };
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // JSON common
    me.suc = me.renderSuc = function(res, obj) {
        me.renderResult(res, obj, 'suc');
    };

    me.fai = me.renderFai = function(res, obj) {
        me.renderResult(res, obj, 'fai');
    };

    me.render = function(res, msg) {
        return function(err, ret) {
            if (err) { return me.fai(res, {msg: msg || err.message || err}); }
            return me.suc(res, {ret: ret});
        }
    };

    me.renderExc = function(res, e) {
        var desc = "";
        for (var keys in e) {
            if (!e.hasOwnProperty(keys)) { continue; }
            desc += "[" + keys + "]:[" + e[keys] + ']; ';
        }
        me.renderFai(res, {msg_code: -1, msg: 'Exception: ' + e.toString() + desc});
    };

    me.renderResult = function(res, obj, t) {
        obj = me.genRenderVal(res, obj, t);

        if (res.req.pms.result_format == 'xml') {
            return me.renderResultXml(res, obj, t);
        }
        return me.renderDirect(res, obj);
    };

    me.renderDirect = function(res, render_value) {
        if(res.req.pms['jpc']){
            return res.jsonp(render_value);
        } else {
            return res.send(render_value);
        }
    };

    me.genRenderVal = function(res, obj, t) {
        obj = obj || {};
        if (typeof obj == 'string') { obj = {msg: obj}; }
        if (res.back_token) {obj.tok = res.back_token;}

        if (t == 'suc') {
            return me.applyIf(obj, {status: 'success', msg_code: 1, msg: 'success'});
        } else {
            return me.applyIf(obj, {status: 'failure', msg_code: 0, msg: 'failure'});
        }
    };

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // XML
    me.renderSucXml = function(res, obj){
        obj.succmsg = obj.msg ||'success';
        var xml = some_thing_to_xml(obj);
        xml = '<?xml version="1.0" encoding="UTF-8"?><hash>{{0}}</hash>'.format([xml]);
        res.header('Content-Type','application/xml');
        return res.send(xml);
    };

    me.renderFaiXml = function(res, obj){
        obj.errmsg = obj.msg ||'failure';
        var xml = "";
        for(var k in obj){
            if (!obj.hasOwnProperty(k)) { continue; }
            if(typeof obj[k] == 'function')continue;
            xml += "<"+k+">"+obj[k]+"</"+k+">";
        }
        xml = '<?xml version="1.0" encoding="UTF-8"?><hash>{{0}}</hash>'.format([xml]);
        res.header('Content-Type','text/html;charset=utf8');
        return res.send(xml);
    };

    me.renderExcXml = function(res, e){
        var desc = "";
        for(var keys in e){
            if (!e.hasOwnProperty(keys)) { continue; }
            desc+="["+keys+"]:["+e[keys] + ']; ';
        }

        return me.renderFaiXml(res, {msg_code: -1, msg: 'Exception: ' + e.toString() + desc});
    };

    me.renderResultXml = function(res, obj, t){
        if(t == 'suc') {
            me.renderSucXml(res, obj);
        } else {
            me.renderFaiXml(res, obj);
        }
    };

    function some_thing_to_xml(obj){
        var xml = "";
        for(var k in obj){
            if (!obj.hasOwnProperty(k)) { continue; }
            if(typeof k != 'string')continue;
            if(typeof obj[k] == 'function')continue;
            var v = obj[k];

            // is array
            if(typeof v!= 'string' && v.length && v.length > 0){
                v = array_to_xml(v, k.replace(/s$/,''));
            }
            // is hash
            if(typeof v == 'object'){
                v = some_thing_to_xml(v);
            }

            xml += "<"+k+">"+v+"</"+k+">";
        }
        return xml;
    }

    function array_to_xml(array, name){
        var temp = "";
        for(var i = 0; i< array.length; i++){
            if(typeof array[i] == 'function')continue;
            if(array[i]){
                var hash = {}; hash[name] = array[i];
                temp += some_thing_to_xml(hash);
            }
        }
        return temp;
    }

    return me;
}

module.exports  =  utilHttp();