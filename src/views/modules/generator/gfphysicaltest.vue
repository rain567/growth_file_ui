<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('generator:gfphysicaltest:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('generator:gfphysicaltest:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="id"
        header-align="center"
        align="center"
        label="id">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="体测姓名">
      </el-table-column>
      <el-table-column
        prop="userNo"
        header-align="center"
        align="center"
        label="学号">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="体测学生">
      </el-table-column>
      <el-table-column
        prop="longRun"
        header-align="center"
        align="center"
        label="长跑">
      </el-table-column>
      <el-table-column
        prop="chinUp"
        header-align="center"
        align="center"
        label="引体向上">
      </el-table-column>
      <el-table-column
        prop="standingLongJump"
        header-align="center"
        align="center"
        label="立定跳远">
      </el-table-column>
      <el-table-column
        prop="seatBodyAnteflexion"
        header-align="center"
        align="center"
        label="左立体前屈">
      </el-table-column>
      <el-table-column
        prop="sprint"
        header-align="center"
        align="center"
        label="短跑">
      </el-table-column>
      <el-table-column
        prop="pulmonary"
        header-align="center"
        align="center"
        label="肺活量">
      </el-table-column>
      <el-table-column
        prop="weight"
        header-align="center"
        align="center"
        label="体重">
      </el-table-column>
      <el-table-column
        prop="longRunScore"
        header-align="center"
        align="center"
        label="长跑得分">
      </el-table-column>
      <el-table-column
        prop="chinUpScore"
        header-align="center"
        align="center"
        label="引体向上得分">
      </el-table-column>
      <el-table-column
        prop="standingLongJumpScore"
        header-align="center"
        align="center"
        label="立定跳远得分">
      </el-table-column>
      <el-table-column
        prop="seatBodyAnteflexionScore"
        header-align="center"
        align="center"
        label="左立体前屈得分">
      </el-table-column>
      <el-table-column
        prop="sprintScore"
        header-align="center"
        align="center"
        label="短跑得分">
      </el-table-column>
      <el-table-column
        prop="pulmonaryScore"
        header-align="center"
        align="center"
        label="肺活量得分">
      </el-table-column>
      <el-table-column
        prop="statureWeightScore"
        header-align="center"
        align="center"
        label="身高体重得分">
      </el-table-column>
      <el-table-column
        prop="stature"
        header-align="center"
        align="center"
        label="身高">
      </el-table-column>
      <el-table-column
        prop="sex"
        header-align="center"
        align="center"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="faculty"
        header-align="center"
        align="center"
        label="所在学院">
      </el-table-column>
      <el-table-column
        prop="operator"
        header-align="center"
        align="center"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
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
  import AddOrUpdate from './gfphysicaltest-add-or-update'
  export default {
    data () {
      return {
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
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/gfphysicaltest/list'),
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
            url: this.$http.adornUrl('/generator/gfphysicaltest/delete'),
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
