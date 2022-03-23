<template>
  <div>
    <div>
      {{ dataForm.content || '暂无' }}
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          userId: this.$store.state.user.id,
          originUserId: this.$store.state.user.id,
          content: '',
          type: 1,
          operator: '',
          remark: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '创建用户id不能为空', trigger: 'blur' }
          ],
          originUserId: [
            { required: true, message: '被评论者id不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '评论内容不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '评论者身份不能为空', trigger: 'blur' }
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
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/generator/gfcomment/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 10,
            'originUserId': this.$store.state.user.id,
            'type': 2
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let dataOne = data.page.list[0]
            if (dataOne) {
              this.dataForm.id = dataOne.id
              this.dataForm.userId = dataOne.userId
              this.dataForm.content = dataOne.content
              this.dataForm.type = dataOne.type
            }
          } else {
          }
          this.dataListLoading = false
        })
      }
    }
  }
</script>
