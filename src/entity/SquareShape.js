/**
 * Created by oye on 16/10/7.
 */

var CircleShape = BaseShape.extend({
    createShapes: function (body) {
        var shape = new cp.BoxShape(body, this.width, this.height);
        shape.setElasticity(this.getShapeElasticity());
        shape.setFriction(this.getShapeFriction());
        return [shape];
    }
});