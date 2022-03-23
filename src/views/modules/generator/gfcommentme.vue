<template>
  <div>
    <div v-show="!ifShow" style="float: right;">
      <el-button v-if="isAuth('generator:gfcomment:save')" type="primary" @click="ifShow = true">修改自我描述</el-button>
    </div>
    <div v-show="!ifShow">
      {{ dataForm.content || '请填写自我描述' }}
    </div>
    <div v-show="ifShow">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="评论内容" prop="content">
        <el-input type="textarea" rows="5" v-model="dataForm.content" placeholder="评论内容" ></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ifShow = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        ifShow: false,
        dataForm: {
          id: 0,
          userId: this.$store.state.user.id,
          originUserId: this.$store.state.user.id,
          content: '',
          type: 1,
          operator: '',
          remark: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '创建用户id不能为空', trigger: 'blur' }
          ],
          originUserId: [
            { required: true, message: '被评论者id不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '评论内容不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '评论者身份不能为空', trigger: 'blur' }
          ],
          operator: [
            { required: true, message: '操作人不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/gfcomment/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 1,
            'userId': this.$store.state.user.id,
            'type': 1
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let dataOne = data.page.list[0]
            if (dataOne) {
              this.dataForm.id = dataOne.id
              this.dataForm.userId = dataOne.userId
              this.dataForm.content = dataOne.content
              this.dataForm.type = dataOne.type
            }
          } else {
          }
          this.dataListLoading = false
        })
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/gfcomment/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.gfComment.userId
                this.dataForm.originUserId = data.gfComment.originUserId
                this.dataForm.content = data.gfComment.content
                this.dataForm.type = data.gfComment.type
                this.dataForm.operator = data.gfComment.operator
                this.dataForm.remark = data.gfComment.remark
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/gfcomment/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userId': this.dataForm.userId,
                'originUserId': this.dataForm.originUserId,
                'content': this.dataForm.content,
                'type': this.dataForm.type,
                'operator': this.dataForm.operator,
                'remark': this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.ifShow = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
