var FlappyBird = cc.PhysicsSprite.extend({

    _animation: null,
    state: 0,
    _fast: false,

    ctor: function () {
        this._super("res/bird_hero1.png");   //设置这个，否则无法获取sprite宽高

        this._animation = new cc.Animation();
        for (var i = 1; i <= 3; i++) {
            var birdhero = "res/bird_hero" + i + ".png";
            var texture = cc.textureCache.addImage(birdhero);
            var frame = cc.SpriteFrame.create(texture, cc.rect(0, 0, texture.width, texture.height));
            this._animation.addSpriteFrame(frame);
        }
        this._animation.setDelayPerUnit(1 / 20);
        var action = cc.animate(this._animation).repeatForever();
        this.runAction(action);
        this._fast = false;
        this._animation.retain();
    },

    initPhysical: function (space) {
        var body = new cp.Body(1, cp.momentForBox(1, this.width, this.height));
        //space.addBody(body);
        /*
        //var shape = new cp.BoxShape(body, this.width, this.height);
        var verts = [0, 0, 0, 2, 1, 2, 2, 1, 2, 0];

        for (var i = 0; i < verts.length; ++i) {
            verts[i] = verts[i] * this.width / 2 - this.width / 2;
        }
        var shape = new cp.PolyShape(body, verts, cp.vzero);
        shape.setElasticity(0.0);
        shape.setFriction(1);
        space.addShape(shape);
        */
        var verts = [-1, -1, -1, 0, 1, 0, 1, -1];
        var i;
        for (i = 0; i < verts.length; ++i) {
            verts[i] = verts[i] * this.width / 2;
        }
        var shape = new cp.PolyShape(body, verts, cp.vzero);
        shape.setElasticity(0.0);
        shape.setFriction(1);
        space.addShape(shape);

        shape.setCollisionType(MW.FLAPPY_BIRD_TAG);

        verts = [-1, 0, -1, 1, 0, 1, 0, 0];
        for (i = 0; i < verts.length; ++i) {
            verts[i] = verts[i] * this.width / 2;
        }
        shape = new cp.PolyShape(body, verts, cp.vzero);
        shape.setElasticity(0.0);
        shape.setFriction(1);
        space.addShape(shape);

        shape.setCollisionType(MW.FLAPPY_BIRD_TAG);
        this.setBody(body);
    },

    onExit: function () {
        this._super();
        this._animation.release();
    }
});


FlappyBird.createFlappyBird = function(space){
    var flappyBird = new FlappyBird();
    flappyBird.initPhysical(space);
    return flappyBird;
};