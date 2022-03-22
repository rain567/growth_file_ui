<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="档案名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="档案名称"></el-input>
    </el-form-item>
    <el-form-item label="档案主人学号" prop="ownerNo">
      <el-input v-model="dataForm.ownerNo" placeholder="档案主人学号"></el-input>
    </el-form-item>
    <el-form-item label="档案主任姓名" prop="ownerName">
      <el-input v-model="dataForm.ownerName" placeholder="档案主任姓名"></el-input>
    </el-form-item>
    <el-form-item label="家庭联系方式" prop="homePhone">
      <el-input v-model="dataForm.homePhone" placeholder="家庭联系方式"></el-input>
    </el-form-item>
    <el-form-item label="毕业时间" prop="bysj">
      <el-date-picker
        v-model="dataForm.bysj"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="入学时间" prop="rxsj">
      <el-date-picker
        v-model="dataForm.rxsj"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="家庭住址" prop="jtzz">
      <el-input v-model="dataForm.jtzz" placeholder="家庭住址"></el-input>
    </el-form-item>
    <el-form-item label="出生日期" prop="birthday">
      <el-date-picker
        v-model="dataForm.birthday"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="政治面貌" prop="zzmm">
      <el-input v-model="dataForm.zzmm" placeholder="政治面貌"></el-input>
    </el-form-item>
    <el-form-item label="所属专业" prop="major">
      <el-input v-model="dataForm.major" placeholder="所属专业"></el-input>
    </el-form-item>
    <el-form-item label="所属班级" prop="userClass">
      <el-input v-model="dataForm.userClass" placeholder="所属班级"></el-input>
    </el-form-item>
    <el-form-item label="民族" prop="mz">
      <el-select v-model="dataForm.mz">
        <el-option value="汉族">汉族</el-option>
        <el-option value="状族">壮族</el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="籍贯" prop="jg">
      <el-input v-model="dataForm.jg" placeholder="籍贯"></el-input>
    </el-form-item>
    <el-form-item label="档案共享用户" prop="shareUser">
      <el-input v-model="dataForm.shareUser" placeholder="档案共享用户"></el-input>
    </el-form-item>
    <el-form-item label="是否共享档案" prop="isShare">
      <el-input v-model="dataForm.isShare" placeholder="是否共享档案"></el-input>
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
          ownerNo: '',
          ownerName: '',
          homePhone: '',
          bysj: '',
          rxsj: '',
          jtzz: '',
          status: '',
          birthday: '',
          zzmm: '',
          major: '',
          userClass: '',
          mz: '',
          jg: '',
          shareUser: '',
          isShare: '',
          createTime: '',
          updateTime: '',
          operator: '',
          remark: ''
        },
        dataRule: {
          name: [
            { required: true, message: '档案名称不能为空', trigger: 'blur' }
          ],
          ownerNo: [
            { required: true, message: '档案主人学号不能为空', trigger: 'blur' }
          ],
          ownerName: [
            { required: true, message: '档案主任姓名不能为空', trigger: 'blur' }
          ],
          homePhone: [
            { required: true, message: '家庭联系方式不能为空', trigger: 'blur' }
          ],
          bysj: [
            { required: true, message: '毕业时间不能为空', trigger: 'blur' }
          ],
          rxsj: [
            { required: true, message: '入学时间不能为空', trigger: 'blur' }
          ],
          jtzz: [
            { required: true, message: '家庭住址不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态(1新建、2审核)不能为空', trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: '出生日期不能为空', trigger: 'blur' }
          ],
          zzmm: [
            { required: true, message: '政治面貌不能为空', trigger: 'blur' }
          ],
          major: [
            { required: true, message: '所属专业不能为空', trigger: 'blur' }
          ],
          userClass: [
            { required: true, message: '所属班级不能为空', trigger: 'blur' }
          ],
          mz: [
            { required: true, message: '民族不能为空', trigger: 'blur' }
          ],
          jg: [
            { required: true, message: '籍贯不能为空', trigger: 'blur' }
          ],
          shareUser: [
            { required: true, message: '档案共享用户不能为空', trigger: 'blur' }
          ],
          isShare: [
            { required: true, message: '是否共享档案不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/generator/gfowner/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.gfOwner.name
                this.dataForm.ownerNo = data.gfOwner.ownerNo
                this.dataForm.ownerName = data.gfOwner.ownerName
                this.dataForm.homePhone = data.gfOwner.homePhone
                this.dataForm.bysj = data.gfOwner.bysj
                this.dataForm.rxsj = data.gfOwner.rxsj
                this.dataForm.jtzz = data.gfOwner.jtzz
                this.dataForm.status = data.gfOwner.status
                this.dataForm.birthday = data.gfOwner.birthday
                this.dataForm.zzmm = data.gfOwner.zzmm
                this.dataForm.major = data.gfOwner.major
                this.dataForm.userClass = data.gfOwner.userClass
                this.dataForm.mz = data.gfOwner.mz
                this.dataForm.jg = data.gfOwner.jg
                this.dataForm.shareUser = data.gfOwner.shareUser
                this.dataForm.isShare = data.gfOwner.isShare
                this.dataForm.createTime = data.gfOwner.createTime
                this.dataForm.updateTime = data.gfOwner.updateTime
                this.dataForm.operator = data.gfOwner.operator
                this.dataForm.remark = data.gfOwner.remark
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
              url: this.$http.adornUrl(`/generator/gfowner/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'ownerNo': this.dataForm.ownerNo,
                'ownerName': this.dataForm.ownerName,
                'homePhone': this.dataForm.homePhone,
                'bysj': this.dataForm.bysj,
                'rxsj': this.dataForm.rxsj,
                'jtzz': this.dataForm.jtzz,
                'status': this.dataForm.status,
                'birthday': this.dataForm.birthday,
                'zzmm': this.dataForm.zzmm,
                'major': this.dataForm.major,
                'userClass': this.dataForm.userClass,
                'mz': this.dataForm.mz,
                'jg': this.dataForm.jg,
                'shareUser': this.dataForm.shareUser,
                'isShare': this.dataForm.isShare,
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
