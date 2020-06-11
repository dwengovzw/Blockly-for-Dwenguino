import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"

export default class DwenguinoSimulationScenarioSpyrograph extends DwenguinoSimulationScenario{
    engine = null;
    world = null;
    bodies = null;

    canvas = null;
    context = null;
    
    constructor(logger){
        super(logger);
        this.initSimulationState();
    }

    initSimulationState(){
        super.initSimulationState();

        // Create engine
        this.engine = Matter.Engine.create();
        // Create world
        this.world = Matter.World;
        // Create bodies object
        this.bodies = Matter.Bodies;
        this.body = Matter.Body;
        // Create the composites object
        this.composites = Matter.Composites;
        this.composite = Matter.Composite;
        this.constraint = Matter.Constraint;
        this.mouseConstraint = Matter.MouseConstraint;
        this.mouse = Matter.Mouse;


        // Test
        let group = this.body.nextGroup(true),
            length = 200,
            width = 25;
        
        let pendulum = this.composites.stack(300, 0, 2, 1, 0, 0, (x, y) => {
            return this.bodies.rectangle(x, y, length, width, { 
                collisionFilter: { group: group },
                frictionAir: 0,
                chamfer: 5,
                render: {
                    fillStyle: 'transparent',
                    lineWidth: 1
                }
            });
        });

        pendulum.bodies[0].render.strokeStyle = '#4a485b';
        pendulum.bodies[1].render.strokeStyle = '#4a485b';

        this.engine.world.gravity.scale = 0.002;

        this.composites.chain(pendulum, 0.45, 0, -0.45, 0, { 
            stiffness: 0.9, 
            length: 0,
            angularStiffness: 0.7,
            render: {
                strokeStyle: '#4a485b'
            }
        });

        Matter.Composite.add(pendulum, this.constraint.create({ 
            bodyB: pendulum.bodies[0],
            pointB: { x: -length * 0.42, y: 0 },
            pointA: { x: pendulum.bodies[0].position.x - length * 0.42, y: pendulum.bodies[0].position.y },
            stiffness: 0.9,
            length: 0,
            render: {
                strokeStyle: '#4a485b'
            }
        }));


        let lowerArm = pendulum.bodies[1];

        this.body.rotate(lowerArm, -Math.PI * 0.3, {
            x: lowerArm.position.x - 100,
            y: lowerArm.position.y
        });
        
        this.world.add(this.engine.world, pendulum);


        // create two boxes and a ground
        /*var boxA = this.bodies.rectangle(400, 200, 80, 80);
        var boxB = this.bodies.rectangle(450, 50, 80, 80);
        var ground = this.bodies.rectangle(400, 610, 810, 60, { isStatic: true });*/

        // add all of the bodies to the world
        //this.world.add(this.engine.world, [boxA, boxB, ground]);


    }

    initSimulationDisplay(containerId){
        super.initSimulationDisplay(containerId);

        let container = $(`#${containerId}`);

        this.canvas = $("<canvas>").attr("id", "spyrograph_canvas")[0];
        this.context = this.canvas.getContext("2d");
        this.canvas.width = container.width();
        this.canvas.height = container.height();

        container.append(this.canvas);

    }

    render(){
        var bodies = Matter.Composite.allBodies(this.engine.world);
    
        this.context.fillStyle = '#fff';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.context.beginPath();
    
        for (var i = 0; i < bodies.length; i += 1) {
            var vertices = bodies[i].vertices;
    
            this.context.moveTo(vertices[0].x, vertices[0].y);
    
            for (var j = 1; j < vertices.length; j += 1) {
                this.context.lineTo(vertices[j].x, vertices[j].y);
            }
    
            this.context.lineTo(vertices[0].x, vertices[0].y);
        }
    
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#999';
        this.context.stroke();
    }

    updateScenario(boardState){
        super.updateScenario(boardState)
        this.updateScenarioState(boardState);
        this.updateScenarioDisplay(boardState);
    }

    updateScenarioState(boardState){
        super.updateScenarioState(boardState);
        Matter.Engine.update(this.engine, 1000 / 60);
    }

    updateScenarioDisplay(boardState){
        super.updateScenarioDisplay(boardState);
        // Next time the screen gets repainted the render function 
        // will be called before the screen is repainted
        window.requestAnimationFrame(() => { this.render() });
    }

}