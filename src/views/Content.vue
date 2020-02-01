<template>
	<div>
		<div class="layui-layout-body">
			<div class="layui-layout layui-layout-admin">
				<nav-bar></nav-bar>
				<Category />
				<div :is="currentView"></div>
			</div>
		</div>
		<Uploader />
	</div>
</template>

<script>
	import NavBar from '../components/NavBar.vue'
	import Category from '../components/Category.vue'
	import Body from '../components/Body.vue'
	import Uploader from '../components/Uploader.vue'
	import Rcycle from '../components/cate/Rcycle.vue'
	import Cate from '../components/cate/Cate.vue'
	
	import Pubsub from 'pubsub-js'

	export default {
		data() {
			return {
				currentView: 'Body' // 默认选中第一项
			};
		},
		components: {
			NavBar,
			Category,
			Body,
			Uploader,
			Rcycle,
			Cate
		},
		mounted(){
			Pubsub.subscribe('chengeBody',(msg,bodyName)=>{
				this.currentView = bodyName;
			});
		}
		
	}
</script>

<style>

</style>
