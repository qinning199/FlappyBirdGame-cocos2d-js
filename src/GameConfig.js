
var MW = MW || {};

MW.FLAPPY_BIRD_TAG = 101;
MW.OBSTACLE_TAG = 102;


//声音标志位
MW.SOUND = true;
//分数
MW.SCORE = 0;

//游戏状态
MW.GAME_STATUS = {
    GAME_START : 0,
    GAME_IN : 1,
    GAME_OVER: 2
};

//游戏当前状态
MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_START;

MW.BLOCK_SPACES = 40;           //BLOCK间隔距离
MW.TOP_BLOCK_CNT = 9;           //上下边界BLOCK的数量

MW.BLOCK_UP_TAG = 10;           //上方BLOCK的TAG
MW.BLOCK_DOWN_TAG = 30;         //下方BLOCK的TAG
MW.BLOCK_LEFT_TAG = 50;         //左方BLOCK的TAG
MW.BLOCK_RIGHT_TAG = 70;        //右方BLOCK的TAG

MW.TOUCH_FLAG = true;           //是否可点击

MW.LEVEL_UP_EVERY = 1;          //等级加分

MW.BLOCK_WIDTH = 112;           //BLOCK的宽
MW.BLOCK_HEIGHT = 60;           //BLOCK的高
