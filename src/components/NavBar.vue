<template>
	<div class="layui-header header">
		<div class="layui-logo">假装有图标(ง •_•)ง</div>

		<!-- 头部区域（可配合layui已有的水平导航） -->
		<ul class="layui-nav layui-layout-left">
			<li class="layui-nav-item"><a href="">我的资源</a></li>
			<li class="layui-nav-item">
				<input id="searchInput" v-model="keyword" class="search" placeholder="搜索文件">
				  <a> <i @click="search" class="layui-icon layui-icon-search"></i> </a> 
			</li>
		</ul>
		<ul class="layui-nav layui-layout-right">
			<li class="layui-nav-item">
				<a href="javascript:;">
					<img src="http://t.cn/RCzsdCq" class="layui-nav-img">
					F4
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
	import {mapActions} from 'vuex'
	export default {
		data() {
			return {
				keyword:''
			};
		},
		methods:{
			...mapActions(['searchFile']),
			search(){
				this.searchFile(this.keyword);
				console.log(this.keyword);
			}
		}
	}
</script>

<style>
	.layui-header {
		box-shadow: #efefef 0px 5px 5px;
		z-index: 10000;
	}
	
	.layui-nav-item{
	}
	.layui-nav-item i{
		position: absolute;
		line-height: 35px;
		right: 0;
		bottom: 0;
		font-size: 22px;
		
	}
	
 
	.search{
		 border-top: none;
		 border-left: none;
		 border-right: none;
		 width: 250px;
		 margin-left: 60px;
		 display: block;
		
	}
</style>
