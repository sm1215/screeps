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
            
            //Start patrol loop over if we're at end
            if(currentPatrol == patrolTargets.length ||
                currentPatrol > patrolTargets.length){
                    currentPatrol = 0;
                }
            for(var i = currentPatrol; i < patrolTargets.length; i++){
                
                //Check if we're at destination yet
                console.log('tar pos: ', patrolTargets[i].pos);
                if(creep.pos.isNearTo(patrolTargets[i].pos)){
                    i++;
                }
                console.log(patrolTargets[i]);
                creep.moveTo(patrolTargets[i]);
                creep.memory.patrolTarget = i;
            }
        }        
    }
};
module.exports = roleBruiser;