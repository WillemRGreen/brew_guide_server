const xss = require('xss')

const SpecsService = {
    SpecsCalculate(roast_level, method){
        let grindNum = roast_level;
        let grind = '';
        if(method == 'automatic' || 'french-press'){
            grindNum += 1;
        } else if(method == 'kalita' || 'v60'){
            grindNum += 0;
        } else if(method == 'aeropress'){
            grindNum -= 1
        }
        if(grindNum <= 1){
            grind = 'fine'
        } else if(grindNum == 2){
            grind = 'medium/fine'
        } else if(grindNum == 3){
            grind = 'medium'
        } else if(grindNum == 4){
            grind = 'medium/coarse'
        } else if(grindNum >= 5){
            grind = 'coarse'
        }
        return grind;
    }
}

module.exports = SpecsService;