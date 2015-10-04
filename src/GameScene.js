
var GameView = cc.Layer.extend({
    flappyBird: null,
    space: null,
    winSize: null,
    obstaclePool: null,
    index: 0,
    m_sprLogo: null,
    m_btnStart: null,
    gameStatus: null,
    m_sprGameOver: null,
    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();
        MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_START;
        // 设置单点触摸
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchEnded: this.onTouchEnded
        }, this);
        var _self = this;
        cc.BuilderReader.registerController("GameViewController", {
            "keypressedBtnStart": function (sender, controlEvent) {
                switch (controlEvent) {
                    case cc.CONTROL_EVENT_TOUCH_UP_INSIDE:
                        _self.m_btnStart = this["m_btnStart"];
                        _self.m_sprLogo = this["m_sprLogo"];
                        _self.m_sprGameOver = this["m_sprGameOver"];

                        _self.startGame();
                        break;
                    default:
                        break;
                }
            }
        });

        cc.BuilderReader.setResourcePath("res/");

        var node = cc.BuilderReader.load("res/ccb/GameView.ccbi", this);

        if (node != null) {
            this.addChild(node);
        }
        this.winSize = cc.director.getWinSize();
        this.space = new cp.Space();


        this.initPhysics();
        this.initObstacles();


        //var o = Obstacle.create(true, this.space);
        //this.addChild(o);
        //o.body.setPos(cp.v(200, 400));
        //o = Obstacle.create(false, this.space);
        //this.addChild(o);
        //o.body.setPos(cp.v(200, -20));

        return true;
    },
    initPhysics: function () {
        var space = this.space;
        var staticBody = space.staticBody;
        var winSize = this.winSize;

        // Walls
        var walls = [new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(winSize.width, 0), 0),				// bottom
            new cp.SegmentShape(staticBody, cp.v(0, winSize.height), cp.v(winSize.width, winSize.height), 0),	// top
            new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(0, winSize.height), 0),				// left
            new cp.SegmentShape(staticBody, cp.v(winSize.width, 0), cp.v(winSize.width, winSize.height), 0)	// right
        ];
        for (var i = 0; i < walls.length; i++) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(0);
            shape.setCollisionType(MW.WALL_TAG);
            space.addStaticShape(shape);
        }

        // Gravity
        space.gravity = cp.v(0, -980);
        //this.initDebugMode();
    },
    initDebugMode: function () {
        this._debugNode = cc.PhysicsDebugNode.create(this.space);
        this.addChild(this._debugNode);
    },
    initObstacles: function () {
        this.obstaclePool = [];
        for (var i = 0; i < 6; i++) {
            var o = Obstacle.create(!(i % 2), this.space);
            o.resetPos();
            this.addChild(o);
            this.obstaclePool[i] = o;
        }
    },
    startGame: function () {
        this.m_btnStart.setVisible(false);
        this.m_sprLogo.setVisible(false);
        this.m_sprGameOver.setVisible(false);
        MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_IN;
        this.createBirdSprite();
        this.resetObstacles();
    },
    createBirdSprite: function () {
        if (this.flappyBird == null) {
            var flappyBird = FlappyBird.createFlappyBird(this.space);
            this.addChild(flappyBird, 1);
            this.flappyBird = flappyBird;
        } else {
            this.flappyBird.reset();
        }
        this.flappyBird.setVisible(true);
        this.flappyBird.setCenter();
        this.schedule(this.resetObstacle, 1.3);

        this.resetObstacles();
    },
    resetObstacles: function () {
        for (var i = 0; i < this.obstaclePool.length; i++) {
            var o = this.obstaclePool[i];
            o.setVisible(true);
            o.resetPos();
        }
    },
    onEnter: function () {
        this._super();

        this.space.addCollisionHandler(MW.FLAPPY_BIRD_TAG, MW.OBSTACLE_TAG,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
        this.space.addCollisionHandler(MW.FLAPPY_BIRD_TAG, MW.WALL_TAG,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
        this.scheduleUpdate();

    },
    onExit: function () {
        //移除物理碰撞检测
        this.space.removeCollisionHandler(MW.FLAPPY_BIRD_TAG, MW.OBSTACLE_TAG);
        this.space.removeCollisionHandler(MW.FLAPPY_BIRD_TAG, MW.WALL_TAG);
        this._super();
    },
    update: function (delta) {
        this.space.step(delta);
    },
    onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        target.doForceBox();
        return true;
    },

    onTouchEnded: function (touch, event) {
    },
    doForceBox: function () {
        if (this.flappyBird) {
            var speed = 500;
            this.flappyBird.getBody().applyImpulse(cp.v(0, speed), cp.v(0, 0));
        }
    },
    resetObstacle: function (dt) {
        cc.log("pool len:" + this.obstaclePool.length);
        var index = this.index;
        cc.log("index" + index);
        var obstacle1 = this.obstaclePool[index * 2];
        var obstacle2 = this.obstaclePool[index * 2 + 1];
        this.index = (index + 1) % 3;

        var random = Math.random();
        var obstacle2Pos = cc.p(0, 0);
        var obstacle1Pos = cc.p(0, 0);
        obstacle2Pos.y = obstacle2.height * (0.55 * random - 0.25);
        obstacle1Pos.y = obstacle2Pos.y + obstacle2.height + 150;
        var x = this.winSize.width + obstacle1.width;
        obstacle1Pos.x = x;
        obstacle2Pos.x = x;
        obstacle1.setPosition(obstacle1Pos);
        obstacle2.setPosition(obstacle2Pos);
        obstacle1.move();
        obstacle2.move();
    },
    gameOver: function () {
        cc.log("gameover");
        MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_OVER;
        for (var i = 0; i < this.obstaclePool.length; i++) {
            var o = this.obstaclePool[i];
            o.setVisible(false);
            o.stopAllActions();
        }
        this.unschedule(this.resetObstacle);
        this.flappyBird.setVisible(false);
        this.m_btnStart.setVisible(true);
        this.m_sprGameOver.setVisible(true);
    },
    collisionBegin: function (arbiter, space) {

//		var shapes = arbiter.getShapes();
//
//		var shapeA = shapes[0];
//		var shapeB = shapes[1];
//
//		var collTypeA = shapeA.collision_type;
//		var collTypeB = shapeB.collision_type;
//
//		if(collTypeB == 3){
//			console.log( 'Collision Type A:' + collTypeA );
//			console.log( 'end Collision Type B:' + collTypeB );
//
//			this.boxDirectionX = -this.boxDirectionX;
//
//			this.space.addPostStepCallback(function () {
//				this.updateBoxAndBlocks();
//			}.bind(this));
//		}else if(collTypeB == 2 || collTypeB == 4)
//		{//碰到上下墙壁 或者 左右出来的BLOCKS 就Gameover
//			this.gameOver();
//		}

        if (MW.CUR_GAME_STATUS === MW.GAME_STATUS.GAME_IN) {
            cc.log("collisionBegin");
            this.gameOver();
        }
        return true;

    },

    collisionPre: function (arbiter, space) {
        //console.log('collision pre');
        return true;
    },

    collisionPost: function (arbiter, space) {
        //console.log('collision post');
    },

    collisionSeparate: function (arbiter, space) {
        //console.log('collision separate');
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameView();
        this.addChild(layer);
    }
});

