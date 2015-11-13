/**
 * Created by zhanghongtao on 2015/09/13.
 */

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 */
function escape (html){
    return String(html)
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
};

module.exports = escape;