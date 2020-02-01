<template>
	<div>
		
		<table class="layui-table" lay-skin="line">
				<colgroup>
					<col width="250">
					<col width="100">
					<col width="100">
					<col width="100">
				</colgroup>
				<thead>
					<tr>
						<th  @click.self="fileSort('name')">
							<input type="checkbox" v-model="isAllCheck"/>
							<span v-if="selectCount == 0">文件名</span>
							<span v-else>已选中{{selectCount}}个文件/文件夹</span>
						</th>
						<th></th>
						<th  @click="fileSort('size')">文件大小</th>
						<th @click="fileSort('time')">修改日期</th>
					</tr> 
				</thead>
				<tbody>
						<FileItem v-for="(file,index) in clist" :index="index" :key="index" :file="file"/>
				</tbody>
		</table>
		
		 <div style="margin-top: 20px;" v-if="clist.length == 0">
			<div class="empty">
				<img src="../assets/emptyfile_intro_711933a.png" alt="">
				<div class="e-tips">
					您还没上传过文件哦，点击
					<button class="layui-btn layui-btn-normal">上传文件</button>
					开始上传文件吧
				</div>
		   </div>
		 </div>
	</div>
</template>

<script>
	import {mapGetters,mapActions} from 'vuex'
	import Pubsub from 'pubsub-js'
	import FileItem from './FileItem.vue'
	
	export default {
		data() {
			return {
				
			};
		},
		computed:{
			...mapGetters(['currentDir','clist','totalFile','selectCount']),
			isAllCheck:{
					get(){
						return this.totalFile === this.selectCount && this.totalFile>0;
					},
					set(value){
						this.checkAll(value);
					}
			}
		},
		components:{
			FileItem
		},
		methods:{
			...mapActions(['checkAll','fileSort']),
		}
	}
</script>

<style>
	.fileheader{
	  padding: 15px;
	}
	
	.option :hover{
		background-color: #daebfe;
	}
	
	.empty{
		height: 100%;
		text-align: center;
	}
	
	.e-tips{
		margin-top: 15px;
	}
</style>
