<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="评论内容" prop="content">
      <el-input type="textarea" rows="4" v-model="dataForm.content" placeholder="评论内容"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          userId: this.$store.state.user.id,
          username: this.$store.state.user.username,
          originUserId: '',
          originUserName: '',
          content: '',
          type: 2,
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
          originUserName: [
            { required: true, message: '被评论者姓名不能为空', trigger: 'blur' }
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
    methods: {
      init (originUserId, name) {
        this.dataForm.originUserId = originUserId || 0
        this.dataForm.originUserName = name
        this.dataForm.userId = this.$store.state.user.id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$http({
            url: this.$http.adornUrl(`/generator/gfcomment/list`),
            method: 'get',
            params: this.$http.adornParams({
              'page': 1,
              'limit': 1,
              'type': 2,
              'originUserId': this.dataForm.originUserId,
              'userId': this.$store.state.user.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              data = data.page.list[0]
              this.dataForm.id = data.id
              this.dataForm.userId = data.userId
              this.dataForm.originUserId = data.originUserId
              this.dataForm.content = data.content
              this.dataForm.type = data.type
              this.dataForm.operator = data.operator
              this.dataForm.remark = data.remark
              this.dataForm.originUserName = data.originUserName
              this.dataForm.username = data.username
            }
          })
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
                'originUserName': this.dataForm.originUserName,
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
                    this.visible = false
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
