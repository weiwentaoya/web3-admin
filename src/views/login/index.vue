<template>
  <div class="login-page__wrap">
    <el-card>
      <h2>Joker 管理后台</h2>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="ruleForm.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label-width="0">
          <el-button
            style="margin: 20px auto 0"
            type="primary"
            @click="submitForm(ruleFormRef)"
          >
            登 陆
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { adminLogin } from '@/api'
import { useAppStore } from '@/store/modules/app'
const store = useAppStore()
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  account: 'admin',
  password: 'admin123',
})

const rules = reactive<FormRules>({
  account: [
    { required: true, message: 'Please input account', trigger: 'blur' },
    { min: 3, max: 12, message: 'Length should be 3 to 12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, max: 12, message: 'Length should be 6 to 12', trigger: 'blur' },
  ],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // 创建一个SHA-256哈希对象
      const sha256Hash = crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(ruleForm.password),
      )

      // 将哈希结果转换为16进制字符串
      const hashedPassword = Array.from(new Uint8Array(await sha256Hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      const res = await adminLogin({
        account: ruleForm.account,
        password: hashedPassword,
      })
      store.setToken(res.data.token)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.login-page__wrap {
  width: 540px;
  margin: 240px auto 0;
  h2 {
    font-size: 32px;
    font-weight: 600;
    text-align: center;
    padding: 24px 0 48px;
  }
}
</style>
