var Symbols = {
    isInit:false,
	init:function(){
		if(this.isInit == true)return 
		var self = this
		
		var editor = new LatexEditor("symbol-code", "symbol-show")

		$("t").on("click" , function(){
			var width = $(this).outerWidth();
			var height = $(this).outerHeight();
			var position = $(this).offset();
			var left = position.left-200+parseInt(width/2);
			var top = position.top+height+5;
			var code = $(this).attr("title")
			editor.textarea.val(code)
			editor.onChange()
			$(".symbols-box").css({left,top}).show()
			$("t").removeClass("now")
			$(this).addClass("now")
		})

		$(".btn-close").on("click" , function(){
			$(".symbols-box").fadeOut(300)
			$("t").removeClass("now")
		})

		this.isInit = true
	},
}

