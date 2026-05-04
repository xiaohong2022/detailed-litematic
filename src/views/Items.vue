<script setup lang="ts">
import { Select, Table } from '@arco-design/web-vue';
import type { Litematic, LitematicRegion } from '../types'
import { formatItemNumber, getItemMaxStackSize, isUseOnlyItem, itemIdToImageURL, itemIdToName } from '../utils/item';
import { getItemMatirial } from '../utils/parse';
import { computed, ref } from 'vue';

const props = defineProps<{
    data: Litematic
}>()

const expandedKeys = ref([]);

const columns = [
    {
        title: '物品',
        slotName: 'id',
    },
    {
        title: '数量 (或使用次数)',
        slotName: 'num',
        sortable: {
            sortDirections: ['ascend']
        },
    }
];

const selectedRegions = ref(Object.keys(props.data.Regions));


const matirials = computed(() => {
    const r: Record<string, ReturnType<typeof getItemMatirial>> = {}
    // 如果解析出现错误并且被vue捕捉到，vue会重新渲染整个组件，然后又捕捉到错误，如此循环
    // 所以这里要自行捕捉一下错误，以防陷入死循环
    try {
        for (let k in props.data.Regions) {
            let v = props.data.Regions[k];

            r[k] = getItemMatirial(v as LitematicRegion)
        }

    } catch (e) {
        console.error(e);
        alert("解析物品时出现错误！建议把文件以及报错报告给开发者！\n错误信息：" + String(e));
    }

    return r;

})


const data = computed(() => {
    if (Object.values(props.data.Regions).length === 0) return [];

    const _list: ReturnType<typeof getItemMatirial> = []

    for (let k of selectedRegions.value) {

        let v = matirials.value[k];
        if (!v) continue;

        _list.push(...v);
    }

    // 合并一下
    const list: ReturnType<typeof getItemMatirial> = []
    for (let v of _list) {
        let theSameItem = list.find(v1 => v1.id == v.id);

        if (theSameItem) {
            theSameItem.num += v.num;

            // 子项
            if (v.children?.length) {
                if (!theSameItem.children) theSameItem.children = []

                let target = theSameItem.children;
                for (let v2 of v.children) {
                    let theSameItem = target.find(v1 => v1.id == v2.id);

                    if (theSameItem) {
                        theSameItem.num += v2.num;
                    }
                    else target.push(structuredClone(v2));
                }

                target.sort((a, b) => b.num - a.num)
            }
        }
        else list.push(structuredClone(v));
    }

    return list.sort((a, b) => b.num - a.num);
})

const useInfinityWater = ref(true)
const ignoreContainer = ref(false)
const ignoreTechnicalItem = ref(false)

const _calc_num = (b: any) => {
    // 水桶判断
    if (b.id === "water_bucket" && useInfinityWater.value && !b.container) return 0;

    if (b.container && ignoreContainer.value) return 0;

    if ([
        "barrier",
        "command_block",
        "repeating_command_block",
        "chain_command_block",
        "test_block",
        "test_instance_block",
        "debug_stick",
        "command_block_minecart",
        "structure_block",
        "structure_void",
        "knowledge_book",
        "jigsaw",
        "light"
    ].includes(b.id) && ignoreTechnicalItem.value) return 0;

    // 如果是只能使用的物品（如锄头，打火石）并且不是用于填充容器的，只算一个物品
    return (isUseOnlyItem(b.id) && !b.container) ? 1 : b.num;
};

// 总物品数
const totalNum = computed(() => {
    useInfinityWater.value; // 让vue跟踪一下这个更改

    let waterBucketNum = 0;
    const _calc_num_ = (b: any) => {
        if (b.id === "water_bucket" && useInfinityWater.value && !b.container) waterBucketNum++
        return _calc_num(b);
    }

    let num = data.value.reduce((a, b) => {
        let r = _calc_num_(b);
        if (b.children) r += b.children.reduce((a, b) => a + _calc_num_(b), 0)

        return a + r;
    }, 0);

    return num + Math.min(waterBucketNum, 2 /* 两桶水就能搞一个无限水了 */);
})

// 物品占据多少组
const totalGroups = computed(() => {
    useInfinityWater.value; // 让vue跟踪一下这个更改

    let _groups_map: Record<string, number> = {};

    for (let item of data.value) {
        let id = item.id;
        if (!_groups_map[id]) _groups_map[id] = 0;

        _groups_map[id] += _calc_num(item);

        if (item.children) {
            for (let item2 of item.children) {
                let id = item2.id;
                if (!_groups_map[id]) _groups_map[id] = 0;

                _groups_map[id] += _calc_num(item2);
            }
        }
    }

    let groups = 0;
    for (let [k, v] of Object.entries(_groups_map)) {
        if (k == 'water_bucket' && useInfinityWater.value) {
            groups += 2; // 使用无限水
            continue;
        }

        let maxStack = getItemMaxStackSize(k);
        groups += Math.ceil(v / maxStack);
    }

    return groups;
})

// const data = [
//     { id: "water_bucket", num: 10 },
//     { id: "oak_leaves", num: 5 },
//     { id: "experience_bottle", num: 5 },
//     { id: "iron_golem_spawn_egg", num: 1 },
//     { id: "music_disc_otherside", num: 1 },
//     { id: "disc_fragment_5", num: 1 },
//     { id: "spruce_chest_boat", num: 1 },
//     { id: "pink_bed", num: 1 },
// ];
</script>

<template>
    <div>
        <Select style="margin-bottom: 12px" v-model="selectedRegions" multiple>
            <Select.Option v-for="k in Object.keys(props.data.Regions)">{{ k }}</Select.Option>
        </Select>
        <!-- @vue-ignore -->
        <Table :columns="columns" :data="data" :sticky-header="true" :pagination="false"
            v-model:expandedKeys="expandedKeys" :summary="true">
            <template #id="{ record }">
                <div class="item-name">
                    <img :src="itemIdToImageURL(record.id)" draggable="false">
                    <span>{{ itemIdToName(record.id, record.components) }}</span>
                </div>
            </template>
            <template #num="{ record }">
                {{ formatItemNumber(record.id, record.num, record.container) }}
            </template>

            <template #summary-cell="{ column }">
                <div v-if="column.title == '物品'">
                    <span style="margin-left: 4px">总计</span><br>
                    <div style="display: flex; flex-direction: row;margin-top: 4px; flex-wrap: wrap; gap: 2px">
                        <a-checkbox v-model="useInfinityWater">使用无限水</a-checkbox>
                        <a-checkbox v-model="ignoreContainer">忽略填充</a-checkbox>
                        <a-checkbox v-model="ignoreTechnicalItem">忽略管理员物品</a-checkbox>
                    </div>
                </div>
                <span v-else>{{ totalNum }}, 约 {{ (totalGroups / 27).toFixed(2) }} 潜影盒</span>
            </template>
        </Table>
    </div>
</template>

<style lang="css" scoped>
.item-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
}
</style>