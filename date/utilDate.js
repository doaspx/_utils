/**
 * Created by zhanghongtao on 2015/11/13.
 */
var utl = require('../base/base');

function utilDate(){
    utl.apply(Date, {
        // ����ʱ�������� [��λ] ʱ��
        diff: function(A, B, interval) {
            try {
                var ms = A - B;
                if(isNaN(ms)){ return null;}
                if(interval == 's'){
                    return parseInt(ms / 1000);
                } else if(interval == 'd'){
                    return parseInt(ms / 86400000);
                }
                return ms;
            } catch(e) {
                return null;
            }
        }
    });

    utl.apply(Date.prototype, {
        // ��ʽ��ʱ�������ʾ����new Date().format("yyyy-MM-dd hh:mm:ss");
        format: function (format) {
            format = format || "yyyy-MM-dd hh:mm:ss";
            var o = {
                "M+" : this.getMonth() + 1, //month
                "d+" : this.getDate(),    //day
                "h+" : this.getHours(),   //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
                "S" : this.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        },
        // ʱ�� �Ӽ� ������
        // (new Date()).day_add(5);    ��5��
        // (new Date()).day_add(-5);   ��5��
        day_add: function(change){
            this.setDate(this.getDate()+change);
            return this;
        }
    });

    return Date;
}


module.exports = utilDate();