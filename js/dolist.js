/**
 * Ctrl C Z实现
 */

var DoList = {
    isInit:false,
    doList:[],      //已输入字符串
    undoList:[],    //后退字符串
    init:function(){
        if(this.isInit == true) return 

        var self = this

        this.isInit = true
    },

    pushDoList:function(content , labelPos){        
        if(labelPos === false || labelPos<0){
            return 
        }

        var lastContent = ""
        if(this.doList.length>0){
            lastContent = this.doList[this.doList.length-1]["content"]
        }

        if(lastContent == content){
            return 
        }

        this.doList.push({
            content,
            labelPos
        })

    },

    pushUndoList:function(content , labelPos){        
        if(labelPos === false || labelPos<0){
            return 
        }

        var lastContent = ""
        if(this.undoList.length>0){
            lastContent = this.undoList[this.undoList.length-1]["content"]
        }

        if(lastContent == content){
            return 
        }

        this.undoList.push({
            content,
            labelPos
        })
    },

    popDoList:function(){
        var emptyItem =  {
            content:"",
            labelPos:0,
        }
        if(this.doList.length<=0){
            return emptyItem
        }

        var lastItem = this.doList.pop()
        this.pushUndoList(lastItem["content"] , lastItem["labelPos"])

        if(this.doList.length<=0){
            return emptyItem
        }

        return this.doList[this.doList.length-1]
    },

    popUndoList:function(){       
        if(this.undoList.length<=0){
            return false
        }

        var lastItem = this.undoList.pop()
        return lastItem    
    },

    clearUnDolist:function(){
        this.undoList = []
    },

}