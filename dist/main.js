var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var energyMonitor = require('mon.energy');

module.exports.loop = function () {
    
    //Config
    var roleDefinitions = {
        harvesters: {
            limit: 4,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'),
            create: function() { return Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'}); },
            logic: roleHarvester
        },
        upgraders: {
            limit: 6,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'),
            create: function() { return Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'}); },
            logic: roleUpgrader 
        },
        builders: {
            limit: 0,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'),
            create: function() { return Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'}); },
            logic: roleBuilder
        },
        superHarvester: {
            limit: 3,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'superHarvester'),
            create: function() { return Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'superHarvester'}); },
            logic: roleHarvester
        },
        superUpgraders: {
            limit: 2,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'superUpgrader'),
            create: function() { return Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'superUpgrader'}); },
            logic: roleUpgrader
        }
    },
    roles = Object.keys(roleDefinitions);
    
    //Keep memory cleaned
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Check if anything needs spawned
    for (var i = 0; i < roles.length; i++) {
        if(roleDefinitions[roles[i]].creeps.length < roleDefinitions[roles[i]].limit){
            console.log('creating new creep of role', roles[i]);
            roleDefinitions[roles[i]].create();
        } 
    };
    
    // console.log('RD: ', roleDefinitions[].logic.run());
    // roleDefinitions[].logic.run();

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'),
        upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'),
        builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'),
        superHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'superHarvester'),
        superUpgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'superUpgrader');

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
        if(creep.memory.role == 'superHarvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'superUpgrader') {
            roleUpgrader.run(creep);
        }
    }
    
    energyMonitor.run();
    var pop = '[Harvesters]: ' + harvesters.length + ' [Upgraders]: ' + upgraders.length + ' [Builders]: ' + builders.length;
    
    if(superHarvesters){
        pop += ' [SuperHarvester]: ' + superHarvesters.length;
    }
    if(superUpgraders){
        pop += ' [SuperUpgrader]: ' + superUpgraders.length;
    }
    console.log(pop);
}
