/**
 * Created by kenkozheng on 2014/8/21.
 */

var FlappyBird = cc.PhysicsSprite.extend({

    _animation:null,
    state:0,
    _fast:false,

    ctor:function () {
        this._super("res/bird_hero1.png");   //设置这个，否则无法获取sprite宽高
        
        this._animation = new cc.Animation();
        for (var i = 1; i <= 3; i++) {
        	var birdhero = "res/bird_hero"+i+".png";
        	var texture = cc.textureCache.addImage(birdhero);
        	//参数1：图片路径，参数2:区域
        	var frame = cc.SpriteFrame.create(texture, cc.rect(0,0,texture.width,texture.height));
        	this._animation.addSpriteFrame(frame);
        }
        this._animation.setDelayPerUnit(1/20);
        var action = cc.animate(this._animation).repeatForever(); 
        this.runAction(action);
        this._fast = false;
        this._animation.retain();
        
        return true;
    },
    initPhysical:function(space){
        var winSize = cc.director.getWinSize();
        var body = new cp.Body(1, cp.momentForBox(1, this.width, this.height) );
        body.setPos(cc.p(winSize.width/2,winSize.height/2));
        space.addBody( body );
        var shape = new cp.BoxShape( body, this.width, this.height);
        shape.setElasticity( 0.0 );
        shape.setFriction( 0.0 );
        space.addShape( shape );
        shape.setCollisionType(MW.FLAPPY_BIRD_TAG);
        this.setBody(body);
    },
    toggleSpeed:function(fast) {
        if(fast == this._fast)
            return;
        this._fast = fast;

        this.stopAllActions();
        if(!fast)
            this._animation.setDelayPerUnit(1/20);
        else
            this._animation.setDelayPerUnit(1/60);
        var action = cc.animate(this._animation).repeatForever();
        this.runAction(action);
    },
    resetPos:function(){
        var winSize = cc.director.getWinSize();
        this.getBody().setPos(cc.p(winSize.width/2,winSize.height/2));
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