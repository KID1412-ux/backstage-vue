<template>
  <div>
    <el-row>
      <el-col :offset="7" :span="10">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>商品分类信息维护</span>
            <el-button style="float: right; padding: 3px 0" @click="addDialogVisible = true" type="text">添加顶层分类
            </el-button>
          </div>
          <div class="text item">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
            <el-tree :data="data"
                     node-key="id"
                     :props="defaultProps"
                     :expand-on-click-node="false"
                     default-expand-all
                     :filter-node-method="filterNode"
                     ref="tree"
                     v-loading="loading"
            >
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => change(data)"
          >
            Change
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
        </span>
      </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" center @close="resetAddForm('addForm')">
      <el-form :rules="rules" :model="addFrom" ref="addForm">
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <el-select v-model="addFrom.parentId" placeholder="请选择父级分类" disabled>
            <el-option :label="typeName" :value="addFrom.parentId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="goodsTypeName">
          <div style="width: 220px;">
            <el-input v-model="addFrom.goodsTypeName" placeholder="输入分类名称" autocomplete="off" clearable></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改分类" :visible.sync="updateDialogVisible" center @open="" @close="resetUpdateForm('updateFrom')">
      <el-form :rules="rules" :model="updateFrom" ref="updateFrom">
        <el-form-item label="父级分类" :label-width="formLabelWidth" prop="parentId">
          <el-cascader
            ref="organizerUnit"
            v-model="updateFrom.parentId"
            :options="data"
            :key="keyValue"
            :show-all-levels="false"
            placeholder="无"
            :props="{ expandTrigger: 'hover', checkStrictly: true, emitPath: false, value: 'id' }"
            clearable
            filterable
            @change="organizerUnit"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="goodsTypeName">
          <div style="width: 220px;">
            <el-input v-model="updateFrom.goodsTypeName" placeholder="输入分类名称" autocomplete="off" clearable></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateForm('updateFrom')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "type_maintain",
  data() {
    return {
      loading: true,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      addDialogVisible: false,
      formLabelWidth: '120px',
      addFrom: {parentId: 0, goodsTypeName: ''},
      typeName: '无',
      rules: {
        goodsTypeName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ],
        parentId: [
          {required: true, message: '请选择父级分类', trigger: 'change'}
        ]
      },
      updateDialogVisible: false,
      updateFrom: {id: '', parentId: '', goodsTypeName: ''},
      keyValue: 1,
      obj: {}
    }
  },
  methods: {
    getData() {
      this.continuousLoad();
      var _this = this;
      this.$axios.post("goodsMain/showType").then(function (result) {
        _this.data = result.data;
      }).catch();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    continuousLoad() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    submitAddForm(formName) {
      var _this = this;

      function saveType() {
        var params = new URLSearchParams();
        params.append("goodsTypeName", _this.addFrom.goodsTypeName);
        params.append("parentId", _this.addFrom.parentId);
        return _this.$axios.post("goodsMain/saveType", params);
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveType().then(function (result) {
            _this.resetAddForm('addForm');
            _this.$message({
              message: '添加成功！',
              showClose: true,
              type: 'success'
            });
            _this.getData();
          }).catch();
        } else {
          return false;
        }
      });
    },
    submitUpdateForm(formName) {
      var _this = this;

      function updateTypeById() {
        var params = new URLSearchParams();
        params.append("id", _this.updateFrom.id);
        params.append("goodsTypeName", _this.updateFrom.goodsTypeName);
        params.append("parentId", _this.updateFrom.parentId);
        return _this.$axios.post("goodsMain/updateTypeById", params);
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateTypeById().then(function (result) {
            _this.resetUpdateForm('updateFrom');
            _this.$message({
              message: '修改成功！',
              showClose: true,
              type: 'success'
            });
            _this.getData();
          }).catch();
        } else {
          return false;
        }
      });
    },
    resetAddForm(formName) {
      this.$refs[formName].resetFields();
      this.addFrom.parentId = 0;
      this.addFrom.goodsTypeName = '';
      this.typeName = '无';
      this.addDialogVisible = false;
    },
    resetUpdateForm(formName) {
      this.$refs[formName].resetFields();
      this.updateFrom.parentId = '';
      this.updateFrom.goodsTypeName = '';
      this.data.splice(this.data.findIndex(item => item.id == 0), 1);
      this.obj.disabled = false;
      this.obj = {};
      this.updateDialogVisible = false;
    },
    append(data) {
      this.addFrom.parentId = data.id;
      this.typeName = data.label;
      this.addDialogVisible = true;
    },
    change(data) {
      this.obj = data;
      this.data.push({
        children: null,
        disabled: false,
        id: 0,
        isLeaf: false,
        label: "无",
        parentId: 0
      })
      this.updateFrom.id = data.id;
      this.updateFrom.parentId = data.parentId;
      this.updateFrom.goodsTypeName = data.label;
      data.disabled = true;
      this.updateDialogVisible = true;
    },
    remove: function (node, data) {
      var _this = this;

      function removeTypeById(id) {
        var params = new URLSearchParams();
        params.append("id", id);
        return _this.$axios.post("goodsMain/removeTypeById", params);
      }

      function removeTypeByIds(ids) {
        return _this.$axios({
          method: 'post',
          url: 'goodsMain/removeTypeByIds',
          data: JSON.stringify(ids),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        });
      }

      function deepTraversal(data) {
        const result = [];
        data.forEach(item => {
          const loop = data => {
            result.push({
              id: data.id,
              goodsTypeName: data.label,
              parentId: data.parentId
            });
            let child = data.children;
            if (child) {
              for (let i = 0; i < child.length; i++) {
                loop(child[i]);
              }
            }
          };
          loop(item);
        });
        return result;
      }

      function info() {
        _this.$message({
          message: '删除成功！',
          showClose: true,
          type: 'success'
        });
      }

      function process() {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const ary = children.filter(d => d.id === data.id);
        const nary = deepTraversal(ary);
        const ids = [];
        for (let i = 0; i < nary.length; i++) {
          ids.push(nary[i].id);
        }
        removeTypeByIds(ids).then(function (result) {
          info();
          _this.getData();
        }).catch();
      }

      if (data.children == null) {
        var id = data.id;
        removeTypeById(id).then(function (result) {
          info();
          _this.getData();
        }).catch();
      } else {
        this.$confirm('此操作将永久删除该分类及其子分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          process()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    organizerUnit(a) {
      if (this.$refs.organizerUnit) {
        this.$refs.organizerUnit.dropDownVisible = false;
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    data(newVal) {
      this.keyValue++;
    }
  },
  created() {
    this.getData();
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 530px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
