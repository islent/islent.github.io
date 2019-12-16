var Engine = Matter.Engine,
    Events = Matter.Events,
    Vector = Matter.Vector
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
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

engine.world.gravity.y = 0;

var EarthRotSpeed = Math.PI / 1000 * 13,
    Earth = Bodies.circle(Width / 2 - Width / 4, Height / 2, Width / 100 * 1.053, 10); 


var VenusRotSpeed = Math.PI / 1000 * 8,
    Venus = Bodies.circle(Width / 2 - Width / 4 * 0.725, Height / 2, Width / 100, 10); 

World.add(engine.world, [Earth, Venus]);

// 尾迹
var trail = [];

Events.on(render, 'afterRender', function () {
    trail.unshift({
        //position: Vector.clone(ballA.position),
        position: {x: (Earth.position.x + Venus.position.x) / 2, y: (Earth.position.y + Venus.position.y) / 2}
    });

    Render.startViewTransform(render);
    render.context.globalAlpha = 0.7;

    for (var i = 0; i < trail.length; i += 1) {
        var point = trail[i].position;

        var hue = 250 + Math.round((1 - Math.min(1, 50 / 10)) * 170);
        render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
        render.context.fillRect(point.x, point.y, 2, 2);
    }

    render.context.globalAlpha = 1;
    Render.endViewTransform(render);

    if (trail.length > 5000) {
        trail.pop();
    }
});

Engine.run(engine);
Render.run(render);

function updateRotation() {
    Body.rotate(Earth, EarthRotSpeed, {x: Width / 2, y: Height / 2});
    Body.rotate(Venus, VenusRotSpeed, {x: Width / 2, y: Height / 2});
    requestAnimationFrame(updateRotation);
}
window.requestAnimationFrame(updateRotation);



