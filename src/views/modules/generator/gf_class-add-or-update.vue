<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="班级名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="班级名称"></el-input>
    </el-form-item>
    <el-form-item label="专业" prop="faculty">
      <el-input v-model="dataForm.faculty" placeholder="专业"></el-input>
    </el-form-item>
    <el-form-item label="学院" prop="institute">
      <el-input v-model="dataForm.institute" placeholder="学院"></el-input>
    </el-form-item>
    <el-form-item label="辅导员" prop="instructor">
      <el-select v-model="dataForm.instructor" placeholder="请选择">
        <el-option v-for="instructor in instructorList" v-bind:key="instructor.userId" 
        :value="instructor.username" 
        :label="instructor.username">{{ instructor.username }}</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        instructorList: [],
        dataForm: {
          id: 0,
          name: '',
          faculty: '',
          institute: '',
          instructor: '',
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
            { required: true, message: '专业不能为空', trigger: 'blur' }
          ],
          institute: [
            { required: true, message: '学院不能为空', trigger: 'blur' }
          ],
          instructor: [
            { required: true, message: '辅导员不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.getInstructorList()
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/generator/GfClass/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.GfClass.name
                this.dataForm.faculty = data.GfClass.faculty
                this.dataForm.institute = data.GfClass.institute
                this.dataForm.instructor = data.GfClass.instructor
                this.dataForm.createTime = data.GfClass.createTime
                this.dataForm.updateTime = data.GfClass.updateTime
                this.dataForm.operator = data.GfClass.operator
                this.dataForm.remark = data.GfClass.remark
              }
            })
          }
        })
      },
      // 获取数据列表
      getInstructorList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/listByAll'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.instructorList = data.list
            console.log(data.list)
          } else {
            this.instructorList = []
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generator/GfClass/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'faculty': this.dataForm.faculty,
                'institute': this.dataForm.institute,
                'instructor': this.dataForm.instructor,
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
