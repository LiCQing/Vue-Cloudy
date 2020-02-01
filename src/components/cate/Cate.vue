<template>
	<div  class="layui-body">
		<div  class="layui-row tips"> 
			
		</div>
		<div class="info">图片</div>
		<div class="r-header">
			<input type="checkbox" />选择1
		</div>
		<div>
			 <div v-for="(file,index) in cList" class="fileItem">
			 	<div style="padding: 15px;">
			 		<div class=" layui-col-md7">
			 			<div class="divInlineBlock checkBox" >
			 				<input type="checkbox" v-model="file.isCheck" />
			 			</div>
			 			<div v-bind:class="iconClass"  class="divInlineBlock fileIcon "></div>
			 			<div class="divInlineBlock fileItem-text fileName ">
							{{file.fName}}
			 			</div>
			 			<div class="divInlineBlock fileItem-text operate">
			 				<i   class=" layui-icon layui-icon-edit"></i>
			 			</div>
			 		</div>
			 		<div class="divInlineBlock fileItem-text layui-col-md2">{{file.fSize==0?'-':file.fSize/1000+'M'}}</div>
			 		<div class="divInlineBlock fileItem-text time">{{timestampToDate(file.fCreateTime)}}</div>
			 	</div>
			 </div>
				<div style="margin-top: 20px;" v-if="cList.length == 0">
					<div class="empty">
						<img src="../../assets/emptyfile_intro_711933a.png" alt="">
						<div class="e-tips">
							您还没上传过文件哦，点击
							<button class="layui-btn layui-btn-normal">上传文件</button>
							开始上传文件吧
						</div>
					</div>
					</div>
			 </div>
		</div>
		
	</div>
</template>

<script>
	import axios from 'axios'
	import {mapActions,mapGetters} from 'vuex'
	import DateUtil from '../../util/DateUtil'
	export default {
		data() {
			return {
				cList:[]
			};
		},
		created(){
			let param = new URLSearchParams()
			param.append('token', this.cToken)
			param.append('cate',this.currentCate)
			axios.post("http://localhost:8081/" + 'cateList' , param).then(res=>{
				this.cList = res.data.data.map((obj,index)=>{
								obj.isCheck=false;
								return obj;
							})
			});
		},
		computed: {
			...mapGetters(['cToken','currentCate']),
				iconClass(){
					let cate = this.currentCate;
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
				}
		},
		methods:{
		 
			getRList(){
				let param = new URLSearchParams()
				param.append('token', this.cToken)
				param.append('cate',this.currentCate)
				axios.post("http://localhost:8081/" + 'cateList' , param).then(res=>{
					this.cList = res.data.data.map((obj,index)=>{
									obj.isCheck=false;
									return obj;
					})
				});
			},
			timestampToDate(time){
				return DateUtil.timestampToDate(time);
			}
			
		},
		watch:{
			currentCate(type){
				this.getRList();
			}
		}
		
		
	}
</script>

<style>
	.tips{
		height: 50px;
		line-height: 50px;
		border-bottom: #eee solid 1px;
	}
	.info{
		height: 30px;
		line-height: 30px;
	}
	.r-header{
		height: 30px;
		line-height: 30px;
	}
	.checkBox{
		height: 30px;
		line-height: 30px;
	}
	.refresh{
		transform: rotateY(180deg);
		display: inline-block;
	}
	.r-operate{
		font-size: 20px;
		cursor: pointer;
	}
	.r-cover{
		height: 28px;
		line-height: 28px;
	}

</style>
