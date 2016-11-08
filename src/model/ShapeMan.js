/**
 * Created by oye on 16/10/9.
 */

var ShapeMan = cc.Class.extend({
    ctor: function () {
    },

    getRandomShape: function () {
        var shapeConfig = ShapeConfigMan.getInstance().getRandomShapeConfig();
        var shape = new BaseShape(shapeConfig);
        return shape;
    }
});

ShapeMan.instance = null;

ShapeMan.getInstance = function () {
    if (ShapeMan.instance == null) {
        ShapeMan.instance = new ShapeMan();
    }
    return ShapeMan.instance;
};