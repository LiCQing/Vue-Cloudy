/**
 * 路由器模块
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '../views/Sign.vue'
import Login from '../views/Login.vue'
import Content from '../views/Content.vue'
import HelloWorld from '../views/HelloWorld.vue'
import Test from '../components/Test.vue'

Vue.use(VueRouter);

export default new VueRouter({
	//暴露路由
	routes:[
		{
		 path:'/sign',
		 component:Sign
		},
		{
		path:'/login',
		component:Login
		},
		{
			path:'/content',
			component:Content
		},
		{
			path:'/test',
			component:HelloWorld
		},
		{
			path:'/share',
			component:Test
		},
		/* {
			path:'/home',
			component:Home,
			children:[
				{
					path:'news',
					component:News
				},
				{
					path:'message',
					component:Message
				},
				{
					path:'',
					redirect:'/home/news'
				}
			]
		}, */
		{
			path:'/',
			redirect:'/sign'
		}
	]
	
})