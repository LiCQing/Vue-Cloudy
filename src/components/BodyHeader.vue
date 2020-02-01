<template>
   <div style="margin-left: 15px;">
	   <div style="line-height: 70px;height: 70px;">
			 <button @click="changeIsShow(true)" class="layui-btn layui-btn-normal">上传文件</button>
				<button v-show="currentCate == -1 " class="layui-btn layui-btn-primary" @click="addNewDir">新建文件夹</button>
			<span class="layui-btn-group" v-if="selectCount > 0">
				<button @click="share" class="layui-btn layui-btn-primary" >分享</button>
				<button @click="downBat" class="layui-btn layui-btn-primary" >下载</button>
				<button @click="batDel" class="layui-btn layui-btn-primary" >删除</button>
				<button @click="batCopy" class="layui-btn layui-btn-primary" >复制到</button>
				<button @click="batRemove" class="layui-btn layui-btn-primary" >移动到</button>
			</span>
		</div>
		
		<fieldset class="layui-elem-field layui-field-title" >
			<legend v-if="this.currentCate != -2"> 
				{{getTitle}} / 共加载{{totalFile}}个文件
			</legend>
			
			<legend v-else>  
				{{getTitle}} 
			</legend>
			
		</fieldset>  
		
		
		<div v-show="this.currentCate == -1" class="layui-breadcrumb" style="display: block;">
				<div v-if="dirList.length > 1"> 
					<span class="dir"><a @click="backDir(dirList)">返回上一级 </a></span>
					<span>|</span>
					<span class="dir" v-for="(dir,index) in dirList" :key="index">
								<span v-if="index < dirList.length - 1">
									<a @click="changeDir({dirList:dirList,index:index})"> {{dir.fName}} </a>
									>
								</span>
								<span v-else>
										{{dir.fName}}
								</span>
					</span>
				</div>
				<div v-else>
						<span>
							全部文件
						</span>
				</div>
		</div>
	
	<div v-if="isInput" class="inputDirName">
		 <input v-model="newDirName"/>
			 <i @click="confirmNewDir2" class="layui-icon layui-icon-ok"/>
			 <i @click="cancelNewDir" class="layui-icon layui-icon-close"/>
	</div>
	</div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex'
	import axios from 'axios'
	import Pubsub from 'pubsub-js'
	
	export default {
		data() {
			return {
				newDirName:'',
				shareShow:false,
			};
		},
		computed:{
			...mapGetters(['cToken','clist','totalFile','selectCount','isInput','hasName','dirList','currentCate'])
			,getTitle(){
				if(this.currentCate==-1){
					return "全部文件";
				}
				if(this.currentCate==1){
					return "全部图片";
				}
				if(this.currentCate==2){
					return "全部视频";
				}
				if(this.currentCate==4){
					return "全部压缩包";
				}
				if(this.currentCate==3){
					return "全部音乐";
				}
				if(this.currentCate==9){
					return "其他文件";
				}
				if(this.currentCate==-2){
					return "我的分享";
				}
			}
		},
		methods:{
			...mapActions(['addNewDir','confirmNewDir','cancelNewDir','changeDir','backDir','changeIsShow','batDeleteFileInCList']),
			confirmNewDir2(){
					if(this.newDirName == ""){
						 layer.msg("文件夹名不正确");
						 return;
					}
					this.confirmNewDir(this.newDirName);
					this.newDirName = "";
			},
			getparam(){
				let param = new URLSearchParams();
				param.append('token', this.cToken);
				this.clist.forEach(file=>{
					if(file.isCheck){
						param.append('fid', file.fId);
					}
				})
				return param;
			},
			share(){
				console.log("-----share -----");
				var param = this.getparam();
				axios.post("http://localhost:8081/saveshare",param).then(res=>{
					var obj ={
						sid:res.data.data
					}
					Pubsub.publish('share',obj)
				 })
			},
			downBat(){
				console.log("-----downbat -----");
				let fidStr = "";
				let fileanme = "";
				
				this.clist.forEach(file=>{
					if(file.isCheck){
						fidStr += 'fid='+file.fId+'&';
						fileanme += file.fName;
					}
				})
				window.location.href="http://localhost:8081/downloacbat?" + fidStr +"fileName=【批量下载】" + fileanme + "等多个文件" 
			},
			batDel(){
				if(confirm("确定批量删除")){
					this.batDeleteFileInCList();
				}
			},
			batCopy(){
				var obj={
					fids:[],
					type:"batCopy"
				}
				Pubsub.publish('showTree',obj)
			},
			batRemove(){
				var obj={
					fids:[],
					type:"batRemove"
				}
				Pubsub.publish('showTree',obj)
			}
		}
	}
</script>

<style>
	
	.inputDirName{
		position: fixed;
		left: 310px;
		top: 255px;
		background-color: #fff;
		z-index: 99999;
	}
	
	.inputDirName input{
		border: 1px solid #C3EAFF;
		height: 24px;
	}
	
	.inputDirName i{
		font-size: 15px;
		color: #09AAFF;
		border: solid 1px ;
		padding: 3px;
		cursor:pointer;
		border-radius: 3px 3px;
	}
	
	.dir a{
		color: #0000FF;
		cursor: pointer;
	}
	

</style>
