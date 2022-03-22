<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="学生学号" prop="studentNo">
      <el-input v-model="dataForm.studentNo" placeholder="学生学号"></el-input>
    </el-form-item>
    <el-form-item label="学生姓名" prop="name">
      <el-input v-model="dataForm.name" placeholder="学生姓名"></el-input>
    </el-form-item>
    <el-form-item label="状态(1新建、2审核)" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态(1新建、2审核)"></el-input>
    </el-form-item>
    <el-form-item label="类型(1奖励、2惩罚)" prop="type">
      <el-input v-model="dataForm.type" placeholder="类型(1奖励、2惩罚)"></el-input>
    </el-form-item>
    <el-form-item label="录入人姓名" prop="createName">
      <el-input v-model="dataForm.createName" placeholder="录入人姓名"></el-input>
    </el-form-item>
    <el-form-item label="审批人姓名" prop="auditName">
      <el-input v-model="dataForm.auditName" placeholder="审批人姓名"></el-input>
    </el-form-item>
    <el-form-item label="获奖/惩日期" prop="getTime">
      <el-input v-model="dataForm.getTime" placeholder="获奖/惩日期"></el-input>
    </el-form-item>
    <el-form-item label="获奖/惩内容" prop="content">
      <el-input v-model="dataForm.content" placeholder="获奖/惩内容"></el-input>
    </el-form-item>
    <el-form-item label="材料相关证明" prop="cl">
      <el-input v-model="dataForm.cl" placeholder="材料相关证明"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    <el-form-item label="操作人" prop="operator">
      <el-input v-model="dataForm.operator" placeholder="操作人"></el-input>
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
        dataForm: {
          id: 0,
          studentNo: '',
          name: '',
          status: '',
          type: '',
          createName: '',
          auditName: '',
          getTime: '',
          content: '',
          cl: '',
          createTime: '',
          updateTime: '',
          operator: '',
          remark: ''
        },
        dataRule: {
          studentNo: [
            { required: true, message: '学生学号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '学生姓名不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态(1新建、2审核)不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '类型(1奖励、2惩罚)不能为空', trigger: 'blur' }
          ],
          createName: [
            { required: true, message: '录入人姓名不能为空', trigger: 'blur' }
          ],
          auditName: [
            { required: true, message: '审批人姓名不能为空', trigger: 'blur' }
          ],
          getTime: [
            { required: true, message: '获奖/惩日期不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '获奖/惩内容不能为空', trigger: 'blur' }
          ],
          cl: [
            { required: true, message: '材料相关证明不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/gfjc/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.studentNo = data.gfJc.studentNo
                this.dataForm.name = data.gfJc.name
                this.dataForm.status = data.gfJc.status
                this.dataForm.type = data.gfJc.type
                this.dataForm.createName = data.gfJc.createName
                this.dataForm.auditName = data.gfJc.auditName
                this.dataForm.getTime = data.gfJc.getTime
                this.dataForm.content = data.gfJc.content
                this.dataForm.cl = data.gfJc.cl
                this.dataForm.createTime = data.gfJc.createTime
                this.dataForm.updateTime = data.gfJc.updateTime
                this.dataForm.operator = data.gfJc.operator
                this.dataForm.remark = data.gfJc.remark
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
              url: this.$http.adornUrl(`/generator/gfjc/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'studentNo': this.dataForm.studentNo,
                'name': this.dataForm.name,
                'status': this.dataForm.status,
                'type': this.dataForm.type,
                'createName': this.dataForm.createName,
                'auditName': this.dataForm.auditName,
                'getTime': this.dataForm.getTime,
                'content': this.dataForm.content,
                'cl': this.dataForm.cl,
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
