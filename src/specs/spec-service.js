const xss = require('xss')

const SpecsService = {
    SpecsCalculate(roast_level, method, output){
        let grindNum = roast_level;
        let newBrew = {
            grind: '',
            input: ''
        }
        if(method == 'automatic' || 'french-press'){
            grindNum += 1;
        } else if(method == 'kalita' || 'v60'){
            grindNum += 0;
        } else if(method == 'aeropress'){
            grindNum -= 1
        }
        if(grindNum <= 1){
            newBrew.grind = 'fine'
        } else if(grindNum == 2){
            newBrew.grind = 'medium/fine'
        } else if(grindNum == 3){
            newBrew.grind = 'medium'
        } else if(grindNum == 4){
            newBrew.grind = 'medium/coarse'
        } else if(grindNum >= 5){
            newBrew.grind = 'coarse'
        }
        if(method == 'kalita' || 'v60'){
            newBrew.output = toString(parseInt(output)/17)
        } else if(method == 'automatic' || 'french-press'){
            newBrew.output = toString(parseInt(output)/16)
        }else if(method == 'aeropress'){
            newBrew.output = toString(parseInt(output)/15)
        }
        return newBrew;
    }
}

module.exports = SpecsService;