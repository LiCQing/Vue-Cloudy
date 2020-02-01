<template>
	
<tr>
	<td>
			<div class="divInlineBlock checkBox" >
				<input type="checkbox" v-model="file.isCheck"/>
			</div>
			<div v-bind:class="iconClass" class="divInlineBlock fileIcon dir "></div>
		  <div class="divInlineBlock fileItem-text fileName ">
					<div v-if="file.isReName" class="inputDirName2">
						<input v-model="newDirName" class="inputDirNameInput"/>
							<i @click="confirmReName2()" class="layui-icon layui-icon-ok"/>
							<i @click="cancelReName(index)" class="layui-icon layui-icon-close"/>
					</div>
					<div v-if="file.isReName == false">
						<a v-if="file.isDir==1" @click="getFileList(file)">	{{file.fName}} </a>
						<a v-else-if="file.isShare"  target="_blank" :href="'#/share?sid='+file.sId">  {{file.fName}} </a>
						<a v-else  @click="toView(file.fId)">  {{file.fName}} </a>
					</div>
		  </div>
	</td>
	<td>
		<div v-if="file.isShare" class="divInlineBlock fileItem-text operate">
			<i @click="cancelShare(file,index)" class=" layui-icon layui-icon-close"></i>
		</div>
		<div v-else class="divInlineBlock fileItem-text operate">
			<i @click="reThisName(index)" class=" layui-icon layui-icon-edit" title="重命名"></i>
			<a :href="'http://localhost:8081/download?fid='+file.fId"> <i title="下载" class=" layui-icon layui-icon-download-circle"></i> </a>
			<i title="移动" @click="chooseTarget(file.fId,'remove',index)" class="layui-icon layui-icon-return"></i>
			<i title="复制" @click="chooseTarget(file.fId,'copy')" class="layui-icon layui-icon-template"></i>
			<i title="删除" @click="deleteFile()" class="layui-icon layui-icon-close"></i>
		</div>
	</td>
	<td>{{fileSize}}</td>
	<td>{{timestampToDate(file.fCreateTime)}}</td>
</tr> 

	
	
</template>

<script>
	import {mapActions,mapGetters} from 'vuex'
	import Pubsub from 'pubsub-js'
	import DateUtil from '../util/DateUtil'
	import axios from 'axios'
	
	export default {
		data() {
			return {
					newDirName:this.file.fName,
			};
		},
		methods:{
			...mapActions(['reThisName','confirmReName','cancelReName','getFileList','deleteFileInCList','getShareList']),
			confirmReName2(){
				//index,newDirName
				if(this.newDirName==""){
					layer.msg("新文件名不正确");
					return ;
				}
				var obj = {
					index:this.index,
					fileName:this.newDirName,
					fid:this.file.fId
					
				}
				this.confirmReName(obj);
				this.newDirName="";
			},
			toView(fid){
			
				var cate = this.file.fCate;
				
				if(cate == 2 ){
					window.open("http://localhost:8081/file/3cf571d4cf2a4c4b2df823a27852a7d5.mp4", "_blank"); //注意第二个参数
					return ;	
				}
				
			/* 	if(cate == 3 ){
					//window.open("http://localhost:8081/file/3cf571d4cf2a4c4b2df823a27852a7d5.mp4", "_blank"); //注意第二个参数
					alert(123);
					return ;	
				} */
				
				let url = 'http://localhost:8081/viewpdf/' + fid;  // 有效 服务器配置跨域处理
				if(cate == 5)
					url = '/static/pdf/web/viewer.html?file=' + url;
					
					
				Pubsub.publish('showView',{title:'预览',cate:cate,url:url,file:this.file});
			},
			chooseTarget(fid,type,index){
				var obj={
					fids:[fid],
					type:type,
					index:index
				}
				Pubsub.publish('showTree',obj)
			},
			deleteFile(){
				//console.log(this.file);
				if(confirm("确定删除 " + this.file.fName +" 吗")){
					 this.deleteFileInCList(this.index);
				}
			},
			timestampToDate(time){
				//console.log(DateUtil);
				return DateUtil.timestampToDate(time);
			},
			cancelShare(file,index){
				var sid = file.sId;
				let param = new URLSearchParams()
				param.append('sid', sid)
				param.append('token', this.cToken)
					axios.post("http://localhost:8081/cancelshare", param).then((res) => { // 调用接口
					  console.log(res.data);
					  this.getShareList();
					  layer.msg("取消成功");
					}).catch((e)=>{
						layer.msg("取消失败");
					})
			}
		},
		props:['file','index'],
		computed:{
			...mapGetters(['cToken']),
			iconClass(){
				let cate = this.file.fCate;
				if(cate == 10)
					return 'dir-small';
				if(cate == 1)	
					return 'fileicon-small-pic';
				if(cate == 2)	
					return 'fileicon-small-video';
				if(cate == 3)	
					return 'fileicon-small-mp3';
				if(cate == 4)	
					return 'fileicon-small-zip';
				if(cate == 5)	
					return 'fileicon-small-txt';
					
				return 'default-small';
			},
			fileSize(){
				let size = this.file.fSize;
				if(size == 0){
					return '-'
				}
				if(size < 1024){
					return  size + "B";
				}
				
				if(size < 1024 * 1024) {
					var num = size / 1024;
					num = num.toFixed(2);
					return  num + 'KB'
				}
				
				if(size < 1024 * 1024 *1024){
					var num = size / 1024 / 1024;
					num = num.toFixed(2);
					return num + 'M'
				}
			}
		}
		
	}
