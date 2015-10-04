var Obstacle = cc.PhysicsSprite.extend({

    ctor: function (fileName) {
        this._super(fileName);   //设置这个，否则无法获取sprite宽高

        return true;
    },
    initPhysical: function (space) {
        var winSize = cc.director.getWinSize();
        var body = new cp.Body(1, cp.momentForBox(1, this.width, this.height));
        var shape = new cp.BoxShape(body, this.width, this.height);
        shape.setElasticity(0.0);
        shape.setFriction(0.0);
        space.addShape(shape);
        shape.setCollisionType(MW.OBSTACLE_TAG);
        this.setBody(body);
    },
    move: function () {
        var winSize = cc.director.getWinSize();
        var actionBy = cc.moveBy(2.5, cc.p(-winSize.width - this.width * 2, 0));
        this.runAction(actionBy);
    },
    onExit: function () {
        this._super();
    },
    resetPos: function () {
        this.setPosition(cc.p(-200, 0));
    }
});

Obstacle.create = function(isUp, space){
    var obstacle = new Obstacle(isUp?"res/obstacle_up.png":"res/obstacle_down.png");
    obstacle.initPhysical(space);
    return obstacle;
};