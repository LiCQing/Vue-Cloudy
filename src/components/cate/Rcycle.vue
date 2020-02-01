<template>
	<div  class="layui-body">
		<div  class="layui-row tips"> 
				<div class="layui-col-md9">提示：回收站不占用网盘空间，文件保存10天后将被自动清除。 开通会员延长至15天， 开通超级会员延长至30天</div>
				<div class="layui-col-md3" style="text-align: right;padding-right: 50px;">
					<button @click="clearRycle" v-if="cList.length > 0" class="layui-btn layui-btn-normal">清空回收站</button>
				</div>
		</div>

		<div v-if="cList.length>0">
			<fieldset class="layui-elem-field layui-field-title" >
				<legend>回收站 / 共加载{{cList.length}}个文件</legend>
			</fieldset>  
			
			<table class="layui-table" lay-skin="line">
					<colgroup>
						<col width="250">
						<col width="100">
						<col width="100">
						<col width="100">
					</colgroup>
					<thead>
						<tr>
							<th>
								<input type="checkbox" v-model="isAllCheck"/>
								选择{{checked}}个
								<span class="layui-btn-group" v-show="checked>0" >
									<button class="layui-btn layui-btn-primary r-cover">还原</button>
									<button class="layui-btn layui-btn-primary r-cover">清除</button>
								</span>
						</th>
							<th>操作</th>
							<th>删除时间</th>
							<th>剩余有效期</th>
						</tr> 
					</thead>
					<tbody>
						<tr v-for="(file,index) in cList">
							<td>
								<div class="divInlineBlock checkBox" >
									<input type="checkbox" v-model="file.isCheck" />
								</div>
								<div :class="cClass(file)" class="divInlineBlock fileIcon dir"></div>
								<div class="divInlineBlock fileItem-text fileName ">
									{{file.fName}}
								</div>
								
							</td>
							<td>
									<div class="refresh">
										<i @click="recover(file.fId)" class="layui-icon layui-icon-refresh-1"></i>
									</div>
										<i  @click="trueDelete(index,file.fId)" class="layui-icon layui-icon-delete"> </i>
							</td>
							<td>{{timeToDate(file.fDeleteTime)}}</td>
							<td>10天</td>
						</tr>
					</tbody>
			</table>
		</div>
		<div v-else class="empty">
				<img src="../../assets/emptyfile_intro_711933a.png" alt="">
				<div>
					何でもないよ～
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
			axios.post("http://localhost:8081/" + 'rcycle' , param).then(res=>{
				this.cList = res.data.data.map((obj,index)=>{
								obj.isCheck=false;
								return obj;
							})
			});
		},
		computed: {
			...mapGetters(['cToken']),
			checked(){
				return this.cList.reduce((preTotal,file)=>preTotal +(file.isCheck?1:0),0 );
			},
			isAllCheck:{
				get(){
					return this.cList.length === this.checked && this.cList.length>0;
				},
				set(value){
					this.checkAll(value);
				}
			}
		},
		methods:{
			checkAll(value){
				this.cList.forEach(file=>{
					file.isCheck = value;
				})
			},
			recover(fid){
				let param = new URLSearchParams()
				param.append('token', this.cToken)
				param.append('fid',fid)
				axios.post("http://localhost:8081/" + 'redaction' , param).then(res=>{
					if(res.data.data){
						layer.msg("恢复成功");
					}
					this.getRList();
				});
			},
			trueDelete(index,fid){
				if(!confirm("确定清除 " + this.cList[index].fName + " 吗？（不可恢复）")){
					return ;
				}
			   let param = new URLSearchParams()
				param.append('token', this.cToken)
				param.append('fid',fid)
				axios.post("http://localhost:8081/" + 'truethDelete' , param).then(res=>{
					if(res.data.data){
						layer.msg("已清空");
					}
					this.getRList();
				}); 
			},
			
			
			getRList(){
				let param = new URLSearchParams()
				param.append('token', this.cToken)
				axios.post("http://localhost:8081/" + 'rcycle' , param).then(res=>{
					this.cList = res.data.data.map((obj,index)=>{
									obj.isCheck=false;
									return obj;
					})
				});
			},
			timeToDate(time){
				return DateUtil.timestampToDate(time);
			},
			cClass(file){
				let cate = file.fCate;
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
			},
			clearRycle(){
				if(!confirm("确定清空回收站吗？（不可恢复）")){
					return ;
				}
				let param = new URLSearchParams()
				param.append('token', this.cToken)
				this.cList.forEach(file=>{
					//if(file.isCheck){
						param.append('fid',file.fId);
					//}
				});
				//console.log(param.values);
				 axios.post("http://localhost:8081/" + 'truethDelete' , param).then(res=>{
					if(res.data.data){
						layer.msg("已清空");
					}
					this.getRList();
				}); 
			}
			
		}
		
		
	}
</script>

<style>
	th{
		height: 28px;
	}
	
	.tips{
		height: 50px;
		line-height: 50px;
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
	
	.r-empty{
		
	}

</style>
