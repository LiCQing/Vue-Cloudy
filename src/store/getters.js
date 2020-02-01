export default{
	//参数和计算属性
	//token
	cToken(state){
		return state.token || '64653D3349D2C36B7F9B046B287DFF18';
	},
	
	clist(state){
		if(state.currentFileList == null ||state.currentFileList == undefined ||state.currentFileList.list == undefined){
			return {};
		}else{
			return state.currentFileList.list;
		}
		
	},
	currentDir(state){
		return state.currentDirId;
	},
	//当前文件的数量
	totalFile(state){
		if(state.currentFileList == null||state.currentFileList == undefined ||state.currentFileList.list == undefined){
			return 0;
		}else{
			return state.currentFileList.list.length;
		}
		
	},
	//当前选择项目的个数
	selectCount(state){
		if(state.currentFileList == null||state.currentFileList == undefined ||state.currentFileList.list == undefined){
			return 0;
		}else{
			return state.currentFileList.list.reduce((preTotal,file)=>preTotal +(file.isCheck?1:0),0 );
		}
		//this.todos.reduce((preTotal,todo)=>preTotal +(todo.complete?1:0),0 )
		
	},
	//当前是否是输入状态
	isInput(state){
		return state.isInput;
	},
	
	//目录列表
	dirList(state){
		return state.dirList;
	},
	
	
	//显示上传文件框框
	isShow(state){
		return state.isShow;
	},
	
	
	//当前类别
	currentCate(state){
		return state.currentCate;
	}
	
}