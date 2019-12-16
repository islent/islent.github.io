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

var ballA = Bodies.circle(Width / 8 - 10, Height * 3 / 16, 30, 10);

var ground = Bodies.rectangle(Width / 4, Height / 2, Width / 1.8, Height / 16, { isStatic: true });
Matter.Body.rotate(ground, Math.PI * 5 / 24);

World.add(engine.world, [ballA, ground]);


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

// 按钮
var addCircle = function () {
    return Bodies.circle(Math.random() * Width / 4 + Width / 16, 30, Width / 40);
};

$('.add-circle').on('click', function () {
    World.add(engine.world, addCircle());
});

var addTriangle = function () {
    return Bodies.polygon(Math.random() * Width / 4 + Width / 16, 30, 3, Width / 40);
};

$('.add-triangle').on('click', function () {
    World.add(engine.world, addTriangle());
})

var addSquare = function () {
    return Bodies.rectangle(Math.random() * Width / 4 + Width / 16, 30, Width / 20, Width / 20);
};

$('.add-square').on('click', function () {
    World.add(engine.world, addSquare());
})

var addFive = function () {
    return Bodies.polygon(Math.random() * Width / 4 + Width / 16, 30, 5, Width / 40);
};

$('.add-five').on('click', function () {
    World.add(engine.world, addFive());
})

var addSix = function () {
    return Bodies.polygon(Math.random() * Width / 4 + Width / 16, 30, 6, Width / 40);
};

$('.add-six').on('click', function () {
    World.add(engine.world, addSix());
})


Engine.run(engine);
Render.run(render);
