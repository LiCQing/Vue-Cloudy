<template>
	<div  v-show="isShow">
		
		<uploader ref="uploader" 
		:options="options" 
		:autoStart="false" 
		class="uploader-example" 
		@file-added="onFileAdded" 
		@file-success="onFileSuccess"
		 @file-progress="onFileProgress" 
		 @file-error="onFileError" 
		 style="position: fixed;">
		 
		 <div class="closePanel">
		   <button @click="changeIsShow(false)" class="layui-btn layui-btn-radius layui-btn-danger">关闭</button>  
			<!-- <button @click="changeIsShow" class="layui-btn layui-btn-radius layui-btn-danger">关闭</button> -->
		 </div>
		 
			<uploader-unsupport></uploader-unsupport>
			<uploader-drop>
				<uploader-btn>选择文件</uploader-btn>
				<uploader-btn :directory="true">选择文件夹</uploader-btn>
			</uploader-drop>
			<uploader-list>
				
			</uploader-list>

		</uploader>

	</div>
</template>

<script>
	  import SparkMD5 from 'spark-md5';
	  import {mapGetters,mapActions} from 'vuex'
	  
	export default {
		data() {
			return {
				//初始化参数
				options: {
					target: '//localhost:8081/upload',
					//chunkSize: '204800', //分块大小 默认1024 * 1024
					fileParameterName: 'file', //上传文件时文件的参数名，默认file
					maxChunkRetries: 3, //最大自动失败重试上传次数
					testChunks: true, //是否开启服务器分片校验
					// 服务器分片校验函数，秒传及断点续传基础 ， 分片校验的回调函数
					 	checkChunkUploadedByResponse: function(chunk, message) {
							let objMessage = JSON.parse(message);
							var data = eval("(" +objMessage.data + ")");
							console.log(data);
							if (data.skipUpload) {
								return true;
							}else{
								if(data.has){ // 判断分块
									console.log(data.missChunk);
								}
								return false;
							}
						},  
					headers: {
						// 在header中添加的验证，请根据实际业务来
						//Authorization: "Bearer " + Ticket.get().access_token
					},
				},
				attrs: {
					accept: 'image/*'
				},
				showFileList: true,
				
			}
		},
		 computed: {
            //Uploader实例
            uploader() {
                return this.$refs.uploader.uploader;
            },
			...mapGetters(['currentDir','isShow','cToken']),
        },
		methods: {
			...mapActions(['changeIsShow','savaTest','reGetFileList']),
			onFileAdded(file) {
				this.panelShow = true;
				this.computeMD5(file);
				console.log("添加文件");
				/* Bus.$emit('fileAdded'); */
			},
			
			onFileProgress(rootFile, file, chunk) {
				console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
			},
			
			onFileSuccess(rootFile, file, response, chunk) {
				console.log("上傳成功");
				console.log(rootFile);
				console.log(file);
				console.log(response);
				console.log(chunk);
				this.reGetFileList();
				return ;
				let res = JSON.parse(response);

				// 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
				if (!res.result) {
					this.$message({
						message: res.message,
						type: 'error'
					});
					// 文件状态设为“失败”
					this.statusSet(file.id, 'failed');
					return
				}

				// 如果服务端返回需要合并
				if (res.needMerge) {
					// 文件状态设为“合并中”
					this.statusSet(file.id, 'merging');

					api.mergeSimpleUpload({
						tempName: res.tempName,
						fileName: file.name,
						...this.params,
					}).then(res => {
						// 文件合并成功
						//Bus.$emit('fileSuccess');
						console.log("合并文件");

						this.statusRemove(file.id);
					}).catch(e => {});

					// 不需要合并
				} else {
					//Bus.$emit('fileSuccess');
					console.log('上传成功');
				}
			},
			onFileError(rootFile, file, response, chunk) {
				this.$message({
					message: response,
					type: 'error'
				})
			},

			/**
			 * 计算md5，实现断点续传及秒传
			 * @param file
			 */
			computeMD5(file) {
				let fileReader = new FileReader();
				let time = new Date().getTime();
				let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
				let currentChunk = 0;
				const chunkSize = 10 * 1024 * 1000;
				let chunks = Math.ceil(file.size / chunkSize);
				let spark = new SparkMD5.ArrayBuffer();

				// 文件状态设为"计算MD5"
				this.statusSet(file.id, 'md5');
				file.pause();

				loadNext();

				fileReader.onload = (e => {
					spark.append(e.target.result);

					if (currentChunk < chunks) {
						currentChunk++;
						loadNext();
						// 实时展示MD5的计算进度
						this.$nextTick(() => {
							$(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
						})
					} else {
						let md5 = spark.end();
						this.computeMD5Success(md5, file);
						console.log(
							`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
					}
				});

				fileReader.onerror = function() {
					this.error(`文件${file.name}读取出错，请检查该文件`)
					file.cancel();
				};

				function loadNext() {
					let start = currentChunk * chunkSize;
					let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

					fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
				}
			},
			
			
			computeMD5Success(md5, file) {
				var _this = this ;
				console.log(_this.cToken);
				// 将自定义参数直接加载uploader实例的opts上
				//上传用的自定义参数
				Object.assign(this.uploader.opts, {
					query: {
						...this.params,
						token:_this.cToken,
						pId:_this.currentDir,
					}
				})

				file.uniqueIdentifier = md5;
				//file.resume();
				this.statusRemove(file.id);
			},

			fileListShow() {
				let $list = $('#global-uploader .file-list');

				if ($list.is(':visible')) {
					$list.slideUp();
					this.collapse = true;
				} else {
					$list.slideDown();
					this.collapse = false;
				}
			},
			close() {
				this.uploader.cancel();

				this.panelShow = false;
			},

			/**
			 * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
			 * @param id
			 * @param status
			 */
			statusSet(id, status) {
				let statusMap = {
					md5: {
						text: '校验MD5',
						bgc: '#fff'
					},
					merging: {
						text: '合并中',
						bgc: '#e2eeff'
					},
					transcoding: {
						text: '转码中',
						bgc: '#e2eeff'
					},
					failed: {
						text: '上传失败',
						bgc: '#e2eeff'
					}
				}

				this.$nextTick(() => {
					$(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
						'position': 'absolute',
						'top': '0',
						'left': '0',
						'right': '0',
						'bottom': '0',
						'zIndex': '1',
						'backgroundColor': statusMap[status].bgc
					}).text(statusMap[status].text);
				})
			},
			statusRemove(id) {
				this.$nextTick(() => {
					$(`.myStatus_${id}`).remove();
				})
			},

			error(msg) {
				this.$notify({
					title: '错误',
					message: msg,
					type: 'error',
					duration: 2000
				})
			}
		},
		watch: {},
		destroyed() {
			//Bus.$off('openUploader');
			console.log("destroyed");
		},
		components: {}
	}
</script>

<style>
	.uploader-example {
		position: fixed;
		z-index: 10000;
		width: 600px;
		padding: 15px;
		font-size: 12px;
		bottom: 10px;
		right: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .4);
		background-color: #FFF;
	}

	.uploader-example .uploader-btn {
		margin-right: 4px;
	}

	.uploader-example .uploader-list {
		max-height: 440px;
		overflow: auto;
		overflow-x: hidden;
		overflow-y: auto;
	}
	
	.closePanel{
		position: absolute;
		top: -10px;
		right: 0px;
	}
	
	.closePanel button{
		padding: 0px;
		height: 25px;
		line-height: 25px;
		width: 40px;
	}
</style>
