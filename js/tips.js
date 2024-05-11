
/**
 * 在下列情况下显示提示信息
 * 1 按下一个斜杠，且斜杠后面没有内容 或者 斜杠后面是一个空格
 */
var Tip = {
	isInit:false,
	curLine:-1,

	codeTextArea:null,

	isPressUpDown:false,

	lineNum:0,	//提示条数
	lineHeight:0,	//一条提示的高度
	showHeight:0,	//显示区高度
	lineScrollHeight:0,	//一个单元滚动的高度

	isShowTip:false,

	init:function(){
		if(this.isInit == true) return ;
		var self = this

		$("body").on("click" , function(){
			self.hideTip()
		})
		
		this.codeTextArea = document.getElementById("code");

		//按键弹起
		document.querySelector("#code").addEventListener("keyup" , function(event){
			if( event.keyCode == 40 	//向下键
				|| event.keyCode == 38	//向上键
			){
				return 
			}

			self.checkShowTip()
			self.checkHideTip()
		})


		//按下回车键时，输入选择的选项
		$("#code").on("keydown" , function(event){

			if(event.keyCode == 9) {	//tab键
				Main.insertTab(this)
				Main.onChange()
				event.returnValue = false	
				event.preventDefault();	
			}

			//处理提示信息
			if(self.isShowTip == false){
				return true
			}
			if( event.keyCode==38){ //向上键
				self.prevLine()
				return false
			}else if( event.keyCode==40){	//向下键
				self.nextLine()
				return false
			}else if(event.keyCode == 27){	//ESC键
				self.hideTip()
				return 
			}else if(event.keyCode == 13){	//回车键
				self.insertSelectedContent()
				self.hideTip()
				return false
			}
			return true
		})


		//在内容中点击
		document.querySelector("#code").addEventListener("click" , function(event){
			self.checkShowTip()
			self.checkHideTip()
			event.stopPropagation();
		})


		//鼠标滚动
		$(".tips").on("mouseover" , ".tip-line" ,  function(){
			if(self.isPressUpDown == true){
				self.isPressUpDown = false
				return true
			}
			$(".tip-line").removeClass("now")
			$(this).addClass("now")
			self.curLine = $(".tip-line").index(this)
		})


		//点击选择的内容
		$(".tips").on("click"  , ".tip-line" , function(event){
			event.preventDefault()
			self.insertSelectedContent()	//插入选择的内容
			self.hideTip()
		})


		//初始化tip
		this.showTipList(tipMap);

		this.isInit = true
	},

	/**
	 * 根据key指获取对应代码
	 * @param {*} keyWord 
	 * @returns 
	 */
	getContent:function(keyWord){
		return tipMap[keyWord]
	},

	/**
	 * 显示提示下拉列表
	 * @param {*} list 所有内容
	 * @param {*} content 斜杠后面token
	 * @returns 
	 */
	showTipList:async function(list , content){
		if(typeof content == "string"){
			content = content.toLowerCase()
		}
		var result = [];
		if(typeof content == "string" && content.trim() != ""){
			for(var index in list){
				var searchWord = list[index][0]
				var wordIndex = searchWord.toLowerCase().indexOf(content)
				if(wordIndex>=0){
					result.push( {
						searchWord:searchWord,
						word:list[index][1],
						showWord:list[index][2],
						pos:list[index][3],
						style:list[index][4],
						index:wordIndex
					})
				}
			}
		}else{
			for(var index in list){
				var searchWord = list[index][0]
				result.push( {
					searchWord:searchWord,
					word:list[index][1],
					showWord:list[index][2],
					pos:list[index][3],
					style:list[index][4],
					index:100
				})
			}
		}

		//只有一个匹配项时，不显示提示框
		if(result.length == 0){
			this.hideTip();
			return false;
		}
		// if(result.length == 0 
		// 	|| (result.length == 1 && result[0]["searchWord"].replace("\\" , "") == content)
		// ){
		// 	this.hideTip();
		// 	return false
		// }



		//排序
		result.sort(function(a , b){
			if(a.index != b.index){
				return a.index - b.index
			}

			if(a.searchWord.length == b.searchWord.length){
				return a.searchWord.toLowerCase().localeCompare(b.searchWord.toLowerCase())
			}else{
				return a.searchWord.length - b.searchWord.length
			}
			
		})
		//在下拉框中插入内容
		$(".tips").empty()
		for(var keyIndex=0 ; keyIndex<result.length && keyIndex<50 ; keyIndex++){
		
			var searchWord = result[keyIndex]["searchWord"]	//显示的单词
			var node = $("#tpl-tip .tip-line").clone(true)	
			$(".tips").append(node)
			var word =  result[keyIndex]["word"]
			var showWord = result[keyIndex]["showWord"]
			var wordIndex = result[keyIndex]["index"]
			var pos = result[keyIndex]["pos"]
			var style = result[keyIndex]["style"]
			if(wordIndex>99){
				$(node).find(".tip-name").text(searchWord)
			}else{
				
				var prevNode = $("<span></span>")
				var prevText = searchWord.substring(0 , wordIndex);
				prevNode.text(prevText)

				var tokenNode = $("<span class='token'></span>")
				var tokenText = searchWord.substring(wordIndex , wordIndex+content.length);
				tokenNode.text(tokenText)

				var lastNode = $("<span></span>")
				var lastText = searchWord.substring(wordIndex+content.length);
				lastNode.text(lastText)

				$(node).find(".tip-name").append(prevNode).append(tokenNode).append(lastNode)
			}

			if(style){
				$(node).find(".tip-img").css(style)
				$(node).find(".tip-img").attr("test" , "test")
			}

			if(showWord){
				$(node).find(".tip-img").text("$$"+showWord+"$$")
			}

			if(pos){
				$(node).attr("pos" , pos);
			}else{
				$(node).attr("pos" , 0);
			}
			
			$(node).attr("searchWord" , searchWord);
			$(node).attr("word" , word);
		}

		this.lineNum = $(".tip-line").size()-1
		this.lineHeight = $(".tip-line").eq(0).outerHeight();
		this.showHeight = $(".tips").outerHeight();
		this.lineScrollHeight = ((this.lineNum+1)*this.lineHeight-this.showHeight)/this.lineNum

		MathJax.typeset([".tips"]) 
		
		

		return true
	},


	/**
	 * 检测是否需要显示提示
	 */
	checkShowTip:function(checkOnly){
		this.isShowTip = false
		var tagNum = this.getCurrentLabelNodeIndex();	//当前光标所在节点索引位置
		if(
			this.isBackSlashPos(tagNum) || this.isCharactorTokenPos(tagNum)	//在斜线或者斜线之后的token上
		){
			if(!checkOnly){
				var tipSpanIndex = tagNum
				var nodeContent = ""

				//在斜线之后内容上时，显示位置在斜线上
				if(Parse.nodeList[tagNum].isBackSlash !== true){
					nodeContent = Parse.nodeList[tagNum].text
					tipSpanIndex = tagNum-1
				}else if(Parse.nodeList[tagNum+1] && Parse.nodeList[tagNum+1].type == "token" ){
					nodeContent = Parse.nodeList[tagNum+1].text
				}

				//显示提示的位置
				let xPos = $('#show-content span').eq(tipSpanIndex).offset().top;
				let yPos = $('#show-content span').eq(tipSpanIndex).offset().left;

				this.showTip(xPos,yPos , nodeContent )
			}
			
			this.isShowTip = true
			return true
		}
		
		this.checkHideTip()
		return false
	},

	/**
	 * 获取当前标签所在节点
	 */
	getCurrentLableNode:function(){
		var tagNum = this.getCurrentLabelNodeIndex();
		if(tagNum<0){
			return null
		}
		return Parse.nodeList[tagNum];
	},


	/**
	 * 获取当前标签所在的节点索引
	 * @return int
	 */
	getCurrentLabelNodeIndex:function(){
		//标签位置
		var lablePos = this.getCurPosition()
		if(lablePos === false){
			return -1
		}
		lablePos--;

		//标签位置
		var tagNum = -1
		for(var i=0 ; i<Parse.nodeList.length ; i++){
			var node = Parse.nodeList[i]

			if(lablePos>=node.start && lablePos<=node.end){
				tagNum = i
				break;
			}
		}
		return tagNum
	},

	
	/**
	 * 检查是否需要关闭提示
	 */
	checkHideTip:function(){
		if(this.isShowTip === false){
			this.hideTip();
		}
	},


	/**
	 * 判断光标所在位置是否在斜线后，斜线之后是空白内容
	 * @param {*} tagNum 
	 */
	isBackSlashPos:function(tagNum){
		if(tagNum<0){
			return false
		}

		//最后一个字符
		if(tagNum == Parse.nodeList.length-1 &&  Parse.nodeList[tagNum].isBackSlash === true){
			return true
		}

		//斜线之后是空白
		if(Parse.nodeList[tagNum].isBackSlash === true 
			&& Parse.nodeList[tagNum+1]
			&& (Parse.nodeList[tagNum+1].type === "blank" || Parse.nodeList[tagNum+1].type === "token" )
		){
			return true
		}

		return false
	},

	/**
	 * 判断是否在斜线之后字符串token
	 * @param {} tagNum 
	 */
	isCharactorTokenPos:function(tagNum){
		if(tagNum<=0){
			return false
		}

		if( Parse.nodeList[tagNum].type === "token"
			&& Parse.nodeList[tagNum-1].isBackSlash === true
		){
			return true
		}
		return false
	},

	/**
	 * 关闭提示时，选择行号关闭
	 */
	setCurLineClose:function(){
		this.curLine = -1;
		this.isPressUpDown = false
	},

	/**
	 * 打开提示时，选择行号重置为0
	 */
	setCurLineOpen:function(){
		this.curLine = 0;
		this.isPressUpDown = true
	},


	/**
	 * 提示框往前选择
	 */
	prevLine:function(){
		this.curLine--
		if(this.curLine<=0){
			this.curLine = 0
		}

		$(".tip-line").removeClass("now")
		$(".tip-line").eq(this.curLine).addClass("now")
		this.autoScroll();
		this.isPressUpDown = true
	},


	/**
	 * 提示框往下选择
	 */
	nextLine:function(){
		this.curLine++
		if(this.curLine>=this.lineNum){
			this.curLine = this.lineNum-1
		}
		$(".tip-line").removeClass("now")
		$(".tip-line").eq(this.curLine).addClass("now")
		this.autoScroll();
		this.isPressUpDown = true
	},


	/**
	 * 自动将提示框选择设置第一个
	 * @returns 
	 */
	autoScroll:function(){
		if(this.curLine<0){
			return 
		}

		$(".tip-line").removeClass("now")
		$(".tip-line").eq(this.curLine).addClass("now")
		$(".tips").scrollTop(this.curLine*this.lineScrollHeight+2)

	},

	/**
	 * 获取当前光标位置
	 */
	getCurPosition:function () {//获取光标位置函数
		var CaretPos = 0;	// IE Support
		if (document.selection) {
			this.codeTextArea.focus ({ preventScroll: true });
			var Sel = document.selection.createRange ();
			Sel.moveStart ('character', -this.codeTextArea.value.length);
		}else if (this.codeTextArea.selectionStart || this.codeTextArea.selectionStart == '0'){
			// Firefox support
			this.codeTextArea.focus ({ preventScroll: true });
			CaretPos = this.codeTextArea.selectionStart;
			if(this.codeTextArea.selectionStart != this.codeTextArea.selectionEnd ){
				return false
			}
		}
			
		return (CaretPos);
	},

	/**
	 * 设置光标位置
	 * @param {*} pos 
	 */
	setLablePosition:function(pos){
		setTimeout(()=>{
			Main.codeTextArea.selectionStart = pos
			Main.codeTextArea.selectionEnd = pos
			document.querySelector("#code").setSelectionRange(pos , pos)
		} , 1)
		
	},

	
	/**
	 * 显示提示
	 * @param {Object} top
	 * @param {Object} left
	 * @param {string} 提示关键词
	 */
	showTip:function(top , left , content ){
		if(!content) content = "";

		//筛选合适的tip内容
		if(!this.showTipList(tipMap , content)){
			this.hideTip()			
			return
		}

		//显示
		top = top+25
		left = left+8
		$(".tips").css({
			top:top+"px",
			left:left+"px"
		})


		//保存光标位置
		var lablePos = this.getCurPosition()
		if(lablePos === false){
			lablePos = -1
		}else{
			lablePos--;
		}
		Main.labelPos = lablePos
		this.isShowTip = true

		Tip.setCurLineOpen();
		this.autoScroll();
	},
	

	/**
	 * 隐藏提示
	 */
	hideTip:function(){
		let top = -1000
		let left = -1000
		$(".tips").css({
			top:top+"px",
			left:left+"px"
		})
		Main.labelPos = -1
		this.isShowTip = false
		Tip.setCurLineClose();
		this.autoScroll();
	},


	/**
	 * 插入下拉框选择的内容
	 */
	insertSelectedContent:function(){
		var searchWord = $(".tips .now").attr("searchWord").trim()
		var content = $(".tips .now").attr("word").trim()
		var curNode = this.getCurrentLableNode();
		var pos = parseInt($(".tips .now").attr("pos").trim())
		
		//如果后面有更多空白节点，要删掉
		var curNodeIndex = this.getCurrentLabelNodeIndex();
		var blankLength = 0

		var startIndex = curNodeIndex+1
		while(startIndex<Parse.nodeList.length){
			var node = Parse.nodeList[startIndex]
			if(node.type == "blank"){
				blankLength += node.end+1-node.start
			}else{
				break;
			}

			startIndex++
		}
		if(curNode && curNode.type == "token"){		
						
			this.replaceContent(content+" " , curNode.start , curNode.end+blankLength+1)
		}else if(curNode && curNode.type == "backslash" && curNodeIndex<Parse.nodeList.length){
			var nextNode = Parse.nodeList[curNodeIndex+1]
			if(nextNode && nextNode.type == "token"){
				this.replaceContent(content , nextNode.start , nextNode.end+1)
			}else{
				this.insertContent(content+" ")
			}	
		}else{
			this.insertContent(content+" ")
		}

		
		if(pos){
			var curPos = this.getCurPosition();
			this.setLablePosition(curPos+pos)
		}
		
	},

	/**
	 * 插入内容
	 * @param {string} 插入的内容
	 */
	insertContent:function(content){
		var pos = this.getCurPosition()
		this.codeTextArea.focus({preventScroll: true });
		this.codeTextArea.setRangeText(content , pos, pos, 'end');
		Main.onChange()
	},

	replaceContent:function(content , start , end){
		this.codeTextArea.focus({preventScroll: true });
		this.codeTextArea.setRangeText(content , start, end, 'end');
		Main.onChange()
	},
	
}