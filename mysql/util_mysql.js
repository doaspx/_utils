/**
 * Created by zhanghongtao on 2014/09/13.
 */
var logger = require('./../logger').init;

exports.init = function(cnf) {
    var me = {
        mysql: require('mysql'),
        client: null,
        conn_smg: (cnf.host + ':' + cnf.port + ' [DB: ' + cnf.database + '] ').rPad(40)
    };

    function conn_mysql(me) {
        me.client = new me.mysql.createConnection(cnf);
        me.client.parent = me;
        me.client.connect(function(err) {
            if (err) {
                logger.log(me.conn_smg + ' MySQL conn error. INFO: ' + err + ' | exit(), Bye bye!');
                process.exit();
            } else {
                logger.log(me.conn_smg + ' MySQL connected.');
            }
        });
    }
    conn_mysql(me);


    // �����Ҫ�Զ���������ִ�� keep alive check
    // Ĭ���� 10 ���ӡ�
    if (cnf.reconnect !== false) {
        setInterval(function() {
            logger.log(me.conn_smg + ' MySQL keep start.');
            me.client.query("select now();", function(err, r, fs) {
                if (err) {
                    // �Զ���������
                    me.client.end();
                    logger.log(me.conn_smg + ' MySQL Keep fai. Now to reconnect...[' + err + ']');
                    conn_mysql(me);
                } else {
                    logger.log(me.conn_smg + ' MySQL Keep suc.[' + JSON.stringify(r) + ']');
                }
            });
        }, cnf.keepInter || 600*1000);
    }

    return me;
};