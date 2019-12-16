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

var newton = Composites.newtonsCradle(Width / 2, Height / 4, 2, 50, Height / 3);


World.add(engine.world, [newton]);


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


// 尾迹
var trail = [];

Events.on(render, 'afterRender', function () {
    trail.unshift({
        position: Vector.clone(newton.bodies[0].position),
        speed: newton.bodies[0].speed
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


$('.kick-super-fast').on('click', function () {
    Matter.Body.applyForce(newton.bodies[0], {x: newton.bodies[0].position.x, y: newton.bodies[0].position.y}, {x: -0.8, y: 0})
});

$('.kick-fast').on('click', function () {
    Matter.Body.applyForce(newton.bodies[0], {x: newton.bodies[0].position.x, y: newton.bodies[0].position.y}, {x: -0.4, y: 0})
});

$('.kick-middle').on('click', function () {
    Matter.Body.applyForce(newton.bodies[0], {x: newton.bodies[0].position.x, y: newton.bodies[0].position.y}, {x: -0.2, y: 0})
});

$('.kick-slow').on('click', function () {
    Matter.Body.applyForce(newton.bodies[0], {x: newton.bodies[0].position.x, y: newton.bodies[0].position.y}, {x: -0.1, y: 0})
});



Engine.run(engine);
Render.run(render);
