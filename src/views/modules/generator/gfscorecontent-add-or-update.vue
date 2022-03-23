<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="姓名" prop="studentName">
      <el-input v-model="dataForm.studentName" placeholder="姓名"></el-input>
    </el-form-item>
    <el-form-item label="学号" prop="studentNo">
      <el-input v-model="dataForm.studentNo" placeholder="学号"></el-input>
    </el-form-item>
    <el-form-item label="科目" prop="course">
      <el-input v-model="dataForm.course" placeholder="考试科目"></el-input>
    </el-form-item>
    <el-form-item label="任课老师" prop="teacher">
      <el-input v-model="dataForm.teacher" placeholder="任课老师"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input type="textarea" v-model="dataForm.content" placeholder="内容"></el-input>
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
          content: '',
          createTime: '',
          updateTime: '',
          operator: '',
          remark: '',
          studentName: '',
          studentNo: '',
          course: '',
          teacher: ''
        },
        dataRule: {
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
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
          ],
          studentName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          studentNo: [
            { required: true, message: '学号不能为空', trigger: 'blur' }
          ],
          course: [
            { required: true, message: '考试科目不能为空', trigger: 'blur' }
          ],
          teacher: [
            { required: true, message: '任课老师不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/gfscorecontent/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.content = data.gfScoreContent.content
                this.dataForm.createTime = data.gfScoreContent.createTime
                this.dataForm.updateTime = data.gfScoreContent.updateTime
                this.dataForm.operator = data.gfScoreContent.operator
                this.dataForm.remark = data.gfScoreContent.remark
                this.dataForm.studentName = data.gfScoreContent.studentName
                this.dataForm.studentNo = data.gfScoreContent.studentNo
                this.dataForm.course = data.gfScoreContent.course
                this.dataForm.teacher = data.gfScoreContent.teacher
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
              url: this.$http.adornUrl(`/generator/gfscorecontent/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'content': this.dataForm.content,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'operator': this.dataForm.operator,
                'remark': this.dataForm.remark,
                'studentName': this.dataForm.studentName,
                'studentNo': this.dataForm.studentNo,
                'course': this.dataForm.course,
                'teacher': this.dataForm.teacher
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
