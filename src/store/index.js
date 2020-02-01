import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
//import actions from './actions'
import getters from './getters'
import axios from 'axios'

Vue.use(Vuex)

var SERVER = "http://localhost:8081/"

const state = {
	currentFileList: {}, //当前显示的文件列表
	allFileList: [], //所有的文件列表
	currentDirId: 0, //当前目录id
	sortType: 1, // 1顺序 0 逆序
	isInput: false, //是否新建文件
	dirList: [{
		fId: 0,
		fName: '我的网盘'
	}], //目录顺序
	token:"64653D3349D2C36B7F9B046B287DFF18",
	isShow: false, //显示上传文件div
	currentCate: -1,
}

export default new Vuex.Store({
	state,
	mutations,
	//actions,
	getters,
	actions: {
		//保存token
		saveToken({commit},token){
			commit('saveToken',{token});
		},
		 
		 	 //获取指定父路径下的文件/文件夹列表
		 	 getFileList({state,commit},cDir){
		 		 console.log(SERVER  + "目录--》" );
		 		 console.log(cDir);
		 		 //先查看缓存中是否存在
		 		 var fileList = null;
		 		 
		 			 //console.log("获取后台列表==》" + cDir.fId);
					let param = new URLSearchParams()
					param.append('fid', cDir.fId)
					param.append('token', state.token)
		 			 axios.post(SERVER+'list' , param).then((res) => { // 调用接口
		 			 	//console.log(res.data.data); isCheck:false,
											//isReName:false
						fileList = {
							"fid":cDir.fId,
							"list":res.data.data.map((obj,index)=>{
								obj.isCheck=false;
								obj.isReName=false;
								return obj;
							})
						}
						//console.log(fileList);
						commit('setClist',{fileList});
						let type = -1;
						commit('changeCate',{type});
						//commit('addFileList',{fileList});
						console.log("请求结束");
		 			 })
		 		
		 		// console.log(fileList);
		 		 if(cDir.fId != 0){
		 			 var dir= { fId:cDir.fId, fName:cDir.fName }
		 				console.log(dir);
		 				commit('addDir',{dir});
		 			}
				commit('setCDir',{cDir});
		 	 },
			 
			 //重新获取
			 reGetFileList({state,commit}){
			 	//先查看缓存中是否存在
			 	var fileList = null;
				var fid = state.currentDirId;
			 		//console.log("获取后台列表==》" + cDir.fId);
			 	let param = new URLSearchParams()
			 	param.append('fid', fid)
			 	param.append('token', state.token)
			 		axios.post(SERVER+'list' , param).then((res) => { // 调用接口
			 		fileList = {
			 			"fid":fid,
			 			"list":res.data.data.map((obj,index)=>{
			 				obj.isCheck=false;
			 				obj.isReName=false;
			 				return obj;
			 			})
			 		}
			 		//console.log(fileList);
			 		commit('setClist',{fileList});
			 		let type = -1;
			 		commit('changeCate',{type});
			 		//commit('addFileList',{fileList});
			 		console.log("请求结束");
			 		})
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
						if(type=="size"){
							commit('sortBySize');
						}
						if(type=="time"){
							commit('sortByTime');
						}
		 	},
		 	
		 	//新增文件夹
		 	addNewDir({commit}){
		 			var file = {
						fName:"",
						fSize:0,
						isCheck:false,
						isReName:false,
						fCate:10,
						fCreateTime:0
					};
		 		  commit('addFileToCList',{file});
		 			var inputState = true;
		 			commit('changeInputState',{inputState});
		 	},
		 	
		 	//确认新增文件夹
		 	confirmNewDir({commit},fileName){
				
		 			commit('delNewDirInCList');
					 var newFileName = fileName;
					 var i = 1;
					while(true){
						var has= false;
						state.currentFileList.list.forEach((file)=>{
							if(file.fName == newFileName){
								has = true;
							}
						})
						if(has){
								newFileName = fileName+"( " + i + " )";
								i++;
						}else{
							fileName = newFileName;
							break;
						}
					}
					
						var file={
							fName:fileName,
							fSize:0,
							isCheck:false,
							isReName:false
						};
					
					let param = new URLSearchParams()
					param.append('fName', fileName)
					param.append('token', state.token)
					param.append('pId', state.currentDirId)
					axios.post(SERVER + "newDir",param).then(res=>{
						file = res.data.data;
						file.isCheck=false;
						file.isReName=false;
						commit('addFileToCList',{file});
						var inputState = false;
						commit('changeInputState',{inputState});
					});
		 			
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
		 	confirmReName({commit,state},obj){
				
				let param = new URLSearchParams()
				param.append('fid', obj.fid)
				param.append('token', state.token)
				param.append('newName',obj.fileName )
				axios.post(SERVER + "rename",param).then(res=>{
					console.log(res);
					var index = obj.index;
					var fileName= obj.fileName;
					commit('changeFileReName',{index,fileName});
					var value = false;
					commit('changeFileReNameState',{index,value});
				})
		 		 
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
			 
			 //移动
			 remove({context},obj) {
				 console.log(obj);
					//清除当前目录缓存 和 被移动到的目录缓存
					let param = new URLSearchParams()
					obj.fid.forEach(id=>{
						param.append('fId', id);
					})
					param.append('token', state.token)
					param.append('pId',obj.pid )
					axios.post(SERVER + 'remove' , param).then(res=>{
						console.log(res);
						var index  = obj.index;
						commit('delFileInCList',{index});
						layer.msg("移动成功");
					});
					//清除当前目录
					//var fids = obj.fid;
			 },
			  
			 //批量移动
			 batRemove({state,commit},pid){
							let param = new URLSearchParams()
							param.append('token', state.token);
							param.append('pId',pid );
							var fileList = state.currentFileList.list;
							fileList.forEach(file=>{
								if(file.isCheck){
									param.append('fId', file.fId)
								}
							})
							axios.post(SERVER + 'remove' , param).then(res=>{
								layer.msg("移动成功");
								commit('batDelFileInCList');
							}); 
			},
			 //批量复制
			 batCopy({state,commit},pid){
			 				let param = new URLSearchParams()
			 				param.append('token', state.token);
							param.append('pId',pid );
			 				var fileList = state.currentFileList.list;
			 				fileList.forEach(file=>{
			 					if(file.isCheck){
			 						param.append('fId', file.fId)
			 					}
			 				})
			 				axios.post(SERVER + 'copy' , param).then(res=>{
			 					layer.msg("复制成功");
			 				//	commit('batDelFileInCList');
			 				}); 
			 
			 			},
			 
			 copy({context},obj){
				 let param = new URLSearchParams()
				 param.append('fId', obj.fid)
				 param.append('token', state.token)
				 param.append('pId',obj.pid )
				 axios.post(SERVER + 'copy' , param).then(res=>{
				 	if(res.data.data){
						layer.msg("复制成功");
					}else{
						layer.msg("系统繁忙");
					}
				 
				 });
				 var fids = obj.fid;
			 },
			 
			 //删除
			 deleteFileInCList({state,commit},index){
				var file =  state.currentFileList.list[index];
				console.log(file);
				 let param = new URLSearchParams()
				 param.append('fid', file.fId)
				 param.append('token', state.token)
				 axios.post(SERVER + 'deletefile' , param).then(res=>{
				 	console.log(res);
				 	layer.msg("删除成功");
					commit('delFileInCList',{index});
				 });
				
			 },
			 
			 //批量删除
			 batDeleteFileInCList({state,commit}){
				 let param = new URLSearchParams()
				 param.append('token', state.token)
				 var fileList = state.currentFileList.list;
				 fileList.forEach(file=>{
					  if(file.isCheck){
							param.append('fid', file.fId)
						}
				 })
					axios.post(SERVER + 'deletefile' , param).then(res=>{
						console.log(res);
						layer.msg("删除成功");
						commit('batDelFileInCList');
					}); 

			 },
			 
			
			 
			 
			 //修改分类
			 changeCate({commit},type){
				 commit('changeCate',{type});
			 },
			 
			 //搜索
			 searchFile({commit,state},keyword){
				 let param = new URLSearchParams()
				 param.append('token', state.token)
				 param.append('keyword',keyword)
				 axios.post("http://localhost:8081/" + 'search' , param).then(res=>{
				 var list = res.data.data.map((obj,index)=>{
				 				obj.isCheck=false;
				 				obj.isReName=false;
				 				return obj;
				 })
				 var fileList={
				 	fid:0,
				 	list:list
				 }
				 commit('clearDir');
				 commit('setClist',{fileList});
				 });
			 },
			 
			 //获取文件分类
			 getFileCateList({state,commit},type){
				 let param = new URLSearchParams()
				 param.append('token', state.token)
				 param.append('cate',type)
				 axios.post("http://localhost:8081/" + 'cateList' , param).then(res=>{
				 	var list = res.data.data.map((obj,index)=>{
				 					obj.isCheck=false;
									obj.isReName=false;
				 					return obj;
				 	})
					var fileList={
						fid:0,
						list:list
					}
					commit('clearDir');
					commit('setClist',{fileList});
				 });
			 },
			 
			 //获取分享列表
			 getShareList({commit,state}){
					let param = new URLSearchParams()
					param.append('token', state.token)
					axios.post("http://localhost:8081/" + 'selectAllShare' , param).then(res=>{
					var list = res.data.data.map((obj,index)=>{
									obj.fCreateTime = obj.sCreateTime;
									obj.isCheck=false;
									obj.isReName=false;
									obj.fCate  = 10;
									obj.isShare= true;
									return obj;
					})
					var fileList={
						fid:0,
						list:list
					}
				  commit('clearDir');
					var type=-2;
					commit('changeCate',{type});
				  commit('setClist',{fileList});
				});
			 }
			 
		  }
			
})
