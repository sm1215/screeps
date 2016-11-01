/*
* module to provide tower logic
 */
var towerMonitor = {
    run:function(){
        
        
        var tower = Game.getObjectById('37484156ae2ccdac19a85c93');
        
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
}
module.exports = setEnergyDeposit;