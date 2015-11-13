/**
 * Created by zhanghongtao on 2015/11/13.
 */

function utilString(){
    utl.apply(String.prototype, {
        /**
         * 格式化字符串
         * eg:
         *  '{{0}}天有{{1}}个小时'.format([1, 24])
         *  or
         *  '{{day}}天有{{hour}}个小时'.format({day:1, hour:24}})
         * @param {Object} values
         */
        format: function (values) {
            return this.replace(/\{\{([\w\s\.\'\"\(\),-\[\]]+)?\}\}/g, function(match, key) {
                return values[key];
            });
        },
        /**
         * 删除左右两端的空格
         */
        trim: function() {
            return this.replace(/(^\s*)|(\s*$)/g,'');
        },
        /**
         * 删除左边的空格
         */
        ltrim: function() {
            return this.replace(/(^\s*)/g,'');
        },
        /**
         * 删除右边的空格
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