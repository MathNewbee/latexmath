var Main = {
	isInit:false,
	isShowTip:false,
	labelPos:-1,
	codeTextArea:null,
	init:function(){
		if(this.isInit == true)return 
		var self = this
		
		Parse.init()
		DoList.init()
		Tip.init();

		this.codeTextArea = document.getElementById("code");



		$("body").on("click" , function(){
			$(".saveimg").hide();
		})



		$("#code").on("input" , function(event){
			DoList.clearUnDolist()
			self.onChange(event)
		})
		
		/**
		 * textarea 与 显示同步
		 */
		$("#code").scroll(function(e) {			
			$("#show-content").scrollTop($("#code").scrollTop())
			$("#show-content").scrollLeft($("#code").scrollLeft())
		});
		
		//按下回车键时，输入选择的选项
		$("#code").on("keydown" , function(event){

			//Ctrl+Z
			if(event.ctrlKey && event.keyCode == 90){			
				//获取上一次内容
				var item = DoList.popDoList()
				Main.codeTextArea.value = item["content"]
				Main.onChange()
				Tip.setLablePosition(item["labelPos"])

				event.returnValue = false	
				event.preventDefault();	
				return 
			}

			//Ctrl+Y
			if(event.ctrlKey && event.keyCode == 89){			
				//获取上一次内容
				var item = DoList.popUndoList()
				if(item == false){
					event.returnValue = false	
					event.preventDefault();	
					return 
				}

				Main.codeTextArea.value = item["content"]
				Main.onChange()
				Tip.setLablePosition(item["labelPos"])				

				event.returnValue = false	
				event.preventDefault();	
				return 
			}
		})


		/**
		 * 保存图片
		 */
		$(".save-as").on("click" , function(event){
			$(".saveimg").toggle();
			event.stopPropagation();
		})

		$(".save-as-png").on("click" , function(event){
			self.exportPNG();
		})

		$(".save-as-jpg").on("click" , function(event){
			self.exportJPG();
		})

		/**
		 * 字体大小
		 */
		$("#font-size").on("change" , function(){
			var fontSize = parseInt($(this).val())
			if(isNaN(fontSize)){return }
			if(fontSize<=12){
				fontSize = 12
			}
			if(fontSize>=999){
				fontSize = 999
			}
			$("#show").css("fontSize" , fontSize+"px");
		})

		/**
		 * 字体大小
		 */
		$(".size-add").on("click" , function(){
			var fontSize = parseInt($("#font-size").val())
			if(isNaN(fontSize)){fontSize = 30}
			fontSize += 1;

			if(fontSize<=12){
				fontSize = 12
			}
			if(fontSize>=999){
				fontSize = 999
			}

			$("#font-size").val(fontSize).change();
		})

		/**
		 * 字体大小
		 */
		$(".size-minus").on("click" , function(){
			var fontSize = parseInt($("#font-size").val())
			if(isNaN(fontSize)){fontSize = 30}
			fontSize -= 1;

			if(fontSize<=12){
				fontSize = 12
			}
			if(fontSize>=999){
				fontSize = 999
			}

			$("#font-size").val(fontSize).change();
		})

		/**
		 * 点击右边提示框，输入内容
		 */
		$(".catagory t").on("click" , function(){

			var content = $(this).attr("code")+" ";
			var pos = parseInt($(this).attr("pos"))
			if($(this).attr("begin")){
				var begin = $(this).attr("begin")
				var end = $(this).attr("end");
				var row = parseInt($(".array_row").val())
				var col = parseInt($(".array_col").val())

				if(isNaN(row) || row<1){
					row = 2;
				}
				if(isNaN(col) || col<1){
					col = 2;
				}

				var mid = "";
				for(var i=0 ; i<row ; i++){
					for(var j=0 ; j<col; j++){
						mid += "  "
						if(j != col-1){
							mid += "&"
						}
					}
					if(i != row-1){
						mid += " \\\\ "
					}
					mid += "\n";
				}
				pos = end.length+mid.length;
				content = begin+"\n"+mid+end;
			}

			
			Tip.insertContent(content);

			
			if(pos){
				var curPos = Tip.getCurPosition();
				Tip.setLablePosition(curPos-pos)
			}
		})

		/**
		 * 帮助内容滚动
		 */
		$(".type-box").on("click" , function(){
			var top = parseInt($(this).attr("top"));
			if(top != undefined && !isNaN(top)){
				$(".help-content").animate({
					scrollTop: top+"px"
				}, 300);
			}
		})

		$(".help-content").on("scroll" , function(){
			console.log($(this).scrollTop())
		})


		/**
		 * 多行模式
		 */
		$(".line-mode").on("click" , function(){
			var mode = $(this).attr("mode").trim()
			var code = $("#code").val();
			if(mode == "eqnarray"){
				code = "\\begin{eqnarray}\n"+code+"\n\\end{eqnarray}"
				$("#code").val(code)
				Main.onChange()
			}else if(mode == "align"){
				code = "\\begin{align}\n"+code+"\n\\end{align}"
				$("#code").val(code)
				Main.onChange()
			}else if(mode == "array"){
				code = "\\begin{array}{c}\n"+code+"\n\\end{array}"
				$("#code").val(code)
				Main.onChange()
			}
		})
		this.isInit = true
	},

	/**
	 * 检查tip中的重复内容
	 */
	checkSameTip:function(){
		var map = {}
		var sameContent = "";
		for(var i=0 ; i<tipMap.length ; i++){
			var key = tipMap[i][0]+"_"+tipMap[i][1]
			if(!map[key]){
				map[key] = true
				continue
			}

			sameContent += tipMap[i][0]+" "+tipMap[i][1]+"\r\n"
		}
		console.log(sameContent)
	},
	 

	onChange:function(event){		
		var content = $("#code").val()
		content = content.replaceAll("\t" , "    ")
		$("#code").val(content)

		try{
			$("#show .show-content").text("$$"+content+"$$")
			MathJax.typeset(["#show"])
		}catch(e){
			console.error(e)
		}
		
		// var html = ""
		// try{
		// 	html = MathJax.tex2chtml(content);
		// }catch(e){
		// 	error.log(e)
		// }
		
		// $("#show .show-content").html(html)

		var lablePos = Tip.getCurPosition()

		//记录当前输入内容
		DoList.pushDoList(content,lablePos)
		
		content = content.replace("\r" , "")
		content = Parse.parse(content)
		$("#show-content").empty().append(content)

	},

	/**
	 * 插入tab键 四个空格
	 * @param {} obj 插入对象 textarea
	 */
	insertTab:function(obj) {
		let start = obj.selectionStart;
		let end = obj.selectionEnd;
		if (start) {
			var txt = obj.value
			var result = txt.substring(0, start) + "    " + txt.substring(end)
			obj.value = result
			// 防止光标跳到最后
			obj.selectionStart = start + 4
			obj.selectionEnd = start + 4
		}
	},

	exportPNG:async function(){
		var node = document.querySelector("#show .show-content")
		console.log(node)

		domtoimage.toPng(node).then(function (dataUrl) {
			var link = document.createElement('a');
			link.download = 'image-name.png';
			link.href = dataUrl;
			link.click();
		}).catch(function (error) {
			console.error('oops, something went wrong!', error);
		});
		
	},

	exportJPG:async function(){
		var node = document.querySelector("#show .show-content")

		domtoimage.toJpeg(node , {quality: 1, bgcolor:"#ffffff"}).then(function (dataUrl) {
			var link = document.createElement('a');
			link.download = 'image-name.png';
			link.href = dataUrl;
			link.click();
		}).catch(function (error) {
			console.error('oops, something went wrong!', error);
		});
		
	},
}
