/**
 * Created by oye on 16/10/8.
 */


var ShapeConfigMan = cc.Class.extend({
    shapeList: null,
    ctor: function () {
        this.shapeList = [];
        this.reloadData();
    },

    reloadData: function () {
        var elementObj = Utils.loadJson("res/config/poly_shape.json");
        var shapes = elementObj["shapes"];
        for (var i = 0; i < shapes.length; ++i) {
            var shape = shapes[i];
            var shapeConfig = new ShapeConfig();
            shapeConfig.unmarshal(shape);
            this.shapeList.push(shapeConfig);
        }
    },

    getShapeConfigList: function () {
        return this.shapeList;
    },

    getRandomShapeConfig: function () {
        return this.shapeList[Utils.randomNextInt(this.shapeList.length)];
    }
});

ShapeConfigMan.instance = null;

ShapeConfigMan.getInstance = function () {
    if (ShapeConfigMan.instance == null) {
        ShapeConfigMan.instance = new ShapeConfigMan();
    }
    return ShapeConfigMan.instance;
};
