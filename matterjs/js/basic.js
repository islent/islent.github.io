var Engine = Matter.Engine,
    Events = Matter.Events,
    Vector = Matter.Vector
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint;

var engine = Engine.create();
var world = Engine.world;

var fac = 0.8;
var Width = $(window).width() * fac;
var Height = $(window).height() * fac;

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: Width,
        height: Height,
        pixelRatio: 1,
        background: "#fafafa",
        wireframeBackground: "#222",
        hasBounds: false,
        enabled: true,
        wireframes: false,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: true,
        showCollisions: false,
        showSeparations: false,
        showAxes: true,
        showPositions: false,
        showAngleIndicator: false,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false
    }
});

var boxA = Bodies.rectangle(Width / 2, 200, 80, 80);
var ballA = Bodies.circle(Width / 2 + 50, 100, 40, 10);
var ballB = Bodies.circle(Width / 2 - 50, 10, 40, 10);
var ground = Bodies.rectangle(Width / 2, Height / 2 + 100, Width / 1.5, 60, { isStatic: true });

World.add(engine.world, [boxA, ballA, ballB, ground]);


// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.01,
            render: {
                visible: false
            }
        }
    });

World.add(engine.world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;


// 跷跷板
var rectA = Bodies.rectangle(Width / 4, Height / 1.9, 40, 100, {
    isStatic: true, //静止
    render: {
        fillStyle: "#f00"  //设为红色
    },
    collisionFilter: {
        group: -1
    }
});
var rectB = Bodies.rectangle(Width / 4, Height / 1.9, 400, 40, {
    render: {
        fillStyle: "#00f"  //设为蓝色
    },
    collisionFilter: {
        group: -1
    }
});

var rotateConstraint = Constraint.create({
    bodyA: rectA,
    pointA: { x: 0, y: -40 },
    bodyB: rectB,
    length: 0,
    stiffness: 0.9
});

World.add(engine.world, [rectA, rectB, rotateConstraint]);


// 桥梁

var chains = Composites.stack(Width / 1.95, Height / 2.4, Math.floor(Width / 4 / 50 / 1.3), 1, 9, 0, function (x, y) {
    return Bodies.rectangle(x, y, 50, 30, {
        chamfer: 15
    })
});

// 桥墩
var wallA = Bodies.rectangle(Width / 2, Height / 2, 20, 200, { isStatic: true });
var wallB = Bodies.rectangle(Width / 2 + Width / 4, Height / 2, 20, 200, { isStatic: true });

//三条链接铁索
Composites.chain(chains, 0.4, 0, -0.4, 0, {});
Composites.chain(chains, 0.4, 0.3, -0.4, 0.3, {});
Composites.chain(chains, 0.4, -0.3, -0.4, -0.3, {});

//左侧固定在桥墩上
var fixLeft = Constraint.create({
    bodyA: wallA,
    pointA: { x: 0, y: -90 },
    bodyB: chains.bodies[0],
    pointB: { x: -25, y: 0 }
});

//右侧固定在桥墩上
var fixRight = Constraint.create({
    bodyA: chains.bodies[chains.bodies.length - 1],
    pointA: { x: 25, y: 0 },
    bodyB: wallB,
    pointB: { x: 0, y: -90 }
});

World.add(engine.world, [wallA, wallB, chains, fixLeft, fixRight]);


// 布料
var cloth = Composites.softBody(Width * 3 / 4, 100, 6, 10, 2, 2, false, 15, {
    render: {
        visible: true,
        strokeStyle: 'red',
        fillStyle: 'blue',
    },
    collisionFilter: {
        group: -1
    }
}, {});

// 顶部固定
for (var i = 0; i < 6; i++) {
    cloth.bodies[i].isStatic = true;
}

World.add(engine.world, [cloth]);


// 尾迹
var trail = [];

Events.on(render, 'afterRender', function () {
    trail.unshift({
        position: Vector.clone(ballA.position),
        speed: ballA.speed
    });

    Render.startViewTransform(render);
    render.context.globalAlpha = 0.7;

    for (var i = 0; i < trail.length; i += 1) {
        var point = trail[i].position,
            speed = trail[i].speed;

        var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
        render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
        render.context.fillRect(point.x, point.y, 2, 2);
    }

    render.context.globalAlpha = 1;
    Render.endViewTransform(render);

    if (trail.length > 2000) {
        trail.pop();
    }
});

// 按钮
var addCircle = function () {
    return Bodies.circle(Math.random() * Width / 2 + Width / 4, 30, 30);
};

$('.add-circle').on('click', function () {
    World.add(engine.world, addCircle());
});


var addSquare = function () {
    return Bodies.rectangle(Math.random() * Width / 2 + Width / 4, 30, 60, 60);
};

$('.add-square').on('click', function () {
    World.add(engine.world, addSquare());
})


$('.rotate').on('click', function () {
    Matter.Composite.rotate(engine.world, Math.PI / 6, { x: Width / 2, y: Height / 2 });
});


$('.slow-mo').on('click', function () {
    engine.timing.timeScale = 0.5;
});

$('.norm-mo').on('click', function () {
    engine.timing.timeScale = 1;
});

$('.fast-mo').on('click', function () {
    engine.timing.timeScale = 1.5;
});


$('.red-friction').on('click', function () {
    circleA.friction = 0.05;
    circleA.frictionAir = 0.0005;
    circleA.restitution = 0.9;
});

$('.res-friction').on('click', function () {
    circleA.friction = 0.1;
    circleA.frictionAir = 0.001;
    circleA.restitution = 0;
});



Engine.run(engine);
Render.run(render);
