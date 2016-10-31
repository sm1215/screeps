var creepWorker = require('creep.worker');
var creepFighter = require('creep.fighter');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleBruiser = require('role.bruiser');
var energyMonitor = require('mon.energy');

module.exports.loop = function () {
    
    //Config
    var roleDefinitions = {
        harvesters: {
            name: 'harvester',
            priority: 10,
            limit: 3,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'),
            logic: roleHarvester,
            body: creepWorker
        },
        upgraders: {
            name: 'upgrader',
            priority: 20,
            limit: 4,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'),
            logic: roleUpgrader,
            body: creepWorker
        },
        builders: {
            name: 'builder',
            priority: 30,
            limit: 2,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'),
            logic: roleBuilder,
            body: creepWorker
        },
        bruiser: {
            name: 'bruiser',
            priority: 40,
            limit: 4,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'bruiser'),
            logic: roleBruiser,
            body: creepFighter
        }
    },
    sortedRD = _.sortBy(roleDefinitions, (role) => { return role.priority; });
    
    //Keep memory cleaned
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Check population
    //Proceed through prioritized roleDefinitions
    for (var i = 0; i < sortedRD.length; i++) {
        var role = sortedRD[i];

        //Create new worker if needed, try to create a stronger unit first
        if(!Memory.spawning && (!role.creeps || (role.creeps.length < role.limit))){
            
            //Track spawning, game bugs and can overwrite a spawn if not
            Memory.spawning = true;

            //Try to spawn the highest level possible first,
            //Work down if there aren't enough resources for it
            for(var j = 0; j < role.body.length; j++){
                var level = role.body[j];
                if(Game.spawns['Spawn1'].canCreateCreep(level, undefined) == OK){
                    Game.spawns['Spawn1'].createCreep(level, undefined, { role: role.name, level: j });
                    console.log(role.name + ' | SPAWN OK');
                }
            }
        }
        
        //Update memory that spawning is allowed again
        if(Memory.spawning && Game.spawns['Spawn1'].canCreateCreep([WORK,CARRY,MOVE], undefined)){
            Memory.spawning = false;
        }
    }
    
    //Run creep tasks
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'),
        upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'),
        builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'),
        bruisers = _.filter(Game.creeps, (creep) => creep.memory.role == 'bruiser');

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'bruiser') {
            roleBruiser.run(creep);
        }
    }
    
    //Assign energy deposit target, affects all havesters
    energyMonitor.run(); 
    
    //Log population
    var pop = '[Harvesters]: ' + harvesters.length + ' [Upgraders]: ' + upgraders.length + ' [Builders]: ' + builders.length + ' [Bruisers]: ' + bruisers.length;
    
    console.log(pop);
}
