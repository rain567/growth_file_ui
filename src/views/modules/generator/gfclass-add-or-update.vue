<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="班级名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="班级名称"></el-input>
    </el-form-item>
    <el-form-item label="所在专业" prop="faculty">
      <el-input v-model="dataForm.faculty" placeholder="所在专业"></el-input>
    </el-form-item>
    <el-form-item label="所在学院" prop="institute">
      <el-input v-model="dataForm.institute" placeholder="所在学院"></el-input>
    </el-form-item>
    <el-form-item label="辅导员姓名" prop="instructor">
      <el-input v-model="dataForm.instructor" placeholder="辅导员姓名"></el-input>
    </el-form-item>
    <el-form-item label="班主任姓名" prop="bzr">
      <el-input v-model="dataForm.bzr" placeholder="班主任姓名"></el-input>
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
          name: '',
          faculty: '',
          institute: '',
          instructor: '',
          bzr: '',
          createTime: '',
          updateTime: '',
          operator: '',
          remark: ''
        },
        dataRule: {
          name: [
            { required: true, message: '班级名称不能为空', trigger: 'blur' }
          ],
          faculty: [
            { required: true, message: '所在专业不能为空', trigger: 'blur' }
          ],
          institute: [
            { required: true, message: '所在学院不能为空', trigger: 'blur' }
          ],
          instructor: [
            { required: true, message: '辅导员姓名不能为空', trigger: 'blur' }
          ],
          bzr: [
            { required: true, message: '班主任姓名不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/gfclass/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.gfClass.name
                this.dataForm.faculty = data.gfClass.faculty
                this.dataForm.institute = data.gfClass.institute
                this.dataForm.instructor = data.gfClass.instructor
                this.dataForm.bzr = data.gfClass.bzr
                this.dataForm.createTime = data.gfClass.createTime
                this.dataForm.updateTime = data.gfClass.updateTime
                this.dataForm.operator = data.gfClass.operator
                this.dataForm.remark = data.gfClass.remark
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
              url: this.$http.adornUrl(`/generator/gfclass/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'faculty': this.dataForm.faculty,
                'institute': this.dataForm.institute,
                'instructor': this.dataForm.instructor,
                'bzr': this.dataForm.bzr,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
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
