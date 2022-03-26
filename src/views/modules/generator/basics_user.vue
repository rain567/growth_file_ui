<template>
  <div class="mod-config">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="学号" prop="no">
        <el-input v-model="dataForm.no" placeholder="输入学号"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="所在学院" prop="faculty">
        <el-select v-model="dataForm.faculty">
        <el-option value="数学与计算机学院" >数学与计算机学院</el-option>
        <el-option value="体育学院" >体育学院</el-option>
        <el-option value="音乐学院" >音乐学院</el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        roleList: [],
        dataForm: {
          id: 0,
          no: '',
          faculty: '',
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          name: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.init(this.$store.state.user.id)
    },
    methods: {
      init (id) {
        console.log('this.$store.state.user.id', id)
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            console.log('  ')
            console.log('data', data)
            console.log('data', data.code)
            if (data && data.code === 0) {
              console.log('11')
              this.dataForm.userName = data.user.username
              this.dataForm.no = data.user.no
              this.dataForm.faculty = data.user.faculty
              this.dataForm.salt = data.user.salt
              this.dataForm.email = data.user.email
              this.dataForm.mobile = data.user.mobile
              this.dataForm.roleIdList = data.user.roleIdList
              this.dataForm.status = data.user.status
              this.dataForm.name = data.user.name
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'no': this.dataForm.no,
                'faculty': this.dataForm.faculty,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                'name': this.dataForm.name
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
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
