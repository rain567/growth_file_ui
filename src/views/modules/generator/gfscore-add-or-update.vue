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
    <el-form-item label="所在学院" prop="faculty" v-show="facultyShow">
        <el-select v-model="dataForm.faculty">
          <el-option value="数学与计算机学院" >数学与计算机学院</el-option>
          <el-option value="体育学院" >体育学院</el-option>
          <el-option value="音乐学院" >音乐学院</el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="所属班级" prop="userClass">
      <el-select v-model="dataForm.userClass">
        <el-option v-for="classOne in classList" :key="classOne.name" :label="classOne.name" :value="classOne.name">{{ classOne.name }}</el-option>
      </el-select>
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
    <el-form-item label="学分" prop="credit">
      <el-input v-model="dataForm.credit" placeholder="学分"></el-input>
    </el-form-item>
    <el-form-item label="考试时间" prop="examTime">
      <el-date-picker
        v-model="dataForm.examTime"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="考试类别" prop="type">
      <el-select v-model="dataForm.type">
        <el-option value="公共">公共</el-option>
        <el-option value="选修">选修</el-option>
        <el-option value="技能培训">技能培训</el-option>
        <el-option value="专业基础课">专业基础课</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="考试方式" prop="pattern">
      <el-select v-model="dataForm.pattern">
        <el-option value="考查">考查</el-option>
        <el-option value="考试">考试</el-option>
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
        classList: [],
        dataForm: {
          id: 0,
          institute: '',
          className: '',
          studentName: '',
          studentNo: '',
          course: '',
          teacher: '',
          score: '',
          examTime: '',
          type: '',
          pattern: '',
          credit: '',
          createTime: '',
          updateTime: '',
          operator: '',
          remark: ''
        },
        dataRule: {
          institute: [
            { required: true, message: '学院不能为空', trigger: 'blur' }
          ],
          className: [
            { required: true, message: '班级不能为空', trigger: 'blur' }
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
          ],
          score: [
            { required: true, message: '分数不能为空', trigger: 'blur' }
          ],
          examTime: [
            { required: true, message: '考试时间不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '考试类型不能为空', trigger: 'blur' }
          ],
          credit: [
            { required: true, message: '学分不能为空', trigger: 'blur' }
          ],
          pattern: [
            { required: true, message: '考试方式不能为空', trigger: 'blur' }
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
        this.$http({
          url: this.$http.adornUrl('/generator/gfclass/allList'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.classList = data && data.code === 0 ? data.list : []
        }).then(() => {
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
                  this.dataForm.institute = data.gfScore.institute
                  this.dataForm.className = data.gfScore.className
                  this.dataForm.examTime = data.gfScore.examTime
                  this.dataForm.type = data.gfScore.type
                  this.dataForm.pattern = data.gfScore.pattern
                  this.dataForm.credit = data.gfScore.credit
                  this.dataForm.createTime = data.gfScore.createTime
                  this.dataForm.updateTime = data.gfScore.updateTime
                  this.dataForm.operator = data.gfScore.operator
                  this.dataForm.remark = data.gfScore.remark
                }
              })
            }
          })
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
                'institute': this.dataForm.institute,
                'className': this.dataForm.className,
                'examTime': this.dataForm.examTime,
                'type': this.dataForm.type,
                'pattern': this.dataForm.pattern,
                'credit': this.dataForm.credit,
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
