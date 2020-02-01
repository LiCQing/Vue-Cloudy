<template>
	<div>
		<div v-show="shareShow"  id="share">
			<div>
				<input id="shareId"  v-model="shareUrl" class="layui-input"/>
			</div>
			
			 <button @click="copyUrl" class="layui-btn layui-btn-primary">复制链接</button>
			 <button @click="openShare" class="layui-btn layui-btn-primary">打开分享</button>
		</div>
		
		<div v-show="isShow" id="target">
			<div class="targetPath">
				目标路径:
				<span>{{dir}}</span>
			</div>
			<div class="tree">
				<div id="tree"></div>
				<div id="">
					<button  class="layui-btn layui-btn-normal removeBtn" @click="sure">确定</button>
				</div>
			</div>
		</div>
		
		<div v-show="showView" id="viewArea">
			 
			
			
			<!-- 图片文件 -->
			<div class="view-img" v-if="viewObj.cate == 1">
				<img  :src="viewObj.url"/>
			</div>
			
			<!-- 视频文件 -->
			 <div class="view-mp4" v-show="viewObj.cate == 2">
			  <!-- <video :src="viewObj.url"> </video> -->
			 <!-- <video src="blob:https://www.bilibili.com/9bfb1d5e-a1e0-4aed-ae99-34c47a3fe724"></video> -->
			</div> 
			
			<!--pdf 或者其他转pdf的文档 -->
			<iframe v-if="viewObj.cate == 5" name = 'viewFrame' :src="viewObj.url" frameborder="0">
			</iframe>
			
			
		</div>
		<!-- 音乐预览 -->
		<div class="music" v-if="showMusic">
				<i @click="closeMusic"  class="layui-icon layui-icon-close close-music"></i>
					<audio :src="viewObj.url" controls="controls" autoplay="autoplay">
					Your browser does not support the audio element.
					</audio>
		</div>
		
		<div class="layui-body">
			<BodyHeader></BodyHeader>
			<BodyFileList></BodyFileList>
		</div>
		
	</div>
	
</template>

<script>
	
	/**
	 * if(cate == 5)
						url = '/static/pdf/web/viewer.html?file=' + url;
						//window.open('/static/pdf/web/viewer.html?file=' + url)
					/* if(cate == 1) //图片
					if(cate == 2) //视频
					if(cate==3) //音乐 */
	
	import BodyHeader from './BodyHeader.vue'
	import BodyFileList from './BodyFileList.vue'
	import Pubsub from 'pubsub-js'
	import axios from 'axios'
	import {mapActions,mapGetters} from 'vuex'
	 
	export default {
		data() {
			return {
				treeDirData:[{title:'我的网盘',
						fid:0,
						url:'\\',
						children:[{
											title: '图片',
											url:'\\图片\\'
											,fid: 1
										  } ]}],
				dir:'',
				pid:0,
				fid:[],
				isShow:false,
				url:'',
				showView:false,
				viewObj:{},
				type:'',
				shareShow:false,
				shareUrl:"http://localhost:8080/#/share/",
				index:0,
				showMusic:false,
				}
		},
		components:{
			BodyHeader,BodyFileList
		},
		created(){
			this.$store.dispatch('getFileList',{fId:0,fName:"我的网盘"});
			//订阅消息，也就是监听事件
			Pubsub.subscribe('showTree',(msg,obj)=>{
				console.log(obj);
				this.type = obj.type;
				this.isShow = true;
				this.fid = obj.fids;
				this.index = obj.index;
				layer.open({
				  type: 1,
				  title :'选择目标路径',
				  area:["500px","400px"],
				  content: $('#target'),
				   end:()=>{
				   this.isShow =false;
				   },//这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
				});
			var _this = this;
			
			let param = new URLSearchParams()
			param.append('token', this.cToken);
			
			axios.post('http://localhost:8081/getDirTree',param).then(res=>{
				
					layui.use(['tree'], function(){
							var tree = layui.tree;
								//常规用法
							tree.render({
								elem: '#tree' ,//默认是点击节点可进行收缩
								data:res.data.data,
								onlyIconControl: true,
								click: function(obj){
									_this.dir = obj.data.url;
									_this.pid = obj.data.fid;
								}
							});
					})
				});
			
			});
			
			//预览
			Pubsub.subscribe('showView',(msg,obj)=>{
				this.viewObj = obj;
				console.log(obj);
				if(obj.cate == 3 ){
					this.showMusic = true;
					return ;
				}
				this.showView =true;
				layer.open({
					type: 1,
					title :obj.title,
					area:["820px","550px"],
					content: $('#viewArea') ,
					end:()=>{
						this.showView =false;
					},
				});
				
			});
			
			//分享成功
			Pubsub.subscribe('share',(msg,obj)=>{
				this.shareShow =true;
				this.shareUrl += obj.sid;
				layer.open({
						type: 1,
						title :'分享成功',
						area:["500px","400px"],
						content: $('#share'),
						end:()=>{
							 this.shareShow=false;
						},
				});
			});
			
		},
		methods:{
			...mapActions(['remove','copy','batCopy','batRemove']),
			sure(){
				
				if(this.type == "copy"){
					console.log('复制');
					this.copy({
						fid:this.fid,
						pid:this.pid
					})
					return ;
				}else if(this.type == "batCopy"){
					this.batCopy(this.pid);
				}else if(this.type == "batRemove"){
					this.batRemove(this.pid);
				}else{
					this.remove({
						fid:this.fid,
						pid:this.pid,
						index:this.index
					})
				}
				
				 this.isShow = false;
				 setTimeout(layer.closeAll(),2000);
			},
			copyUrl(){
				var Url2=document.getElementById("shareId");
				Url2.select(); // 选择对象
				document.execCommand("Copy");
				layer.msg("已复制，快分享给朋友吧");
			},
			openShare(){
				window.open(this.shareUrl,"_blank");    
			},
			closeMusic(){
				this.showMusic=false;
			}
		},
		computed:{
			...mapGetters(['cToken']),
		}
	
	}
</script>

<style >
	.targetPath{
		line-height: 30px;
		height: 30px;
		font-size: 16px;
		padding: 5px;
	}
	
	.layui-body{
		padding-left: 16px;
		font-size: 13px;
	}
	
	#target{
		width: 500px;
		height: 300px;
	}
	
	.tree{
		color: #000;
	}	
	
	.removeBtn{
		margin-top: 20px;
		width: 100%;
	}
	
	#viewArea{
		width: 800px;
		height: 500px;
	}
	
	#viewArea iframe{
		width: 800px;
		height: 500px;
	}
	
	#viewArea iframe img{
		
	}
	
	.view-img{
		text-align: center;
	}
	
	img{
		max-width: 750px;
	}
	
	.music{
		position: fixed;
		z-index: 9999999;
		bottom: 0px;
		left: 0px;
	}
	
	.close-music{
		position: absolute;
		z-index: 9999999;
		top: 0px;
		right: 0px;
		background-color: #FF5722;
		border-radius: 10px 10px;
	}
	
	
</style>
