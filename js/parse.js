 Node = function() {
    this.type=""
    this.start=0
    this.end=0
    this.index = 0
    this.text=""
    this.showText=""
}

var Parse = {
    isInit:false,
    text:"",
    curTextIndex:0,
    signList:["~","!","@","#","$","%","^","&","*","_","+","`","-","=",",",";","\"","\'","|","<",",",">",".","?","/",],
    numList:["0","1","2","3","4","5","6","7","8","9"],
    letterList:{},

    bracketMap:{"}":"{" , "]":"[" , ")":"("},
    nodeList:[],
    init:function(){
        if(this.isInit == true){return}
        
        this.signList = Util.arrayToMap(this.signList , true)
        this.numList = Util.arrayToMap(this.numList , true)
        this.initLetterList();

        this.isInit = true
    },

    parse:function(content){
        this.text = content
        this.curTextIndex = 0
        return this.buildText();
    },

    /**
     * 初始化字母
     */
    initLetterList:function(){
        for(var i=65 ; i<=90 ; i++){
            var char = String.fromCharCode(i)
            this.letterList[char] = true
        }

        for(var i=97 ; i<=122 ; i++){
            var char = String.fromCharCode(i)
            this.letterList[char] = true
        }
    },

    getCurChar:function(){
        var char = this.text[this.curTextIndex]
        if(char){
            return char
        }
        return false
    },

    advance:function(){
        this.curTextIndex++;
    },


    isLeftBracket:function(char){
        if(char == "{" || char == "[" || char == "("){
            return true
        }
        return false
    },

    isRightBracekt:function(char){
        if(char == "}" || char == "]" || char == ")"){
            return true
        }
        return false
    },

    isBlank:function(char){
        if(char == " "){
            return true
        }
        return false
    },

    isNewLine:function(char){
        if(char == "\n"){
            return true
        }
        return false
    },

    isSign:function(char){
        if(this.signList[char]){
            return true
        }
        return false
    },

    isNum:function(char){
        if(this.numList[char]){
            return true
        }
        return false
    },

    isLetter:function(char){
        if(this.letterList[char]){
            return true
        }
        return false
    },

    /**
     * 获取下一个节点
     */
    getNextNode:function(){
        if(this.text.length<=this.curTextIndex){
            return false;
        }

        var firstChar = this.getCurChar();
        this.advance();

        var node = new Node();
        if(firstChar == "\\"){
            node.type = "backslash"; 
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar;
            return node;
        }else if(this.isLeftBracket(firstChar)){
            node.type = "leftbracket";
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            return node;
        }else if(this.isRightBracekt(firstChar)){
            node.type = "rightbracket";
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            return node;
        }else if(this.isBlank(firstChar)){
            node.type = "blank";
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            var curChar = this.getCurChar()
            while(curChar !== false){
                if(!this.isBlank(curChar)){
                    break;
                }
                node.text += " "
                node.end = this.curTextIndex
                this.advance()
                curChar = this.getCurChar()
            }
            return node;
        }else if(this.isNewLine(firstChar)){
            node.type = "newline";
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            return node;

        }else if(this.isSign(firstChar)){
            node.type = "sign"
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            return node;
        }else if(this.isNum(firstChar)){
            node.type = "num"
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            var curChar = this.getCurChar()
            while(curChar !== false){
                if(!this.isNum(curChar)){
                    break;
                }
                node.text += curChar
                node.end = this.curTextIndex
                this.advance()
                curChar = this.getCurChar()
            }
            return node;
        }else if(this.isLetter(firstChar)){
            node.type = "token"
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            var curChar = this.getCurChar()
            while(curChar !== false){
                if(!this.isLetter(curChar)){
                    break;
                }
                node.text += curChar
                node.end = this.curTextIndex
                this.advance()
                curChar = this.getCurChar()
            }
            return node;
        }else {
            node.type = "character"
            node.start = this.curTextIndex-1;
            node.end = this.curTextIndex-1;
            node.text = firstChar
            return node;
        }

    },


    getNodeList:function(){
        var list = []
        var node = this.getNextNode()
        while(node !== false){
            node.index = list.length
            list.push(node)
            node = this.getNextNode()
        }
        this.nodeList = list
    },
    
    buildText:function(){
        this.getNodeList()
        this.buildBracket();
        this.buildBackslash();
        this.buildBlock();

        var result = ""
        for(var i=0 ; i<this.nodeList.length ; i++){
            var node = this.nodeList[i];
            var attrClass = ""
            if(node.type == "backslash"){
                if(node.isTokenBackSlash == true){
                    attrClass = "token_blackslash"
                }else if(node.isBackSlash == true){
                    attrClass = "backslash"
                }else{
                    attrClass = "not_backslash"
                }
                node.showText = node.text
            }else if(node.type == "leftbracket" || node.type == "rightbracket"){
                if(node.bracketLayer == -1){
                    attrClass = "not_bracket"
                }else{
                    var layer = node.bracketLayer%3
                    attrClass = "bracket"+layer
                }
                node.showText = node.text
            }else if(node.type == "blank"){
                for(var m=0 ; m<node.text.length ; m++){
                    node.showText += "&nbsp;"                    
                }
            }else if(node.type == "newline"){
                node.showText = "<br>"
                if(i == this.nodeList.length-1){
                    node.showText += "&nbsp;"
                }
            }else if(node.type == "sign"){
                attrClass = "sign"
                node.showText = node.text
                if(node.text == "<"){ node.showText = "&lt;"}
                else if(node.text == ">"){ node.showText = "&gt;"}
                else if(node.text == "&"){ node.showText = "&amp;"}
                else if(node.text == '"'){ node.showText = "&quot;"}
            }else if(node.type == "num"){
                attrClass = "num"
                node.showText = node.text
            }else if(node.type == "token"){
                //TODO 如果token不存在，显示红色

                if(node.isBlockToken == true){
                    attrClass = "block_token"
                }else{
                    attrClass = "token"
                }
                node.showText = node.text
            }else if(node.type == "character"){
                attrClass = "character"
                node.showText = node.text
            }else {
                node.showText = node.text
            }
            
            if(attrClass == ""){
                node.showText = "<span>"+node.showText+"</span>"
            }else{
                node.showText = "<span class='"+attrClass+"'>"+node.showText+"</span>"
            }

            result+= node.showText
        }
        return result
        
    },


    /**
     * 处理括号匹配
     */
    buildBracket:function(){
        var queue = [];
        for(var i=0 ; i<this.nodeList.length ; i++){
            var node = this.nodeList[i]
            if(node.type != "leftbracket" && node.type != "rightbracket"){
                continue
            }

            if(node.type == "leftbracket"){
                queue.push(node)
                continue
            }   

            //错误： 开始输入右括号
            if(queue.length == 0){
                node.bracketMapIndex = -1
                node.bracketLayer = -1
                continue
            }

            //错误：右括号与左括号不匹配
            var topNode = queue[queue.length-1]
            var curBracketMap = this.bracketMap[node.text]
            if(topNode.text != curBracketMap){
                node.bracketMapIndex = -1
                node.bracketLayer = -1
                continue
            }

            //正确
            node.bracketMapIndex = topNode.index
            node.bracketLayer = queue.length-1

            topNode.bracketLayer = queue.length-1
            topNode.bracketMapIndex = node.index

            queue.pop()
        }

        for(var i=0 ; i<queue.length ; i++){
            queue[i].bracketMapIndex = -1
            queue[i].bracketLayer = -1
        }

        return 
    },


    /**
     * 处理斜杠
     */
    buildBackslash:function(){
        for(var i=0 ; i<this.nodeList.length ; i++){
            var node = this.nodeList[i]
            if(node.type != "backslash"){
                continue
            }

            if( (i+1)<this.nodeList.length 
                && this.nodeList[i+1].type == "backslash"
            ){
                node.isBackSlash = false
                this.nodeList[i+1].isBackSlash = false
                i += 1
                continue
            }

            node.isBackSlash = true

        }
    },

    buildBlock:function(){
        for(var i=0 ; i<this.nodeList.length ; i++){
            var node = this.nodeList[i]
            if(node.type != "token" || (node.text != "begin" && node.text != "end" )){
                continue
            }

            if(this.isBlockToken(node.index)){
                node.isBlockToken = true
                continue
            }
            node.isBlockToken = false
        }
    },

    isBlockToken:function(nodeIndex){
        if(nodeIndex <= 0){
            return false
        }

        var prevNode = this.nodeList[nodeIndex-1]
        if(prevNode.text == "\\"){
            prevNode.isTokenBackSlash = true
            return true
        }

        return false
    }
}

