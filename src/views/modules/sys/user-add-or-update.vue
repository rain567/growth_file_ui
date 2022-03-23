<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="学号/工号" prop="no">
        <el-input v-model="dataForm.no" placeholder="输入学号/工号"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList" @change="checkRole()">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="所在学院" prop="faculty" v-show="facultyShow">
        <el-select v-model="dataForm.faculty">
          <el-option value="数学与计算机学院" >数学与计算机学院</el-option>
          <el-option value="体育学院" >体育学院</el-option>
          <el-option value="音乐学院" >音乐学院</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" size="mini" prop="userClass" v-show="userClassShow">
        <el-select v-model="dataForm.userClass">
          <el-option v-for="classOne in classList" :value="classOne.name" :key="classOne.name" :label="classOne.name">{{ classOne.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
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
        facultyShow: false,
        userClassShow: false,
        visible: false,
        roleList: [],
        classList: [],
        dataForm: {
          id: 0,
          no: 0,
          faculty: '',
          userName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          name: '',
          userClass: ''
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
    methods: {
      isTeacherOrStudent (key) {
        let roleIdList = this.dataForm.roleIdList
        if (!roleIdList) {
          roleIdList = '[]'
        } else if (roleIdList.length === 0) {
          roleIdList = '[]'
        }
        return ((roleIdList || '[]') + '').indexOf(key) !== -1 || false
      },
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/generator/gfclass/allList'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          this.classList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.roleList = data && data.code === 0 ? data.list : []
          }).then(() => {
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
            })
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.userName = data.user.username
                  this.dataForm.salt = data.user.salt
                  this.dataForm.email = data.user.email
                  this.dataForm.mobile = data.user.mobile
                  this.dataForm.roleIdList = data.user.roleIdList
                  this.dataForm.status = data.user.status
                  this.dataForm.no = data.user.no
                  this.dataForm.faculty = data.user.faculty
                  this.dataForm.name = data.user.name
                  this.dataForm.userClass = data.user.userClass
                  this.checkRole()
                }
              })
            } else {
              this.facultyShow = false
              this.userClassShow = false
            }
          })
        })
      },
      checkRole () {
        console.log('this.dataForm.roleIdList', this.dataForm.roleIdList)
        if (this.isTeacherOrStudent(3)) {
          this.facultyShow = true
          this.userClassShow = true
        } else if (this.isTeacherOrStudent(2)) {
          this.facultyShow = true
          this.userClassShow = false
        } else {
          this.facultyShow = false
          this.userClassShow = false
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
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                'no': this.dataForm.no,
                'faculty': this.dataForm.faculty,
                'name': this.dataForm.name,
                'userClass': this.dataForm.userClass
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
