/**
 * Created by oye on 16/10/7.
 */

var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;
var BaseShape = cc.PhysicsSprite.extend({
    shapeConfig: null,
    shapes: null,
    ctor: function (shapeConfig) {
        this.shapeConfig = shapeConfig;
        this.shapes = [];
        this._super("res/bird_hero1.png");
        this.initPhysical();
        this.initShapes();
    },

    initPhysical: function () {
        var body = this.createBody();
        this.setBody(body);
    },

    initShapes: function () {

        var shape = new cp.BoxShape(this.getBody(), this.width, this.height);
        shape.setElasticity(this.getShapeElasticity());
        shape.setFriction(this.getShapeFriction());
        this.shapes.push(shape);
        return;

        var shape;
        if (this.shapeConfig.type === ShapeType.SHAPE_TYPE_CIRCLE) {
            shape = new cp.CircleShape(this.getBody(), this.width, cp.vzero);
            shape.setElasticity(this.getShapeElasticity());
            shape.setFriction(this.getShapeFriction());
            this.shapes.push(shape);
        } else {
            for (var i = 0; i < this.shapeConfig.verts.length; ++i) {
                shape = new cp.PolyShape(this.getBody(), this.getShapeList(this.shapeConfig.verts[i]), cp.vzero);
                this.shapes.push(shape);
                //shape.setLayers(NOT_GRABABLE_MASK);
            }
        }
    },

    addToSpaces: function (space) {
        space.addBody(this.getBody());
        for (var i = 0; i < this.shapes.length; ++i) {
            space.addShape(this.shapes[i]);
        }
    },

    createBody: function () {
        if (this.shapeConfig.type === ShapeType.SHAPE_TYPE_CIRCLE) {
            return new cp.Body(this.getMass(), cp.momentForCircle(1, 0, this.width, cp.vzero));
        } else {
            var moment = 0;
            for (var i = 0; i < this.shapeConfig.verts.length; ++i) {
                var shapeList = this.getShapeList(this.shapeConfig.verts[i]);
                moment += cp.momentForPoly(this.getMass(), shapeList, cp.v((shapeList[0] + shapeList[4]) / 2, (shapeList[1] + shapeList[5]) / 2));
            }
            return new cp.Body(this.getMass(), moment);
        }
    },

    createShapes: function () {
        return [];
    },

    getShapeElasticity: function () {
        return 0.1;
    },

    getShapeFriction: function () {
        return 0.6;
    },

    getMass: function () {
        return 1;
    },

    getShapeList: function (normalShapeList) {
        var resultShapeList = [];
        for (var j = 0; j < normalShapeList.length; ++j) {
            resultShapeList[j] = normalShapeList[j] * this.width / this.shapeConfig.getMaxWidth() - this.width / 2;
        }
        return resultShapeList;
    }
});