var Main = {
	isInit:false,
	editor:null,
	init:function(){
		if(this.isInit == true)return 
		var self = this
		

		this.editor = new LatexEditor("editor" , "show-content")

		$("body").on("click" , function(){
			$(".saveimg").hide();
		})
		
		/**
		 * save image
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
		 * font-size
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
		 * font-size 
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
		 * font-size 
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
		 * click icon
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

			
			self.editor.tip.insertContent(content);

			
			if(pos){
				var curPos = self.editor.tip.getCurPosition();
				self.editor.tip.setLablePosition(curPos-pos)
			}
		})

		/**
		 * scroll help content
		 */
		$(".type-box").on("click" , function(){
			var top = parseInt($(this).attr("top"));
			if(top != undefined && !isNaN(top)){
				$(".help-content").animate({
					scrollTop: top+"px"
				}, 300);
			}
		})

		// $(".help-content").on("scroll" , function(){
		// 	console.log($(this).scrollTop())
		// })


		/**
		 * multi line
		 */
		$(".line-mode").on("click" , function(){
			var mode = $(this).attr("mode").trim()
			var code = self.editor.textarea.val();
			if(mode == "eqnarray"){
				code = "\\begin{eqnarray}\n"+code+"\n\\end{eqnarray}"
				self.editor.textarea.val(code)
				self.editor.onChange()
			}else if(mode == "align"){
				code = "\\begin{align}\n"+code+"\n\\end{align}"
				self.editor.textarea.val(code)
				self.editor.onChange()
			}else if(mode == "array"){
				code = "\\begin{array}{c}\n"+code+"\n\\end{array}"
				self.editor.textarea.val(code)
				self.editor.onChange()
			}
		})

		self.editor.textarea.focus()
		self.editor.tip.insertContent("e^{i \\pi }+1 = 0")

		this.isInit = true
	},

	/**
	 * check repeate tip content
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
