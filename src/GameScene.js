
var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;

var GameView = cc.Layer.extend({
    space: null,
    gameStatus: null,
    winSize: null,

    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();
        this.gameStatus = MW.GAME_STATUS.GAME_START;
        // 设置单点触摸
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        }, this);
        this.space = new cp.Space();

        this.winSize = cc.winSize;


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

        this.initPhysics();
    },

    onEnter: function () {
        this._super();
        this.scheduleUpdate();
    },

    onExit: function () {
        this.unscheduleUpdate();
        this._super();
    },

    update: function (delta) {
        this.space.step(delta / 10);
    },

    startGame: function () {
        this.m_btnStart.visible = false;
        this.m_sprLogo.visible = false;
        this.m_sprGameOver.visible = false;

        this.gameStatus = MW.GAME_STATUS.GAME_IN;
    },


    initPhysics: function () {
        var space = this.space;
        var staticBody = space.staticBody;
        var winSize = this.winSize;


        /*
        //var shape = new cp.SegmentShape(staticBody, cp.v(winSize.width / 2 - 50, 0), cp.v(winSize.width / 2 + 50, 0), 1);
        var shape = new cp.SegmentShape(staticBody, cp.v(50, 0), cp.v(winSize.width - 50, 0), 1);
        shape.setElasticity(1);
        shape.setFriction(0);
        shape.setCollisionType(MW.WALL_TAG);
        space.addStaticShape(shape);
        //shape.setLayers(GRABABLE_MASK_BIT);
        */
        // Walls
        var walls = [new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(winSize.width, 0), 0),				// bottom
            new cp.SegmentShape(staticBody, cp.v(0, winSize.height), cp.v(winSize.width, winSize.height), 0),	// top
            new cp.SegmentShape(staticBody, cp.v(0, 0), cp.v(0, winSize.height), 0),				// left
            new cp.SegmentShape(staticBody, cp.v(winSize.width, 0), cp.v(winSize.width, winSize.height), 0)	// right
        ];



        for (var i = 0; i < walls.length; i++) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            shape.setCollisionType(MW.WALL_TAG);
            space.addStaticShape(shape);
        }

        /*
        var shape = new cp.BoxShape(staticBody, winSize.width - 100, 10);
        shape.setElasticity(0);
        shape.setFriction(1);
        shape.setCollisionType(MW.WALL_TAG);
        space.addStaticShape(shape);
        */
        // Gravity
        space.gravity = cp.v(0, -9800);
        space.sleepTimeThreshold = 0.5;
        space.collisionSlop = 0.5;
        this.initDebugMode();
    },

    initDebugMode: function () {
        this._debugNode = cc.PhysicsDebugNode.create(this.space);
        this.addChild(this._debugNode);
    },

    createGameSprite: function (position) {
        var shapeSprite = ShapeMan.getInstance().getRandomShape();
        this.addChild(shapeSprite, 1);
        shapeSprite.setPosition(position);
        shapeSprite.addToSpaces(this.space);
    },

    onTouchBegan: function (touch, event) {
        if (this.gameStatus == MW.GAME_STATUS.GAME_IN) {
            var nodePosition = this.convertToNodeSpace(touch.getLocation());
            this.createGameSprite(nodePosition);
        }
        return true;
    },

    onTouchEnded: function (touch, event) {
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameView();
        this.addChild(layer);
    }
});

