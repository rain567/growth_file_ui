<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('generator:gfscore:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('generator:gfscore:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button type="info" @click="templateDownload()">下载导入模板</el-button>
        <el-upload
          :action="baseUrl + '/generator/gfscore/batchSave'"
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
        prop="institute"
        header-align="center"
        align="center"
        label="学院">
      </el-table-column>
      <el-table-column
        prop="className"
        header-align="center"
        align="center"
        label="班级">
      </el-table-column>
      <el-table-column
        prop="studentName"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="studentNo"
        header-align="center"
        align="center"
        label="学号">
      </el-table-column>
      <el-table-column
        prop="course"
        header-align="center"
        align="center"
        label="考试科目">
      </el-table-column>
      <el-table-column
        prop="teacher"
        header-align="center"
        align="center"
        label="任课老师">
      </el-table-column>
      <el-table-column
        prop="score"
        header-align="center"
        align="center"
        label="分数">
      </el-table-column>
      <el-table-column
        prop="credit"
        header-align="center"
        align="center"
        label="学分">
      </el-table-column>
      <el-table-column
        prop="examTime"
        header-align="center"
        align="center"
        label="考试时间">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="考试类别">
      </el-table-column>
      <el-table-column
        prop="pattern"
        header-align="center"
        align="center"
        label="考试方式">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './gfscore-add-or-update'
  export default {
    data () {
      return {
        baseUrl: '',
        tHeader: [],
        filterVal: [],
        fileList: [],
        dataForm: {
          key: ''
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
          '姓名',
          '学号',
          '考试科目',
          '任课老师',
          '分数',
          '学分',
          '考试时间',
          '考试类别',
          '考试方式'
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
          // const filterVal = _this.filterVal
          const data = _this.formatJson(tHeader, [{
            '学院': '计算机科学与技术',
            '班级': '18计科2',
            '姓名': '模板',
            '学号': '1840060001',
            '考试科目': 'python',
            '任课老师': '测试',
            '分数': '100',
            '学分': '2',
            '考试时间': '2022-01-01 00:00:00',
            '考试类别': '公共',
            '考试方式': '考试'
          }])
          export_json_to_excel(tHeader, data, '学业成绩导入模板')
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/gfscore/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generator/gfscore/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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
        })
      }
    }
  }
</script>
