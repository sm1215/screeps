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
            
            //Move on to next target if we've arrived
            if(creep.pos.isNearTo(patrolTargets[currentPatrol].pos)){
                currentPatrol++;
                
                //Start patrol over if we're at end
                if(currentPatrol > patrolTargets.length){
                    currentPatrol = 0;
                }
                
            }   
            
            creep.moveTo(patrolTargets[currentPatrol]);
            creep.memory.patrolTarget = currentPatrol;
            
        }        
    }
};
module.exports = roleBruiser;