<template>
  <el-drawer
    :title="pageTitle"
    :visible.sync="show"
    size="80%"
    direction="rtl"
    append-to-body
  >
    <div v-loading="loading" style="position: relative;">
      <div style="display: flex;">
        <div style="padding: 0 12px;">
          <tree-directory :active.sync="tabActive" :tree="directoryTree" />
        </div>
        <code-editor v-if="activeItem" :value="activeItem.code" height="100%" style="flex: 1;" :mode="activeItem.mode" />
        <el-empty v-else style="flex: 1;" />
      </div>
      <el-button class="copy-btn" type="warning" size="mini" icon="el-icon-document-copy" @click="onCopy">复制代码</el-button>
    </div>
  </el-drawer>
</template>

<script>
import CodeEditor from '@/components/CodeEditor/index.vue'
import { preview } from '@/api/system/generate'
import TreeDirectory from '@/views/tools/generate/TreeDirectory/index.vue'

export default {
  name: 'GeneratePreview',
  components: { TreeDirectory, CodeEditor },
  data() {
    return {
      show: false,
      tabActive: null,

      loading: false,
      list: [],

      directoryTree: []
    }
  },
  computed: {
    pageTitle() {
      return '代码预览'
    },
    activeItem() {
      return this.list.find(item => item.name === this.tabActive)
    }
  },
  methods: {
    open(row) {
      Object.assign(this.$data, this.$options.data())
      this.show = true

      this.loading = true
      preview({
        tableName: row.tableName
      }).then(res => {
        this.list = (res.data || []).map(item => {
          item.mode = this.convertMode(item.type)
          return item
        })
        this.tabActive = this.list[0].name

        // 构建树形目录
        this.directoryTree = buildTree(this.list);
      }).finally(() => {
        this.loading = false
      })

    },
    onCopy() {
      const _this = this
      const code = this.list.find(item => item.name === this.tabActive).code
      this.$copyText(code).then(function () {
        _this.$message.success('复制成功')
      }, function (e) {
        _this.$message.error('复制失败')
        console.error(e)
      })
    },
    convertMode(type) {
      switch (type) {
        case 'java':
          return 'text/x-java'
        case 'xml':
          return 'application/xml'
        case 'js':
          return 'text/javascript'
        case 'vue':
          return 'text/x-vue'
        case 'sql':
          return 'text/x-mysql'
      }
      return 'text/x-java'
    }
  }
}

function buildTree(data) {
  const root = { name: '', children: [] };
  const treeMap = { '': root };

  data.forEach(item => {
    const pathParts = item.path.split('/');
    let parent = root;

    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!treeMap[part]) {
        const node = { name: part, children: [] };
        treeMap[part] = node;
        parent.children.push(node);
      }
      parent = treeMap[part];
    }

    parent.children.push({
      name: item.name,
      code: item.code,
      type: item.type,
      mode: item.mode
    });
  });

  return root.children;
}

</script>

<style lang='scss' scoped>
.copy-btn {
  position: fixed;
  top: 100px;
  right: 5%;
}
</style>
