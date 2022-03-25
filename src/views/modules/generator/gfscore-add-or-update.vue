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
    <el-form-item label="考试科目" prop="course">
      <el-input v-model="dataForm.course" placeholder="考试科目"></el-input>
    </el-form-item>
    <el-form-item label="任课老师" prop="teacher">
      <el-input v-model="dataForm.teacher" placeholder="任课老师"></el-input>
    </el-form-item>
    <el-form-item label="分数" prop="score">
      <el-input v-model="dataForm.score" placeholder="分数"></el-input>
    </el-form-item>
    <el-form-item label="考试时间" prop="examTime">
      <el-date-picker
        v-model="dataForm.examTime"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="考试类型" prop="type">
      <el-select v-model="dataForm.type">
        <el-option value="必修">必修</el-option>
        <el-option value="选修">选修</el-option>
      </el-select>
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
          studentName: '',
          studentNo: '',
          course: '',
          teacher: '',
          score: '',
          className: '',
          examTime: '',
          type: '',
          createTime: '',
          updateTime: '',
          operator: '',
          remark: ''
        },
        dataRule: {
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
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ],
          className: [
            { required: true, message: '所属班级不能为空', trigger: 'blur' }
          ],
          examTime: [
            { required: true, message: '考试时间不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '考试类型不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/gfscore/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.studentName = data.gfScore.studentName
                this.dataForm.studentNo = data.gfScore.studentNo
                this.dataForm.course = data.gfScore.course
                this.dataForm.teacher = data.gfScore.teacher
                this.dataForm.score = data.gfScore.score
                this.dataForm.className = data.gfScore.className
                this.dataForm.examTime = data.gfScore.examTime
                this.dataForm.type = data.gfScore.type
                this.dataForm.createTime = data.gfScore.createTime
                this.dataForm.updateTime = data.gfScore.updateTime
                this.dataForm.operator = data.gfScore.operator
                this.dataForm.remark = data.gfScore.remark
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
              url: this.$http.adornUrl(`/generator/gfscore/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'studentName': this.dataForm.studentName,
                'studentNo': this.dataForm.studentNo,
                'course': this.dataForm.course,
                'teacher': this.dataForm.teacher,
                'score': this.dataForm.score,
                'className': this.dataForm.className,
                'examTime': this.dataForm.examTime,
                'type': this.dataForm.type,
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
