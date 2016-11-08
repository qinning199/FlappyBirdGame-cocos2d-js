/**
 * Created by oye on 16/10/7.
 */

var CircleShape = BaseShape.extend({
    shapeConfig: null,
    ctor: function (shapeConfig) {
        this.shapeConfig = shapeConfig;
        this._super();
    },

    createShapes: function (body) {
        var shape = new cp.CircleShape(body, this.width, cp.vzero);
        shape.setElasticity(this.getShapeElasticity());
        shape.setFriction(this.getShapeFriction());
        return [shape];
    }
});