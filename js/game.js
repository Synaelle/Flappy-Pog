kaboom({
    background: [ 85, 136, 230, ],
    width: 640,
    height: 480,
    font: "sinko",
    debug: false,
});
loadSprite("poggers", "img/pog.png");
loadSprite("pipe", "img/pipe.png");
loadSprite("menu", "img/intro.png")
loadSprite("bg", "img/bg.png")
loadSprite("start", "img/start.png")
loadSound("jump", "sounds/jump.wav");
loadSound("gameover", "sounds/gameover.wav")
loadSound("point", "sounds/point.wav")
loadSound("bgm", "sounds/music.mp3")

let highScore = 0;
let hardcore = 0;
let music = 0;


scene("intro", () => {

    //We do a little bit of trolling :D
    let playY = rand(-100, 50);
    
    add([
        sprite("bg"),
    ])

    if(rand(0, 1000) === 727){
        add([
            sprite("menu", {flipY: true}),
        ])

        playY = -250
    }
    else{
        add([
            sprite("menu"),
        ])
    }

    add([
        sprite("start"),
        pos(0, playY),
        "start",
    ])

    onMousePress(() =>{
        go("game")
    })
})

scene("game", () => {

    
    add([
            sprite("bg"),
        ])

    hardcore = 0;
    let score = 0;
    let pipespeed = -180;
    let gap1 = 175;
    let gap2 = 210;
    let pipescale = 2;

    onKeyPress("m", () =>{  
        if (music === 0) {
            play("bgm", {volume: 0.3, loop: true})
        }
        music = 1
    })

    onKeyPress("h", () =>{
        hardcore = 1;
        pipespeed = -1000
        gap1 = 110;
        gap2 = 180;
        pipescale = 5;
    })

    onKeyPress("r", () =>{
        go("game");
    })

    const scoreText =  add([
        text(score, {size: 60, width: 320})
    ])

    const player = add([
        sprite("poggers"),
        scale(0.5),
        pos(80, 80),
        area(),
        body(),
    ]);

    function genPipes(){

        const PIPE_GAP = rand(gap1, gap2);
        const offset = rand(-110, 110)

        add([
            sprite("pipe"),
            scale(pipescale),
            pos(width(), height()/2 + offset + PIPE_GAP/2),
            "pipe",
            area(),
            {'passed': false},
        ]);
    
        add([
            sprite("pipe", {flipY: true}),
            scale(pipescale),
            pos(width(), height()/2 + offset - PIPE_GAP/2),
            origin("botleft"),
            "pipe",
            area(),
        ]);
    }

    loop(1.25, () => {
        genPipes();
    })


    action("pipe", (pipe) => {
        pipe.move(pipespeed, 0)

        if (pipe.passed === false && pipe.pos.x < player.pos.x) {
            pipe.passed = true;
            score += 1;
            scoreText.text = score;
            play("point", {volume: 0.4});
        }
    });

    player.collides("pipe", () =>{
        go("gameover", score);
    });

    player.action(() => {
        if (player.pos.y > height() || player.pos.y < -20) {
            go("gameover", score);
        }
    })

    onMousePress(() =>{
        player.jump(500);
        play("jump", {volume: 0.6});
    });
});

scene("gameover", (score) => {

    add([
        sprite("bg"),
    ])

    play("gameover");

    if (score > highScore) {
        highScore = score;
        
    }

    add([
        text("You failed!\n" + "Score: " + score + "\nHighscore: " + highScore + "\nHardcore mode: " + hardcore, {size: 40})
    ]);

    onMousePress(() =>{
        go("game");
    });
});

go("intro");