var Util = {
    arrayToMap:function(list , value){
        var result = {}
        for(var key in list){
            var keyName = list[key]
            if(value !== undefined){
                result[keyName] = value
            }else{
                result[keyName] = keyName
            }
        }
        return result
    }
}