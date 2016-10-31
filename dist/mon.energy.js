/*
* module to keep track of energy stores and their current levels
 */
var setEnergyDeposit = {
    run:function(){
        var deposits = _.filter(Game.structures, (structure) => {
            return ((structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType ==  STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity);
        });
        if(deposits.length > 0){
            Memory.energyDeposit = deposits[0].id;
        }
    }
}
module.exports = setEnergyDeposit;