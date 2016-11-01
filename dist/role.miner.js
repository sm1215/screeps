var roleMiner = {

    run: function(creep) {
        
        if(creep.carry.energy < creep.carryCapacity) {
            var sourceTarget = creep.pos.findClosestByRange(FIND_SOURCES);
            
            if(creep.harvest(sourceTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceTarget);
            }
        }
        else {

            var depositTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_STORAGE ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity);
                }
            });
            
            if(creep.transfer(depositTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(depositTarget);
            }
        }
    }
};

module.exports = roleMiner;