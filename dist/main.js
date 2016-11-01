var creepWorker = require('creep.worker');
var creepFighter = require('creep.fighter');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleBruiser = require('role.bruiser');
var roleMiner = require('role.miner');
var energyMonitor = require('mon.energy');

module.exports.loop = function () {
    
    //Config
    var roleDefinitions = {
        harvesters: {
            name: 'harvester',
            priority: 10,
            limit: 0,
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
        bruisers: {
            name: 'bruiser',
            priority: 40,
            limit: 2,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'bruiser'),
            logic: roleBruiser,
            body: creepFighter
        },
        miners: {
            name: 'miner',
            priority: 13,
            limit: 2,
            creeps: _.filter(Game.creeps, (creep) => creep.memory.role == 'miner'),
            logic: roleMiner,
            body: creepWorker
        }
    },
    sortedRD = _.sortBy(roleDefinitions, (role) => { return role.priority; });
    
    //Keep memory cleaned
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            // console.log(Memory.creeps[name].role + ' | LEVEL ' + Memory.creeps[name].level + ' HAS DIED ' + name);
            delete Memory.creeps[name];
        }
    }
    
    //Check population
    //Proceed through prioritized roleDefinitions
    
    //Notes: This loop might be more efficient if we separated the level assigned logic from the role spawning logic.
    if(!Memory.spawning){
        for (var i = 0; i < sortedRD.length; i++) {
            var role = sortedRD[i];
    
            //Create new worker if needed, try to create a stronger unit first
            if(!Memory.spawning && (!role.creeps || (role.creeps.length < role.limit))){
                //Try to spawn the highest level possible first,
                //Work down if there aren't enough resources for it
                for(var j = role.body.length - 1; j >= 0; j--){
                    var level = role.body[j];
                    
                    // console.log(role.name + ' | LEVEL ' + j + ' TRYING SPAWN');
                    if(!Memory.spawning && (Game.spawns['Spawn1'].canCreateCreep(level, undefined) == OK)){
                        //Track spawning, spawning can bug out if not
                        Memory.spawning = true;
                        var result = Game.spawns['Spawn1'].createCreep(level, undefined, { role: role.name, level: j });
                        console.log(role.name + ' | LEVEL ' + j + ' SPAWNED ' + result);
                        
                        //Manually assign j a value to break the for loop since we found our match.
                        j = -1;
                    }
                }
            }
        }
    }
    //Update memory that spawning is allowed again
    if(Memory.spawning && Game.spawns['Spawn1'].canCreateCreep([WORK,CARRY,MOVE], undefined) == OK){
        Memory.spawning = false;
    }
    
    //Run creep tasks
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'),
        upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'),
        builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'),
        bruisers = _.filter(Game.creeps, (creep) => creep.memory.role == 'bruiser'),
        miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');

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
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
    }
    
    //Assign energy deposit target, affects all havesters
    energyMonitor.run(); 
    
    //Log population
    var harvestersPop = harvesters.length,
        upgradersPop = upgraders.length,
        buildersPop = builders.length,
        bruisersPop = bruisers.length,
        minersPop = miners.length,
        totalPop = harvestersPop + upgradersPop + buildersPop + bruisersPop + minersPop,
        oldTotalPop = 0;
    
    if(Memory.totalPop){
        oldTotalPop = Memory.totalPop;
    }
    Memory.totalPop = totalPop;
    
    if(totalPop != oldTotalPop){
        var pop = '[Total Population]: ' + totalPop + ' [Harvesters]: ' + harvestersPop + ' [Upgraders]: ' + upgradersPop + ' [Builders]: ' + buildersPop + ' [Bruisers]: ' + bruisersPop + ' [Miners]: ' + minersPop;
        console.log(pop);
    }
}
