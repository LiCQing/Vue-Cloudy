var SERVER = "http:localhost:8081/"


export default{

	//给组件调用的方法
	
	 //获取指定父路径下的文件/文件夹列表
	 getFileList({state,commit},cDir){
		 console.log(SERVER  + "目录--》" );
		 console.log(cDir);
		 //先查看缓存中是否存在
		 var fileList = null;
		 state.allFileList.forEach((file)=>{
				 if(cDir.fId==file.pid){
					   fileList = file;
				 }
		 })
		 
		 if(fileList == null){
			 //console.log("获取后台列表==》" + cDir.fId);
			 if(cDir.fId==0)
							fileList={
									pid:cDir.fId,
									list:[{fId:1,
										fName:"我的资源",
										fSize:10000,
									fCreateTime:'2019-8-5 10:22',
									isCheck:false,
									isReName:false
									},{
											fId:2,
											fName:"图片",
											fSize:2000,
											fCreateTime:'2019-7-5 10:22',
											isCheck:false,
											isReName:false
										}]
									} ;
							else if(cDir.fId==1)
										fileList={
												pid:cDir.fId,
												list:[{fId:5,
													fName:"学习资源",
													fSize:10000,
												fCreateTime:'2019-8-5 10:22',
												isCheck:false,
												isReName:false
												},{
														fId:6,
														fName:"视频资源",
														fSize:2000,
														fCreateTime:'2019-7-5 10:22',
														isCheck:false,
														isReName:false
													}]
												} ;
									else if(cDir.fId==2)
												fileList={
														pid:cDir.fId,
														list:[{fId:5,
															fName:"相册",
															fSize:10000,
														fCreateTime:'2019-8-5 10:22',
														isCheck:false,
														isReName:false
														},{
																fId:6,
																fName:"头像",
																fSize:2000,
																fCreateTime:'2019-7-5 10:22',
																isCheck:false,
																isReName:false
															}]
														} ;
												else 
													fileList={
															pid:cDir.fId,
															list:[{fId:7,
																fName:"其他",
																fSize:10000,
															fCreateTime:'2019-8-5 10:22',
															isCheck:false,
															isReName:false
															}]
															} ;
										
				commit('addFileList',{fileList});
		 }
		
		// console.log(fileList);
		 commit('setClist',{fileList});
		 if(cDir.fId != 0){
			 var dir= { fId:cDir.fId, fName:cDir.fName }
				console.log(dir);
				commit('addDir',{dir});
			}
		//console.log(state.dirList);
		console.log("请求结束");
	 },
	 

	 //选择所有
	 checkAll({commit},value){
		 commit('changeAllCheck',{value});
	 },
	 
	 //文件排序
	 fileSort({commit},type){
				if(type=="name"){
					commit('sortByName');
				}
	},
	
	//新增文件夹
	addNewDir({commit}){
			var fileName = "";
		  commit('addFileToCList',{fileName});
			var inputState = true;
			commit('changeInputState',{inputState});
	},
	
	//确认新增文件夹
	confirmNewDir({commit},fileName){
			commit('delNewDirInCList');
			commit('addFileToCList',{fileName});
			var inputState = false;
			commit('changeInputState',{inputState});
	},
	
	//取消新增文件夹
	cancelNewDir({commit}){
			commit('delNewDirInCList');
			var inputState = false;
			commit('changeInputState',{inputState});
	},
	
	//修改文件名字
	reThisName({commit},index,fileName){
			var value = true;
			 commit('changeFileReNameState',{index,value});
	},
	
	//确认修改
	confirmReName({commit},obj){
		  var index = obj.index;
			var fileName= obj.fileName;
		  commit('changeFileReName',{index,fileName});
			var value = false;
			commit('changeFileReNameState',{index,value});
	},
	
	//取消修改
	cancelReName({commit},index){
			var value = false;
			commit('changeFileReNameState',{index,value});
	},
	
	//点击路径
	changeDir({dispatch,commit},obj){
		var dirList = obj.dirList;
		var index = obj.index;
		dispatch('getFileList',dirList[dirList.length - 2]).then(() => {
				commit('delDir',{index});
		})
		
	},
	 
	 //返回上一级
	 backDir({dispatch,commit},dirList){
		 dispatch('getFileList',dirList[dirList.length - 2]).then(() => {
				commit('backDir');
    })
	 },
	 
	 //修改上传文件框状态
	 changeIsShow({commit},value){
		 commit('changeIsShow',{value});
	 },
	 saveForm (context) {
		 console.log(context);
			axios({
			method: 'post',
			url: '/user',
			data: {user:'001'}
			})
 }
	 
	 
}