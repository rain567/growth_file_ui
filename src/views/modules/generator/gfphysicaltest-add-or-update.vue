<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px">
    <el-form-item label="姓名" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="体测姓名"></el-input>
    </el-form-item>
    <el-form-item label="学号" prop="userNo">
      <el-input v-model="dataForm.userNo" placeholder="学号"></el-input>
    </el-form-item>
    <el-form-item label="年级" prop="grade">
      <el-input v-model="dataForm.grade" placeholder="年级"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="dataForm.sex">
        <el-option value="男" >男</el-option>
        <el-option value="女" >女</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所在学院" prop="faculty">
      <el-select v-model="dataForm.faculty">
        <el-option value="数学与计算机学院" >数学与计算机学院</el-option>
        <el-option value="体育学院" >体育学院</el-option>
        <el-option value="音乐学院" >音乐学院</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="引体向上" prop="chinUp" v-show="dataForm.sex === '男'">
      <el-input v-model="dataForm.chinUp" placeholder="引体向上"></el-input>
    </el-form-item>
    <el-form-item label="坐立体前屈" prop="seatBodyAnteflexion" v-show="dataForm.sex === '女'">
      <el-input v-model="dataForm.seatBodyAnteflexion" placeholder="坐立体前屈"></el-input>
    </el-form-item>
    <el-form-item label="长跑" prop="longRun">
      <el-input v-model="dataForm.longRun" placeholder="长跑"></el-input>
    </el-form-item>
    <el-form-item label="立定跳远" prop="standingLongJump">
      <el-input v-model="dataForm.standingLongJump" placeholder="立定跳远"></el-input>
    </el-form-item>
    <el-form-item label="短跑" prop="sprint">
      <el-input v-model="dataForm.sprint" placeholder="短跑"></el-input>
    </el-form-item>
    <el-form-item label="肺活量" prop="pulmonary">
      <el-input v-model="dataForm.pulmonary" placeholder="肺活量"></el-input>
    </el-form-item>
    <el-form-item label="体重" prop="weight">
      <el-input v-model="dataForm.weight" placeholder="体重"></el-input>
    </el-form-item>
    <el-form-item label="长跑得分" prop="longRunScore">
      <el-input v-model="dataForm.longRunScore" placeholder="长跑得分"></el-input>
    </el-form-item>
    <el-form-item label="引体向上得分" prop="chinUpScore">
      <el-input v-model="dataForm.chinUpScore" placeholder="引体向上得分"></el-input>
    </el-form-item>
    <el-form-item label="立定跳远得分" prop="standingLongJumpScore">
      <el-input v-model="dataForm.standingLongJumpScore" placeholder="立定跳远得分"></el-input>
    </el-form-item>
    <el-form-item label="坐立体前屈得分" prop="seatBodyAnteflexionScore">
      <el-input v-model="dataForm.seatBodyAnteflexionScore" placeholder="坐立体前屈得分"></el-input>
    </el-form-item>
    <el-form-item label="短跑得分" prop="sprintScore">
      <el-input v-model="dataForm.sprintScore" placeholder="短跑得分"></el-input>
    </el-form-item>
    <el-form-item label="肺活量得分" prop="pulmonaryScore">
      <el-input v-model="dataForm.pulmonaryScore" placeholder="肺活量得分"></el-input>
    </el-form-item>
    <el-form-item label="身高体重得分" prop="statureWeightScore">
      <el-input v-model="dataForm.statureWeightScore" placeholder="身高体重得分"></el-input>
    </el-form-item>
    <el-form-item label="身高" prop="stature">
      <el-input v-model="dataForm.stature" placeholder="身高"></el-input>
    </el-form-item>
    <el-form-item label="学年总分" prop="yearScore">
      <el-input v-model="dataForm.yearScore" placeholder="学年总分"></el-input>
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
          userNo: '',
          userId: '',
          longRun: '',
          chinUp: '',
          standingLongJump: '',
          seatBodyAnteflexion: '',
          sprint: '',
          pulmonary: '',
          weight: '',
          longRunScore: '',
          chinUpScore: '',
          standingLongJumpScore: '',
          seatBodyAnteflexionScore: '',
          sprintScore: '',
          pulmonaryScore: '',
          statureWeightScore: '',
          yearScore: '',
          grade: '',
          stature: '',
          sex: '',
          faculty: '',
          operator: '',
          remark: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '体测姓名不能为空', trigger: 'blur' }
          ],
          userNo: [
            { required: true, message: '学号不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '体测学生不能为空', trigger: 'blur' }
          ],
          longRun: [
            { required: true, message: '长跑不能为空', trigger: 'blur' }
          ],
          chinUp: [
            { required: true, message: '引体向上不能为空', trigger: 'blur' }
          ],
          standingLongJump: [
            { required: true, message: '立定跳远不能为空', trigger: 'blur' }
          ],
          seatBodyAnteflexion: [
            { required: true, message: '坐立体前屈不能为空', trigger: 'blur' }
          ],
          sprint: [
            { required: true, message: '短跑不能为空', trigger: 'blur' }
          ],
          pulmonary: [
            { required: true, message: '肺活量不能为空', trigger: 'blur' }
          ],
          weight: [
            { required: true, message: '体重不能为空', trigger: 'blur' }
          ],
          longRunScore: [
            { required: true, message: '长跑得分不能为空', trigger: 'blur' }
          ],
          chinUpScore: [
            { required: true, message: '引体向上得分不能为空', trigger: 'blur' }
          ],
          standingLongJumpScore: [
            { required: true, message: '立定跳远得分不能为空', trigger: 'blur' }
          ],
          seatBodyAnteflexionScore: [
            { required: true, message: '坐立体前屈得分不能为空', trigger: 'blur' }
          ],
          sprintScore: [
            { required: true, message: '短跑得分不能为空', trigger: 'blur' }
          ],
          pulmonaryScore: [
            { required: true, message: '肺活量得分不能为空', trigger: 'blur' }
          ],
          statureWeightScore: [
            { required: true, message: '身高体重得分不能为空', trigger: 'blur' }
          ],
          stature: [
            { required: true, message: '身高不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '性别不能为空', trigger: 'blur' }
          ],
          faculty: [
            { required: true, message: '所在学院不能为空', trigger: 'blur' }
          ],
          operator: [
            { required: true, message: '操作人不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          yearScore: [
            { required: true, message: '学年总分不能为空', trigger: 'blur' }
          ],
          grade: [
            { required: true, message: '年级不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/gfphysicaltest/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userName = data.gfPhysicalTest.userName
                this.dataForm.userNo = data.gfPhysicalTest.userNo
                this.dataForm.userId = data.gfPhysicalTest.userId
                this.dataForm.longRun = data.gfPhysicalTest.longRun
                this.dataForm.chinUp = data.gfPhysicalTest.chinUp
                this.dataForm.standingLongJump = data.gfPhysicalTest.standingLongJump
                this.dataForm.seatBodyAnteflexion = data.gfPhysicalTest.seatBodyAnteflexion
                this.dataForm.sprint = data.gfPhysicalTest.sprint
                this.dataForm.pulmonary = data.gfPhysicalTest.pulmonary
                this.dataForm.weight = data.gfPhysicalTest.weight
                this.dataForm.longRunScore = data.gfPhysicalTest.longRunScore
                this.dataForm.chinUpScore = data.gfPhysicalTest.chinUpScore
                this.dataForm.standingLongJumpScore = data.gfPhysicalTest.standingLongJumpScore
                this.dataForm.seatBodyAnteflexionScore = data.gfPhysicalTest.seatBodyAnteflexionScore
                this.dataForm.sprintScore = data.gfPhysicalTest.sprintScore
                this.dataForm.pulmonaryScore = data.gfPhysicalTest.pulmonaryScore
                this.dataForm.statureWeightScore = data.gfPhysicalTest.statureWeightScore
                this.dataForm.stature = data.gfPhysicalTest.stature
                this.dataForm.sex = data.gfPhysicalTest.sex
                this.dataForm.faculty = data.gfPhysicalTest.faculty
                this.dataForm.operator = data.gfPhysicalTest.operator
                this.dataForm.remark = data.gfPhysicalTest.remark
                this.dataForm.yearScore = data.gfPhysicalTest.yearScore
                this.dataForm.grade = data.gfPhysicalTest.grade
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
              url: this.$http.adornUrl(`/generator/gfphysicaltest/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userName': this.dataForm.userName,
                'userNo': this.dataForm.userNo,
                'userId': this.dataForm.userId,
                'longRun': this.dataForm.longRun,
                'chinUp': this.dataForm.chinUp,
                'standingLongJump': this.dataForm.standingLongJump,
                'seatBodyAnteflexion': this.dataForm.seatBodyAnteflexion,
                'sprint': this.dataForm.sprint,
                'pulmonary': this.dataForm.pulmonary,
                'weight': this.dataForm.weight,
                'longRunScore': this.dataForm.longRunScore,
                'chinUpScore': this.dataForm.chinUpScore,
                'standingLongJumpScore': this.dataForm.standingLongJumpScore,
                'seatBodyAnteflexionScore': this.dataForm.seatBodyAnteflexionScore,
                'sprintScore': this.dataForm.sprintScore,
                'pulmonaryScore': this.dataForm.pulmonaryScore,
                'statureWeightScore': this.dataForm.statureWeightScore,
                'stature': this.dataForm.stature,
                'sex': this.dataForm.sex,
                'faculty': this.dataForm.faculty,
                'operator': this.dataForm.operator,
                'yearScore': this.dataForm.yearScore,
                'remark': this.dataForm.remark,
                'grade': this.dataForm.grade
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
