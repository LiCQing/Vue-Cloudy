export default{
	//对状态直接操作函数
	/*
	 addFile(state,{file}){
		 state.fileList.unshift(file)
	 }
	*/
   
	 //缓存获取的文件列表
	 addFileList(state,{fileList}){
		  state.allFileList.unshift(fileList);
	 },
	 
	 setCDir(state,{cDir}){
		 state.currentDirId= cDir.fId;
	 },
	 
	 //设置当前的文件列表
	 setClist(state,{fileList}){
		 state.currentFileList = fileList;
		 console.log(state.currentFileList);
	 },
	 
	 //修改全选或者取消全选
	 changeAllCheck(state,{value}){
		   //this.todos.forEach(todo => todo.complete = choose);
			 state.currentFileList.list.forEach(file => file.isCheck = value);
	 },
	 
	 //根据姓名排序
	 sortByName(state){
		 var dir = state.currentFileList.list.filter(file=> { return file.isDir == 1});
		 var file = state.currentFileList.list.filter(file=> { return file.isDir == 0});
		 dir.sort((a,b)=>{
			 if(state.sortType == 0){  //逆序，顺序
					return a.fName.localeCompare(b.fName,"zh");
				 }
				 else{
					return b.fName.localeCompare(a.fName,"zh");
				 }
		 })
		 file.sort((a,b)=>{
		 	if(state.sortType == 0){  //逆序，顺序
		 		return a.fName.localeCompare(b.fName,"zh");
		 		}
		 		else{
		 		return b.fName.localeCompare(a.fName,"zh");
		 		}
		 })
			dir = dir.concat(file);
			state.currentFileList.list = dir;
			state.sortType = state.sortType == 0?1:0;
	 },
	 
	 //根据大小排序
	 sortBySize(state){
	 	var dir = state.currentFileList.list.filter(file=> { return file.isDir == 1});
	 	var file = state.currentFileList.list.filter(file=> { return file.isDir == 0});
	 	
	 	file.sort((a,b)=>{
	 	if(state.sortType == 0){  //逆序，顺序
	 		return a.fSize > b.fSize?1:-1;
	 		}
	 		else{
	 		return a.fSize < b.fSize?1:-1;
	 		}
	 	})
	 	dir = dir.concat(file);
	 	state.currentFileList.list = dir;
	 	state.sortType = state.sortType == 0?1:0;
	 },
	 
	 //根据时间排序
	 sortByTime(state){
	 var dir = state.currentFileList.list.filter(file=> { return file.isDir == 1});
	 var file = state.currentFileList.list.filter(file=> { return file.isDir == 0});
	 dir.sort((a,b)=>{
	 if(state.sortType == 0){  //逆序，顺序
	 return a.fCreateTime > b.fCreateTime?1:-1;
	 }
	 else{
	 return a.fCreateTime < b.fCreateTime?1:-1;
	 }
	 })
	 file.sort((a,b)=>{
	 if(state.sortType == 0){  //逆序，顺序
	 	return a.fCreateTime > b.fCreateTime?1:-1;
	 	}
	 	else{
	 	return a.fCreateTime < b.fCreateTime?1:-1;
	 	}
	 })
	 dir = dir.concat(file);
	 state.currentFileList.list = dir;
	 state.sortType = state.sortType == 0?1:0;
	 },
	 
	 //添加新文件夹到当前文件列表
	 addFileToCList(state,{file}){
			state.currentFileList.list.unshift(file);
	 },
	 
	 //修改输入状态
	 changeInputState(state,{inputState}){
		 state.isInput = inputState;
	 },
	 
	 //删除最新的文件夹
	 delNewDirInCList(state){
		 state.currentFileList.list.splice(0,1);
	 },
	 
	 //修改重命名文件转台
	 changeFileReNameState(state,{index,value}){
			state.currentFileList.list[index].isReName=value;
	 },
	 
	 //确认修改文件名
	 changeFileReName(state,{index,fileName}){
		 state.currentFileList.list[index].fName=fileName;
	 },
	 
	 //加入目录级别
	 addDir(state,{dir}){
			state.dirList.push(dir);
	},
	
	//清除目录
	clearDir(state){
			state.dirList=[{
			fId: 0,
			fName: '我的网盘'
		}];
	},
	
	//从指定位置去除之后的路径
	delDir(state,{index}){
		state.dirList.splice(index+1);
	},
	
	//返回上一级目录
	backDir(state){
		state.dirList.splice(state.dirList.length-2);
	},
	
	//修改上传框显示状态
	changeIsShow(state,{value}){
		state.isShow = value;
	},
	
	
	//保存token
	saveToken(state,{token}){
		state.token = token;
	},
	
	//删除文件
	delFileInCList(state,{index}){
		state.currentFileList.list.splice(index,1);
	},
	
	//清除选中的
	batDelFileInCList(state){
		 state.currentFileList.list = state.currentFileList.list.filter(file=> { return  !file.isCheck});
	},
	
	
	//切换分类
	changeCate(state,{type}){
		state.currentCate = type;
	}
	
}