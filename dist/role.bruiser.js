var roleBruiser = { 
    run: function(creep){
        
        //Look for threats in map
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        
        //Attack if any are found
        if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        } else {
            
            //Patrol if no hostiles are found
            var currentPatrol = 0;
            if(creep.memory.patrolTarget){
                currentPatrol = creep.memory.patrolTarget;
            }
            var patrolTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTROLLER ||
                            structure.structureType == STRUCTURE_CONTAINER
                    );
                }
            });
                       
            for(var i = currentPatrol; i < patrolTargets.length; i++){
                creep.moveTo(patrolTargets[i]);
                creep.memory.patrolTarget = i;
            }
        }        
    }
};
module.exports = roleBruiser;