<template>
	<div class="layui-side ">
		<div class="layui-side-scroll">
			<!-- 左侧导航区域（可配合layui已有的垂直导航） -->
			<ul class="layui-nav layui-nav-tree" lay-filter="test">
				<li @click="body" class="layui-nav-item"><a href="javascript:void(0);">全部文件</a></li>
				<li @click="Cate(1)" class="layui-nav-item"><a href="javascript:void(0);">图片</a></li>
				<li @click="Cate(2)" class="layui-nav-item"><a href="javascript:void(0);">视频</a></li>
				<li @click="Cate(4)" class="layui-nav-item"><a href="javascript:void(0);">压缩包</a></li>
				<li @click="Cate(3)" class="layui-nav-item"><a href="javascript:void(0);">音乐</a></li>
				<li @click="Cate(9)" class="layui-nav-item"><a href="javascript:void(0);">其他</a></li>
				<li @click="Cate(-1,'share')" class="layui-nav-item"><a href="javascript:void(0);">我的分享</a></li>
				<li @click="rcycle" class="layui-nav-item"><a href="javascript:void(0);">回收站</a></li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Pubsub from 'pubsub-js'
	import {mapActions} from 'vuex'
	
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			...mapActions(['changeCate','getFileCateList','getFileList','getShareList']),
			rcycle(){
				Pubsub.publish('chengeBody',"Rcycle");
			},
			body(){
				this.getFileList({fId:0,fName:"我的网盘"});
				Pubsub.publish('chengeBody',"Body");
			},
			Cate(cateId,type){
				
				if(type==='share'){
					this.getShareList();
				}else{
					this.changeCate(cateId)
					this.getFileCateList(cateId);
				}
				Pubsub.publish('chengeBody',"Body");
			}
		}
	}
</script>

<style>
	.layui-nav{
		height: 100%;
	}
	
	.layui-nav-tree{
		padding-top: 16px;
	}
	
	.layui-nav-item a{
		color: #666;
		font-size: 16px;
	}
	
	
	

</style>
