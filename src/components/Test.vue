<template>
	<div>
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
		
		<div class="share-page layui-main">
			<div v-if="cList.length > 0 " class="tableBody">
				<div>
					 <div>
						<img src="../assets/share.png" />
						<div class="layui-inline" style="margin-left: 12px;">
							<h2 >{{cList[0].fName + ' 等' + cList.length + '个文件'}}</h2>
						</div>
						
					 </div>
					 <div style="margin-top: 20px;">
						 <div class="layui-inline"><i class=" layui-icon layui-icon-log" />
							{{getFileTime(share.sCreateTime)}}
						 </div>
						 <div class="layui-inline" style="margin-left: 30px;">
							 有效时间: {{share.sValidDay}} 天
						 </div>
					 </div>
				</div>
				<hr/>
				<table class="layui-table" lay-skin="line">
					<colgroup>
						<col width="200">
						<col width="50">
						<col width="80">
						<col>
					</colgroup>
					<thead>
						<tr>
							<th>
								<input type="checkbox" v-model="isAllCehck" />
								
								<div class="layui-inline" v-if="selectCount>0">
									已选择{{selectCount}}个文件
									<span class="layui-btn-group" v-if="selectCount > 0">
										<button @click="downBat" class="layui-btn layui-btn-primary s-btn" >下载</button>
										<button @click="saveInMyFile" class="layui-btn layui-btn-primary s-btn" >保存到</button>
									</span>
								</div>
								<div class="layui-inline" v-else="">文件名</div>
							</th>
							<th>大小</th>
							<th>修改时间</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(file,index) in cList">
							<td>
								<input type="checkbox" v-model="file.isCheck"/>
								<div id="icon" v-bind:class="iconClass(file.fCate)" class="layui-inline share-icon">
									
								</div>
								{{file.fName}}
							</td>
							<td>{{getFileSize(file.fSize)}}</td>
							<td>{{getFileTime(file.fCreateTime)}}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-else class="nofile">
				<img src="../assets/nofile.png" />
				<div>
					(;´༎ຶД༎ຶ`)  文件已经不见了 www
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import DateUtil from '../util/DateUtil.js'
	import { mapGetters } from 'vuex'
	
	export default {
		data() {
			return {
				shareUrl: "http://loaclhost:8080/share/132",
				sid: '',
				cList:[],
				share:{},
				isShow:false,
				dir:',',
				pid:-1,
				
			};
		},
		computed: {
			...mapGetters(['cToken']),
			selectCount(){
				return this.cList.reduce((preTotal,file)=>preTotal +(file.isCheck?1:0),0 );
			},
			isAllCehck:{
				get(){
					return this.totalFile === this.selectCount && this.totalFile>0;
				},
				set(value){
					//this.checkAll(value);
					this.cList.forEach((file)=>{file.isCheck = value})
				}
			},
			totalFile(){
				return this.cList.length;
			}
		},
		methods: {
			copyUrl() {
				var Url2 = document.getElementById("shareId");
				Url2.select(); // 选择对象
				console.log(Url2);
				document.execCommand("Copy");
				layer.msg("已复制，快分享给朋友吧");
			},
			getUrlKey(name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1]
					.replace(/\+/g, '%20')) || null
			},
			getFileTime(time){
				//console.log(DateUtil);
				return DateUtil.timestampToDate(time);
			},
			getFileSize(size){
				if(size == 0){
					return '-'
				}
				if(size < 1024){
					return  size + "B";
				}
				
				if(size < 1024 * 1024) {
					var num = size / 1024;
					num = num.toFixed(2);
					return  num + 'KB'
				}
				
				if(size < 1024 * 1024 *1024){
					var num = size / 1024 / 1024;
					num = num.toFixed(2);
					return num + 'M'
				}
			},
			iconClass(cate){
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
			downBat(){
				console.log("-----downbat -----");
				let fidStr = "";
				let fileanme = "";
				
				this.cList.forEach(file=>{
					if(file.isCheck){
						fidStr += 'fid='+file.fId+'&';
						fileanme += file.fName;
					}
				})
				window.location.href="http://localhost:8081/downloacbat?" + fidStr +"fileName=【批量下载】" + fileanme + "等多个文件" 
			},
			saveInMyFile(){
				var _this = this;
				this.isShow = true;
				let param = new URLSearchParams()
				param.append('token', this.cToken);
				axios.post('http://localhost:8081/getDirTree',param).then(res=>{
					layer.open({
						type: 1,
						title :'选择目标路径',
						area:["500px","400px"],
						content: $('#target'),
						end:()=>{
						this.isShow =false;
						},//这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
					});
					
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
			},
			sure(){
				let param = new URLSearchParams()
				param.append('token', this.cToken);
				param.append('pId',this.pid );
				this.cList.forEach(file=>{
					if(file.isCheck){
						param.append('fId', file.fId)
					}
				})
				axios.post("http://localhost:8081/" + 'copy' , param).then(res=>{
					layer.msg("保存成功");
				//	commit('batDelFileInCList');
				}); 
				setTimeout(layer.closeAll(),2000);
			}
		},
		created() {
			this.sid = this.getUrlKey('sid');
			let param = new URLSearchParams();
			param.append('token', this.cToken);
			param.append('sid', this.sid);
			axios.post('http://localhost:8081/lookshare', param).then(res => {
				this.cList = res.data.data.list.map((obj,index)=>{
				 					obj.isCheck=false;
									obj.isReName=false;
				 					return obj;
				 	});
				this.share = res.data.data.share;
			});
		},
	}
</script>

<style>
	.share-page{
		margin-top: 30px;
		border: 1px solid #eee;
		padding: 15px;
		border-radius: 10px;
		box-shadow: 5px 5px 15px #efefef;
	}
	
	.nofile{
		text-align: center;
	}
	
	.share-icon{
		height: 26px;
		width: 26px;
		 background-image: url(../../dist/static/img/icons_z_6ae3d28.6ae3d28.png);
	}
	
	.bg-icon{
		vertical-align:inherit;
		background-image: url(../assets/share.png);
	}
	
	.dir-small{
		background-position:-594px -862px;
	}
	
	.fileicon-small-txt{
		background-position:-596px -102px;
	}
	
	.fileicon-small-video{
		background-position:-596px -1630px;
	}
	
	.fileicon-small-mp3{
		background-position:-596px -442px;
	}
	
	.fileicon-small-zip{
		background-position:-596px -1664px;
	}
	
	.fileicon-small-pic{
		background-position:-596px -306px;
	}
	
	.default-small{
		background-position:-596px -566px;
	}
	
	.s-btn{
		height: 20px;
		line-height: 20px;
	}

</style>
