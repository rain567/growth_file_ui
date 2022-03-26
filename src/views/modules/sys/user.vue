<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button type="info" @click="templateDownload()">下载导入模板</el-button>
        <el-upload
          :action="baseUrl + '/sys/user/batchSave'"
          name="uploadFile"
          ref="uploadFile"
          accept=".xls,.xlsx"
          style="float: right; margin: 0 10px;"
          :on-exceed="handleExceed"
          size="mini"
          :limit="5"
          :on-success="onUsersUpload"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :data="dataForm.props"
          :on-change="loadJsonFromFile">
          <el-button slot="trigger" size="small" type="primary">
            <i class="el-icon-top"></i>上传批量保存文件
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="faculty"
        header-align="center"
        align="center"
        label="学院">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'
  export default {
    data () {
      return {
        baseUrl: '',
        tHeader: [],
        filterVal: [],
        fileList: [],
        dataForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.baseUrl = window.SITE_CONFIG.baseUrl
      this.getDataList()
    },
    methods: {
      loadJsonFromFile (file, fileList) {
        this.fileList = fileList
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      onUsersUpload (data) {
        if (data && data.code === 0) {
          if (this.$refs.uploadFile) {
            this.getDataList()
            this.$message.success('保存成功')
          }
        } else {
          this.$message.error(data.msg)
        }
      },
      beforeUpload (file) {
        const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          })
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'warning'
          })
        }
        return (extension || extension2) && isLt2M
      },
      templateDownload () {
        // 表头
        this.tHeader = [
          '学院',
          '班级',
          '学号',
          '姓名',
          '手机号'
        ]
        this.$confirm('确定下载该文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.export2Excel()
        }).catch(() => {
        })
      },
      export2Excel () {
        const _this = this
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('@/vendor/Export2Excel')
          const tHeader = _this.tHeader
          const filterVal = _this.filterVal
          const data = _this.formatJson(filterVal, [])
          export_json_to_excel(tHeader, data, '学生账号导入模板')
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
