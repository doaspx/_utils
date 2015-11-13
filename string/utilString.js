/**
 * Created by zhanghongtao on 2015/11/13.
 */

function utilString(){
    utl.apply(String.prototype, {
        /**
         * ��ʽ���ַ���
         * eg:
         *  '{{0}}����{{1}}��Сʱ'.format([1, 24])
         *  or
         *  '{{day}}����{{hour}}��Сʱ'.format({day:1, hour:24}})
         * @param {Object} values
         */
        format: function (values) {
            return this.replace(/\{\{([\w\s\.\'\"\(\),-\[\]]+)?\}\}/g, function(match, key) {
                return values[key];
            });
        },
        /**
         * ɾ���������˵Ŀո�
         */
        trim: function() {
            return this.replace(/(^\s*)|(\s*$)/g,'');
        },
        /**
         * ɾ����ߵĿո�
         */
        ltrim: function() {
            return this.replace(/(^\s*)/g,'');
        },
        /**
         * ɾ���ұߵĿո�
         */
        rtrim: function() {
            return this.replace(/(\s*$)/g,'');
        },
        blank: function() {
            if(!this)return true;
            return this.length <= 0;
        },
        include: function(string) {
            if(!this)return false;
            return this.indexOf(string) >= 0;
        },
        lPad: function(size, pad) {
            var re = this;
            pad = pad || ' ';
            while (re.length < size) {
                re = pad + re;
            }
            return re;
        },
        rPad: function(size, pad) {
            var re = this;
            pad = pad || ' ';
            while (re.length < size) {
                re = re + pad;
            }
            return re;
        }
    });

    return String;
}