var Main = {
	isInit:false,
	editorList:[],
	init:function(){
		if(this.isInit == true)return 
		var self = this
		
		var editorIndex = 1
		$(".t-editor").each(function(){
			$(this).find(".t-code").attr("id" , "editor"+editorIndex)
			$(this).find(".t-show").attr("id" , "show"+editorIndex)

			var editor = new LatexEditor("editor"+editorIndex , "show"+editorIndex)
			self.editorList.push(editor)
			editorIndex++
			editor.onChange()
		})

		this.isInit = true
	},

}
