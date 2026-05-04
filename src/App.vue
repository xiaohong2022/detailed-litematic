<script setup lang="ts">
import { Button, Layout, Upload, Space, type FileItem } from '@arco-design/web-vue'
import { IconClose } from '@arco-design/web-vue/es/icon'
import * as NBT from "nbtify";
import { ref, watch } from 'vue';

import ItemsView from './views/Items.vue'

import type { Litematic } from './types'

const fileItems = ref<FileItem[]>([])
const fileError = ref("")
const fileName = ref("")
const nbtData = ref<Litematic | null>(null)

watch(fileItems, (newval) => {

  if (!newval.length) return;

  fileError.value = "";

  // 获取上传的文件
  const fileItem = newval[0];
  if (!fileItem || !fileItem.file) {
    fileError.value = "好像出了点问题，重新上传试试？";
    return
  }

  fileName.value = (fileItem.file as File).name;

  // 读取文件
  const reader = new FileReader()
  reader.addEventListener("load", async () => {
    if (!reader.result) {
      fileError.value = "好像出了点问题，重新上传试试？";
      return
    }

    try {
      // 解析NBT数据
      const { data } = await NBT.read<Litematic>(reader.result as ArrayBuffer);

      // 校验投影文件
      if (
        data.Metadata &&
        data.MinecraftDataVersion &&
        data.Version &&
        data.Regions
      ) {
        nbtData.value = data as Litematic;
        fileItems.value = [];
        // console.log(nbtData.value);
      } else {
        fileError.value = "这文件貌似不是 .litematic 文件，换个重新上传试试？";
      }
    } catch (e) {
      // 解析出错，直接打印
      fileError.value = "啊哦，解析出错了！" + e;

    }
      // console.log(nbtData.value);
  })

  reader.readAsArrayBuffer(fileItem.file)

})

// 有报错时，自动清空上传的文件
watch(fileError, (newval) => {
  if (newval.length) {
    fileItems.value = [];
  }
})

</script>

<template>
  <Layout style="height: 100vh;" v-if="!nbtData">
    <div style="max-width: 960px; width: 100%; position: relative; margin: 5% auto">
      <Upload v-model:file-list="fileItems" draggable :auto-upload="false" :show-file-list="false" :="fileItems.length ? {
        disabled: true,
        tip: '解析文件中...'
      } : {}"></Upload>
      <p style="color: red"> {{ fileError }}</p>

      <p><a href="https://github.com/xiaohong2022/detailed-litematic" target="_blank">Github</a></p>
    </div>
  </Layout>

  <Layout style="height: 100vh" v-else>
    <Layout.Header style="padding: 12px 12px 0">
      <Space>
        <Button shape="round" type="text" size="large" @click="() => {
          nbtData = null;
        }">
          <template #icon>
            <IconClose style="color: #fff"></IconClose>
          </template>
        </Button>
        <div>{{ nbtData.Metadata.Name }}</div>
      </Space>
    </Layout.Header>
    <Layout.Content style="padding: 12px">
      <ItemsView :data="nbtData" />
    </Layout.Content>
  </Layout>
</template>