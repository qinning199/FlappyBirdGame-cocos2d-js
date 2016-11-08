/**
 * Created by oye on 15-4-19.
 */


var Utils = {
    /**
     * Generate a random integer value which meets [0, upperValue)
     * @param {number} upperValue
     * @returns {number}
     */
    randomNextInt: function(upperValue) {
        return Math.floor(Math.random() * upperValue);
    },

    /**
     * generate a random number value which meets [0, upperValue)
     * @param upperValue
     * @returns {number}
     */
    randomNextNumber: function (upperValue) {
        return Math.random() * upperValue;
    },

    /**
     * random a integer from [min, max]
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    rangeNextInt: function(min, max) {
        return min + this.randomNextInt(max - min + 1);
    },

    rangeNextNumber: function (min, max) {
        return min + this.randomNextNumber(max - min);
    },

    /**
     * 格式化字符串
     * @returns {string}
     */
    sprintf: function () {
        var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
        while (f) {
            if (m = /^[^\x25]+/.exec(f)) {
                o.push(m[0]);
            }
            else if (m = /^\x25{2}/.exec(f)) {
                o.push('%');
            }
            else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
                if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                    throw('Too few arguments.');
                }
                if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                    throw('Expecting number but found ' + typeof(a));
                }
                switch (m[7]) {
                    case 'b':
                        a = a.toString(2);
                        break;
                    case 'c':
                        a = String.fromCharCode(a);
                        break;
                    case 'd':
                        a = parseInt(a);
                        break;
                    case 'e':
                        a = m[6] ? a.toExponential(m[6]) : a.toExponential();
                        break;
                    case 'f':
                        a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
                        break;
                    case 'o':
                        a = a.toString(8);
                        break;
                    case 's':
                        a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
                        break;
                    case 'u':
                        a = Math.abs(a);
                        break;
                    case 'x':
                        a = a.toString(16);
                        break;
                    case 'X':
                        a = a.toString(16).toUpperCase();
                        break;
                }
                a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
                c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
                x = m[5] - String(a).length - s.length;
                p = m[5] ? str_repeat(c, x) : '';
                o.push(s + (m[4] ? a + p : p + a));
            }
            else {
                throw('Huh ?!');
            }
            f = f.substring(m[0].length);
        }
        return o.join('');
    },

    getDistance : function(point1,point2){
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    },

    arrayContain : function (arr, element) {
        if(arr && arr.length > 0) {
            for(var i = 0; i < arr.length; ++i) {
                if(arr[i] == element) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * @param {string} ccbFileName
     * @param {string} controllerName
     * @param {object | cc.Node} controllerNode
     * @returns {cc.Node | null}
     */
    loadNodeFromCCB : function(ccbFileName,containerNode,controllerName,controllerNode){
        if(!cc.isUndefined(controllerName) && !cc.isUndefined(controllerNode)){
            cc.BuilderReader.registerController(controllerName,controllerNode);
        }
        var node = cc.BuilderReader.load(ccbFileName, containerNode);
        return node;
    },

    /**
     *
     * @param {function} subType
     * @param {function} superType
     */
    inherits: function(subType, superType) {
        var subPrototype = Object.create(superType.prototype);
        subPrototype.constructor = subType;
        subType.prototype = subPrototype;
    },

    /**
     *
     * @param {string} url
     * @returns {Object}
     */
    loadJson: function (url) {
        if (!cc.sys.isNative) {
            return cc.loader.getRes(url);
        } else {
            if(jsb.fileUtils.isFileExist(url)) {
                return JSON.parse(jsb.fileUtils.getStringFromFile(url));
            } else {
                return null;
            }
        }
    },

    getText: function (key) {
        return GlobalData.configStrings[key];
    },

    getScreenShot: function (fileName) {
        cc.log("fileName:" + fileName);
        var tex = new cc.RenderTexture(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
        tex.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        tex.begin();
        cc.director.getRunningScene().visit();
        tex.end();

        var imgPath = jsb.fileUtils.getWritablePath();
        if (imgPath.length == 0) {
            return "";
        }
        var result = tex.saveToFile(fileName, cc.IMAGE_FORMAT_JPEG);
        if (result) {
            imgPath += fileName;
            cc.log("save image:" + imgPath);
            return imgPath;
        }
        return "";
    },

    isPad: function () {
        var winSize = cc.winSize;
        return (winSize.height / winSize.width < 1.5);
    }


};