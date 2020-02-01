<template>
	<div>
		<div class="signBody">
			<div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
				<ul class="layui-tab-title">
					<li class="layui-this">快速登陆</li>
					<li>密码登陆</li>
				</ul>
				<div class="layui-tab-content" style="height: 100px;">
					
					<div class="layui-tab-item layui-show">
						<div class="layui-form">
							<div class="layui-form-item">
								<label class="layui-form-label">手机号</label>
								<div class="layui-input-block">
									<input type="text" v-model="phone" placeholder="请输入手机号" lay-verify="required|phone" class="layui-input">
								</div>
							</div>
						</div>
						
						<div class="layui-form-item">
							<label class="layui-form-label">验证码</label>
							<div class="layui-input-block">
								<input type="text" v-model="code" placeholder="请输入验证码" class="layui-input" style="padding-right: 80px;">
								<button @click="getCode" type="button" :class="phoneIsOk?'':'layui-btn-disabled'" class="layui-btn  rightButton">{{content}}</button>
							</div>
						</div>
						
						<div class="layui-form-item">
							<div class="layui-input-block">
								<button @click="quikLogin" class="layui-btn" :class="quikInfoIsOk?'':'layui-btn-disabled'">立即提交</button>
							</div>
						</div>
						
					</div>

					<!-- 密码登陆 -->
					<div class="layui-tab-item">
						 
						 	<div class="layui-form">
						 		<div class="layui-form-item">
						 			<label class="layui-form-label">手机号</label>
						 			<div class="layui-input-block">
						 				<input type="text" v-model="phone" placeholder="请输入手机号" lay-verify="required|phone" class="layui-input">
						 			</div>
						 		</div>
						 	</div>
						 	
						 	<div class="layui-form-item">
						 		<label class="layui-form-label">密码</label>
						 		<div class="layui-input-block">
						 			<input type="password" v-model="pwd" placeholder="请输入密码" class="layui-input" style="padding-right: 80px;">
						 		</div>
						 	</div>
						 	
						 	<div class="layui-form-item">
						 		<div class="layui-input-block">
						 			<button @click="pwdLogin" class="layui-btn" :class="pwdIsOk?'':'layui-btn-disabled'">立即登陆</button>
						 		</div>
						 	</div>
							

					</div>
				</div>
			</div>
			 <div style="margin-top: 50px;text-align: center;">
				<a @click="toSign">没有账号?加入我们</a>
			</div>
			
		</div>
		
	</div>
</template>

<script>
	import Pubsub from 'pubsub-js'
	import axios from 'axios'
	
	import {mapActions} from 'vuex'
	
	var SERVER = "http://localhost:8081/"
	
	
	export default {
		data() {
			return {
				phone: "",
				pwd: "",
				code: "",
				sendTag: 0, //获取验证码倒计时
				content: "获取验证码",
				regStatus: false,
				token:''
			};
		},
		methods: {
			...mapActions(['saveToken']),
			getCode() {
				//异步调取验证码
			axios.get(SERVER+'phoneCode',).then(res=>{
				this.token = res.data.data;
				layer.msg('发送成功');
			});

				if (this.sendTag > 0) return;
				this.sendTag = 5;
				//if (!this.phoneIsOk) return; //改动的是这两行代码

				this.content = this.sendTag + 's后重新发送'
				let clock = window.setInterval(() => {
					this.sendTag--
					this.content = this.sendTag + 's后重新发送'
					if (this.sendTag < 0) {
						window.clearInterval(clock)
						this.content = '重新发送验证码'
					}
				}, 1000)

			},
			pwdLogin() {

				//校验密码
				let param = new URLSearchParams()
				param.append('phone', this.phone)
				param.append('pwd', this.pwd)
				axios.post(SERVER+"login",param).then(res=>{
					this.saveToken(res.data.data);
					
					if(res.data.data){
						
						layer.msg("登陆成功，即将跳往网盘页面");
						setTimeout(()=>{
							this.toConten();
						},1000);
					//跳转路由
					}else{
						layer.msg("密码错误");
					}
					});
			 
			},
			quikLogin(){
				  //异步校验验证码
					let param = new URLSearchParams()
					param.append('token', this.token)
					param.append('code', this.code)
					param.append('phone', this.phone)
					axios.post(SERVER+"quikLogin",param).then(res=>{
						if(res.data.data){
							layer.msg("登陆成功，即将跳往网盘页面");
							setTimeout(()=>{
								this.toConten();
							},1000);
						 //跳转路由
						 
						}else{
							layer.msg("验证码错误");
						}
						});
					
			},
			toConten(){
				Pubsub.publish('chengeRouter',"/content");
			},
			toSign(){
				Pubsub.publish('chengeRouter',"/sign");
			}
		},
		computed: {
			phoneIsOk() {
				if (this.phone == "" || this.phone.length < 5 || this.sendTag > 0)
					return false;
				else {
					//异步校验

					return true;
				}
			},
			quikInfoIsOk() {
				if (this.phoneIsOk && this.code != "") {
					return true;
				} else {
					return false;
				}

			},
			pwdIsOk(){
				if (this.pwd!="" && this.phone !="") {
					return true;
				} else {
					return false;
				}
			}

		}
 
	}
</script>

<style>
	.signBody {
		width: 500px;
		margin: auto;
		padding: 20px;
		margin-top: 130px;
		border: #EEE solid 1px;
		border-radius: 10px 10px;
		box-shadow: #EEE 5px 10px 20px;
	}
 

	.rightButton {
		position: absolute;
		top: 0;
		right: 0;
		cursor: pointer;
		width: 130px;
	}

	.waring {
		border: 1px solid red;
	}

	.layui-tab-title {
		text-align: center;
	}
</style>
