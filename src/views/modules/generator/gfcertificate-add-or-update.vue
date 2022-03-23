<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="获得者姓名" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="获得者姓名"></el-input>
    </el-form-item>
    <el-form-item label="获得者学号" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="获得者学号"></el-input>
    </el-form-item>
    <el-form-item label="证书名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="证书名称"></el-input>
    </el-form-item>
    <el-form-item label="证书级别" prop="level">
      <el-input v-model="dataForm.level" placeholder="证书级别"></el-input>
    </el-form-item>
    <el-form-item label="加分" prop="code">
      <el-input v-model="dataForm.code" placeholder="加分"></el-input>
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
          userName: '',
          userId: '',
          name: '',
          level: '',
          code: '',
          status: '',
          operator: '',
          remark: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '获得者姓名不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '获得者id不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '证书名称不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '证书级别不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '加分不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
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
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/gfcertificate/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.gfCertificate.userName
                this.dataForm.userId = data.gfCertificate.userId
                this.dataForm.name = data.gfCertificate.name
                this.dataForm.level = data.gfCertificate.level
                this.dataForm.code = data.gfCertificate.code
                this.dataForm.status = data.gfCertificate.status
                this.dataForm.operator = data.gfCertificate.operator
                this.dataForm.remark = data.gfCertificate.remark
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
              url: this.$http.adornUrl(`/generator/gfcertificate/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userName': this.dataForm.userName,
                'userId': this.dataForm.userId,
                'name': this.dataForm.name,
                'level': this.dataForm.level,
                'code': this.dataForm.code,
                'status': this.dataForm.status,
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