</script>

<style>
	
	.divInlineBlock {
		display: inline-block;
	}


	input[type="checkbox"] {
		width: 13px;
		height: 13px;
		display: inline-block;
		text-align: center;
		line-height: 18px;
		position: relative;
		top: 0px;
	}

	input[type="checkbox"]::before {
		content: "";
		position: absolute;
		top: 0px;
		left: 0px;
		background: #fff;
		width: 100%;
		height: 100%;
		border: 1px solid #d9d9d9
	}

	input[type="checkbox"]:checked::before {
		content: "\2713";
		background-color: #fff;
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		border: 1px solid #d9d9d9;
		color: #09AAFF;
		font-size: 16px;
		font-weight: bold;
	}
	.dir-small{
		background-position:-594px -862px;
	}
	
	.fileicon-small-txt{
		background-position:-596px -102px;
	}
	
	.fileicon-small-video{
		background-position:-596px -1630px;
	}
	
	.fileicon-small-mp3{
		background-position:-596px -442px;
	}
	
	.fileicon-small-zip{
		background-position:-596px -1664px;
	}
	
	.fileicon-small-pic{
		background-position:-596px -306px;
	}
	
	.default-small{
		background-position:-596px -566px;
	}


	.fileIcon {
			margin-left: 15px;
			height: 26px;
			width: 26px;
			position: absolute;
			top: 20;
			background-image: url(../assets/icons_z_6ae3d28.png);
	}
	
	.fileItem-text{
		font-size: 13px;
		margin-top: 3px;
	}
	
	.fileName{
		margin-left: 60px;
		width: 50%;
		overflow-x: hidden;
	}
	
	.fileName a:hover{
		color: #0000FF;
		text-decoration: underline;
		cursor: pointer;
	}
	
	 tr :hover .operate{
		 visibility: visible ;
	 }
	
	.operate{
		visibility: hidden ;
		float: right;
		margin-right: 50px;
	}
	
	.operate i{
		font-size: 18px;
		cursor: pointer;
	}
	
	 
	
	.fileSize{
		text-align: right;
	}
	
	.time{
	}
	
	.inputDirName2{
		background-color: #fff;
		z-index: 10000;
	}
	
	.inputDirNameInput{
		//border: 1px solid #C3EAFF;
		height: 20px;
	}
	
	.inputDirName2 i{
		font-size: 15px;
		color: #09AAFF;
		border: solid 1px ;
		padding: 3px;
		cursor:pointer;
		border-radius: 3px 3px;
	}
	
</style>
