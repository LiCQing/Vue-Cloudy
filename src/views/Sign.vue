<template>
	<div>
		<div class="signBody layui-card">
			<div class="layui-card-header">
				<p>快速注册</p>
			</div>
			<div class="layui-card-body">
				<div class="layui-form">
					<div class="layui-form-item">
						<label class="layui-form-label">手机号</label>
						<div class="layui-input-block">
							<input type="text" v-model="phone" placeholder="请输入手机号" lay-verify="required|phone" class="layui-input">
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
						<label class="layui-form-label">密码</label>
						<div class="layui-input-block">
							<input type="password" v-model="pwd" placeholder="请输入密码" class="layui-input">
						</div>
					</div>

					<div class="layui-form-item">
						<label class="layui-form-label">确认密码</label>
						<div class="layui-input-block">
							<input id="pwd2" :class="pwdIsOk==0?'waring':''" type="password" v-model="pwd2" placeholder="请输入密码" class="layui-input">
						</div>
					</div>

					<div class="layui-form-item">
						<div class="layui-input-block">
							<button @click="register" class="layui-btn" :class="infoIsOk?'':'layui-btn-disabled'">立即提交</button>
							 <a @click="toLogin" class="rightButton" style="color: #009688;" >已有账号,前往登陆</a> 
							<!-- <router-link to="/login"  class="rightButton">已有账号,前往登陆</router-link> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	
	import Pubsub from 'pubsub-js'
	import axios from 'axios'
	var SERVER = "http://localhost:8081/"
	export default {
		data() {
			return {
				phone: "",
				pwd: "",
				pwd2: "",
				code: "",
				sendTag: 0, //获取验证码倒计时
				content:"获取验证码",
				pwdIsOk:1,  //1是不检测 2 是相同 0是不相同
				regStatus:false,
				token:'',
			};
		},
		methods: {
			getCode() {
				//异步调取验证码
				axios.get(SERVER+'phoneCode',).then(res=>{
					this.token = res.data.data;
					layer.msg('发送成功');
				});
				
				if(this.sendTag > 0) return ;
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
			register(){
				if(this.regStatus || !this.infoIsOk){
					return ;
				}
				this.regStatus =true;
				let param = new URLSearchParams()
				param.append('token', this.token)
				param.append('code', this.code)
				axios.post(SERVER+"checkPhoneCode",param).then(res=>{
				  if(res.data.data){
						let param = new URLSearchParams()
						param.append('phone', this.phone)
						param.append('pwd', this.pwd)
						axios.post(SERVER+"register",param).then(res=>{
								  if(res.data.data){
											layer.msg("注册成功，即将跳往登陆页面");
											setTimeout(()=>{
												this.toLogin();
											},1000);
										
									}
							});
					}else{
						layer.msg("验证码错误");
					}
					
					
				});
				//校验注册码
				
				//提交注册
				
				//alert("register");
			},
			toLogin(){
				Pubsub.publish('chengeRouter',"/login");
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
			infoIsOk(){
				if(this.phoneIsOk && this.pwdIsOk == 2 && this.token != ""){
					return true;
				}else{
					return false;
				}
					
			}
			
		},
		watch:{
			pwd2:{
				handler: function(value){
					if(pwd2 == ""){
						this.pwdIsOk=1;
						return ;
					}
					
					 if(this.pwd.substring(0,this.pwd2.length) != this.pwd2){
						 //alert("两次密码不一致");
						 layer.tips('两次密码不一致', '#pwd2', {
						  tips: [2,'#f40d1c'],
						  time: 1000
						});
						this.pwdIsOk=0;
					 }else{
						this.pwdIsOk=2;
					 }
				}
			}
		}
	}
</script>

<style>
	.signBody {
		width: 600px;
		margin: auto;
		padding: 20px;
		margin-top: 130px;
		border: #EEE solid 1px;
		border-radius: 10px 10px;
		box-shadow: #EEE 5px 10px 20px;
	}

	.layui-card-header {
		text-align: center;
		font-size: 28px;
	}

	.rightButton {
		position: absolute;
		top: 0;
		right: 0;
		cursor: pointer;
		width: 130px;
	}
	.waring{
		border: 1px solid red;
	}
</style>
