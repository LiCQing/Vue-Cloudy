<template>
	
	<div>
		 <router-view></router-view>
	</div>
 
</template>

<script>

import Pubsub from 'pubsub-js'

export default {
	mounted(){
			
		//订阅消息，也就是监听事件
		Pubsub.subscribe('chengeRouter',(msg,link)=>{
				//alert("切换组件 " + link);
				this.$router.push({  //核心语句
						path:link,   //跳转的路径
						});
		});
		//发布消息触发事件
		//Pubsub.publish('deleteTodo',index);
	}
}

 

</script>

<style>
 
</style>
