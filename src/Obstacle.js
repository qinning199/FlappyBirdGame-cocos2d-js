/**
 * Created by kenkozheng on 2014/8/21.
 */

var Obstacle = cc.Sprite.extend({

    ctor:function (fileName) {
    	this._super(fileName);   //设置这个，否则无法获取sprite宽高
        
        return true;
    },
    initObstacle:function(space){
    	
    	
//    	var body = new cp.Body(1, cp.momentForBox(1, this.width, this.height) );
////    	body.nodeIdleTime = 1;
//
//    	//创建一个多边形
//
//    	var shape = new cp.BoxShape(body,this.width,this.height);
//    	shape.setElasticity( 1 );
//    	shape.setFriction( 0.5 );
//    	shape.setCollisionType(MW.OBSTACLE_TAG);
//    	shape.setLayers(2);
//    	//把创建的多边形加到物理世界中
//    	space.addShape( shape );
//
//    	this.setBody( body );
    	
    },
    move:function(){
    	var winSize = cc.director.getWinSize();
    	var actionBy = cc.moveBy(2.5, cc.p(-winSize.width -this.width*2, 0));
    	this.runAction(actionBy);
    },
    onExit: function () {
        this._super();
    },
    resetPos:function(){
    	var winSize = cc.director.getWinSize();
    	this.x = winSize.width + this.width;
    }
});

Obstacle.create = function(isUp){
    var obstacle = new Obstacle(isUp?"res/obstacle_up.png":"res/obstacle_down.png");
    obstacle.setAnchorPoint(cc.p(0.5,0));
    return obstacle;
};

Obstacle.getRandomPosY = function(height){
    var random = Math.random();
    var winSize = cc.director.getWinSize();
    return -random * height * 0.67;
};
Obstacle.createTwoObstacle = function(){

    var random = Math.random();
    var winSize = cc.director.getWinSize();

    var topObstacle = new Obstacle("res/obstacle_up.png");
    topObstacle.initObstacle();
    topObstacle.setAnchorPoint(cc.p(0.5,0));

    topObstacle.x = winSize.width + topObstacle.width;
    parent.addChild(topObstacle);

    var bottomObstacle = new Obstacle("res/obstacle_down.png");
    bottomObstacle.initObstacle(space);
    bottomObstacle.setAnchorPoint(cc.p(0.5,0));
    
    var x = winSize.width + bottomObstacle.width;
    
//    bottomObstacle.body.setPos(cc.p(x,-random * bottomObstacle.height * 0.67));
////    
//    topObstacle.body.setPos(cc.p(x,bottomObstacle.y + bottomObstacle.height + 150));
    
    bottomObstacle.x = x;
    topObstacle.x = x;
    bottomObstacle.y = -random * bottomObstacle.height * 0.67;
    topObstacle.y = bottomObstacle.y + bottomObstacle.height + 150;
    parent.addChild(bottomObstacle);
    
    topObstacle.move();
    
    bottomObstacle.move();
    
    return [topObstacle,bottomObstacle];
};