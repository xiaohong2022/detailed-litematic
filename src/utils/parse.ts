
import type { LitematicRegion, LitematicBlockStatePalette, LitematicVec, LitematicEntity, LitematicTileEntity } from '../types'

interface ParsedItem {
    id: string,
    within?: string,
    container?: boolean
}

interface ResultItem {
    key: string,
    id: string,
    num: number,
    children?: Omit<ResultItem, 'children'>[], // TODO 目前暂没考虑有三层以上 children 的情况
    container?: boolean
}

interface ResultMapItem {
    num: number,
    children?: Record<string, ResultMapItem>,
    container?: boolean
}



// 生成唯一键的函数，避免JSON.stringify
const makeKey = (id: string, within?: string): string => {
    return within === undefined ? id : `${id}|${within}`;
};

// 解析键的函数
const parseKey = (key: string): { id: string; within?: string } => {
    const parts: string[] = key.split('|');
    if (parts.length === 1) {
        return { id: parts[0] as string };
    }
    return { id: parts[0] as string, within: parts[1] };
};

export function getItemMatirial(region: LitematicRegion) {

    // console.log('Start Parsing', region);

    const items: ParsedItem[] = [];

    // 解析方块
    let s = region.Size;
    const size = {
        x: Math.abs(s.x),
        y: Math.abs(s.y),
        z: Math.abs(s.z),
    }
    // console.log('Region Size', size);

    // console.log('Parsing Blocks');
    for (let x = 0; x < size.x; x++) {
        for (let y = 0; y < size.y; y++) {
            for (let z = 0; z < size.z; z++) {
                let state = getBlockStateAt(x, y, z, size, region.BlockStatePalette, region.BlockStates);
                if (!state) continue;

                let res = parseBlockToItem(state);
                if (!res) continue
                // console.log(x, y, z,)
                items.push(...res)
            }
        }
    }

    // console.log('Parsing Entity');
    // 解析实体
    for (let entity of region.Entities) {
        let res = parseEntityToItem(entity);
        if (!res) continue
        items.push(...res)
    }


    // console.log('Parsing Block Entity');
    // 解析方块实体
    for (let entity of region.TileEntities) {
        let blockId;

        // 为了更好的知道该方块实体对应的是哪个方块，还需要分析一遍该位置的方块
        // TODO：为了更好的性能，后面会把这一部分和方块解析同时进行。
        let state = getBlockStateAt(entity.x, entity.y, entity.z, size, region.BlockStatePalette, region.BlockStates)
        if (state) {
            let res = parseBlockToItem(state);
            if (res) blockId = res[0]?.id
        }

        let res = parseTileEntityToItem(entity, blockId || String(entity.id.split("minecraft:")[1]));
        if (!res) continue
        items.push(...res)
    }


    // console.log('Total Items', items);


    // 第一步：重新排序键，去除一些可能会引起问题的项
    const validItems: ParsedItem[] = [];
    for (const v of items) {
        if (!v.id) continue;
        validItems.push({
            id: v.id,
            within: v.within || undefined,
            container: v.container || false,
        });
    }

    // console.log('Valid Items', validItems);

    // 第二步：使用Map进行分组计数
    const groupMap = new Map<string, number>();

    for (const item of validItems) {
        const key = makeKey(item.id, item.within);
        groupMap.set(key, (groupMap.get(key) || 0) + 1);
    }
    // console.log('Group Map', groupMap);

    // 第三步：分离有/无within的项
    const noWithinKeys: string[] = [];
    const hasWithinKeys: string[] = [];

    for (const key of groupMap.keys()) {
        const { within } = parseKey(key);
        if (within === undefined) {
            noWithinKeys.push(key);
        } else {
            hasWithinKeys.push(key);
        }
    }

    // console.log('No Within Keys', noWithinKeys);
    // console.log('Has Within Keys', hasWithinKeys);

    // 第四步：使用Map存储结果（比Record性能更好）
    const resultMap = new Map<string, ResultMapItem>();

    // 处理无within的项
    for (const key of noWithinKeys) {
        const { id } = parseKey(key);
        const num = groupMap.get(key)!;

        const existing = resultMap.get(id);
        if (existing) {
            existing.num += num;
        } else {
            resultMap.set(id, { num });
        }
    }


    // 处理有within的项
    for (const key of hasWithinKeys) {
        const { id, within } = parseKey(key);
        const num = groupMap.get(key)!;
        const container = validItems.find(v => v.id === id && v.within === within)?.container || false;

        if (within && resultMap.has(within)) {
            const parent = resultMap.get(within)!;
            if (!parent.children) {
                parent.children = {};
            }

            const target = parent.children;
            if (target[id]) {
                target[id].num += num;
            } else {
                target[id] = { num, container };
            }
        } else {
            const existing = resultMap.get(id);
            if (existing) {
                existing.num += num;
                if (container && !existing.container) {
                    existing.container = container;
                }
            } else {
                resultMap.set(id, { num, container });
            }
        }
    }
    // console.log('Result Map', resultMap);

    // 转换函数
    const mapToList = (map: Map<string, ResultMapItem>, depth: number = 0): ResultItem[] => {
        const result: ResultItem[] = [];

        for (const [id, item] of map.entries()) {
            const children = item.children
                ? mapToList(new Map(Object.entries(item.children)), depth + 1)
                : undefined;

            result.push({
                key: `${id}#${depth}`, // 为了 Table 组件的子树能够正常展开，这里还需要一个 key
                id,
                num: item.num,
                ...(item.container !== undefined && { container: item.container }),
                ...(children && { children })
            });
        }

        return result.sort((a, b) => b.num - a.num);
    };

    const result = mapToList(resultMap);
    // console.log('Final Result', result);

    return result;
}

function getNamespaceId(namespace: string) {
    return String(namespace.split("minecraft:")[1]);
}

function parseBlockToItem({ Name, Properties }: LitematicBlockStatePalette): ParsedItem[] | null {
    Properties = Properties || {};

    let result: ParsedItem[] = [];

    const itemId = getNamespaceId(Name);


    // 技术性方块
    if ([
        "minecraft:air", // 空气
        "minecraft:void_air",
        "minecraft:cave_air",
        "minecraft:piston_head", // 活塞头
        // "minecraft:structure_void",
        "minecraft:end_gateway", // 传送门
        "minecraft:end_portal",
        "minecraft:nether_portal",
        "minecraft:frosted_ice",  // 霜冰
    ].includes(Name)) return null;

    // 气泡柱，虽然没有物品，但貌似都是含水的，直接进行下面的含水检测把
    else if (Name === "minecraft:bubble_column") { }

    // 墙上的xxx
    else if (Name.startsWith("minecraft:wall_")) result.push({
        id: String(Name.split("minecraft:wall_")[1])
    })
    // 嗯对的，非常特别的是，有些墙上方块，他的wall，拼写在中间，例如 oak_wall_sign 墙上的橡木告示牌
    else if (Name.includes("_wall_")) {
        let rm = Name.split("_wall_").join("_") // 直接把中间的 _wall_ 换成 _
        result.push({
            id: String(rm.split("minecraft:")[1])
        })
    }

    // 可疑沙砾沙子，这种貌似可以获得其物品
    // else if (Name === "minecraft:suspicious_gravel")  result.push({
    //     id: "gravel"
    // })

    // 火，需要用到打火石
    else if (Name === 'minecraft:fire' || Name === "minecraft:soul_fire") result.push({
        id: "flint_and_steel"
    })

    // 营火
    else if (Name === 'minecraft:campfire' || Name === "minecraft:soul_campfire") {
        result.push({
            id: itemId
        })

        // 如果灭了，并且没含水，则需要用到铲子
        if (Properties.lit === "false" && Properties.waterlogged === "false") {
            result.push({
                id: "wooden_shovel",
                within: Name.split("minecraft:")[1]
            })
        }
    }

    // 蜡烛
    else if (Name === 'minecraft:candle' || Name.endsWith("_candle")) {
        // 蜡烛也是可以叠放的
        for (let i = 0; i > Number(Properties.candles); i++) {
            result.push({
                id: itemId
            })
        }

        // 如果亮了，则需要用到打火石
        if (Properties.lit === "true") {
            result.push({
                id: "flint_and_steel",
                within: itemId
            })
        }
    }

    // 插上蜡烛的蛋糕
    else if (Name === "minecraft:candle_cake" || Name.endsWith("_candle_cake")) { // 匹配 candle_cake 以及 *_candle_cake
        // 需要蛋糕
        result.push({
            id: 'cake'
        })

        // 需要一个对应的蜡烛
        result.push({
            id: String(Name.split("minecraft:")[1]?.split("_cake")[0]), // 去掉 minecraft: 前缀 以及 _cake 后缀
            within: "cake"
        })

        // 如果亮了，则需要用到打火石
        if (Properties.lit === "true") {
            result.push({
                id: "flint_and_steel",
                within: "cake"
            })
        }
    }

    // 耕地这些不能直接获取的，需要用到锄头
    else if (Name === 'minecraft:farmland') result.push(
        {
            id: "dirt"
        },
        {
            id: "wooden_hoe",
            within: "dirt"
        })

    // 绊线
    else if (Name === 'minecraft:tripwire') result.push({
        id: "string"
    })

    // 紫颂果
    else if (Name === 'minecraft:chorus_plant' || Name === 'minecraft:chorus_flower') result.push({
        id: "chorus_flower"
    })

    // 竹笋
    else if (Name === 'minecraft:bamboo_sapling') result.push({
        id: "bamboo"
    })

    // 洞穴藤蔓
    else if (Name === 'minecraft:cave_vines' || Name === 'minecraft:cave_vines_plant') {
        result.push({
            id: "glow_berries"
        })

        // 如果有长浆果的，可能需要骨粉
        if (Properties.berries === "true") result.push({
            id: "bone_meal",
            within: "glow_berries"
        })

        // 如果age是25，可能需要用到剪刀
        if (Properties.age === "25") result.push({
            id: "shears",
            within: "glow_berries"
        })
    }

    // 缠怨藤，垂泪藤
    else if (Name === "minecraft:weeping_vines_plant" || Name === "minecraft:twisting_vines_plant") {
        result.push({
            id: "weeping_vines"
        })
    }

    // TODO 蜂巢、蜂箱 
    // else if (Name === 'minecraft:beehive' || Name === 'minecraft:bee_nest') result.push({
    //     id: ""
    // })

    // 堆肥桶
    else if (Name === 'minecraft:composter') {
        result.push({
            id: "composter"
        })

        let level = Number(Properties.level)
        if (level > 0 && level < 2) { // 没堆肥，只要有东西放入，堆肥层必定+1
            result.push({
                id: "wheat_seeds",  // 小麦种子容易获得，这里就是用它
                within: "composter",
            })
        } else {
            for (let i = 0; i < 3 * (level - 1); i++) { // 小麦种子有 30% 使层级+1，所以每一层期望值约为3
                result.push({
                    id: "wheat_seeds",
                    within: "composter",
                })
            }
        }

    }
    // 甜菜
    else if (Name === 'minecraft:beetroots') result.push({
        id: "beetroot_seeds"
    })
    // 小麦
    else if (Name === 'minecraft:wheat') result.push({
        id: "wheat_seeds"
    })
    // 胡萝卜
    else if (Name === 'minecraft:carrots') result.push({
        id: "carrot"
    })
    // 马铃薯
    else if (Name === 'minecraft:potatoes') result.push({
        id: "potato"
    })
    // 可可豆
    else if (Name === 'minecraft:cocoa') result.push({
        id: "cocoa_beans"
    })
    // 西瓜
    else if (Name === 'minecraft:melon_stem') result.push({
        id: "melon_seeds"
    })
    // 南瓜
    else if (Name === 'minecraft:pumpkin_stem') result.push({
        id: "pumpkin_seeds"
    })
    // 甜浆果
    else if (Name === 'minecraft:sweet_berry_bush') result.push({
        id: "sweet_berries"
    })
    // 高海草
    else if (Name === 'minecraft:tall_seagrass') result.push({
        id: "seagrass"
    })

    // 细雪桶
    else if (Name === 'minecraft:powder_snow') result.push({
        id: "powder_snow_bucket"
    })


    // 雪，可以堆叠八层
    else if (Name === "minecraft:snow") {
        // 按照个数添加
        for (let i = 0; i < Number(Properties.layers); i++) {
            result.push({
                id: 'snow'
            });
        }
    }

    // 海龟蛋
    else if ([
        "minecraft:turtle_egg",
    ].includes(Name)) {
        // 按照个数添加
        for (let i = 0; i < Number(Properties.eggs); i++) {
            result.push({
                id: 'turtle_egg'
            });
        }
    }
    // 泡海菜
    else if ([
        "minecraft:sea_pickle",
    ].includes(Name)) {
        // 按照个数添加
        for (let i = 0; i < Number(Properties.pickles); i++) {
            result.push({
                id: 'sea_pickle'
            });
        }
    }

    // 枯叶这一类可以叠放的方块
    else if ([
        "minecraft:leaf_litter",
        "minecraft:wildflowers",
        "minecraft:pink_petals",
    ].includes(Name)) {
        // 按照个数添加
        for (let i = 0; i < Number(Properties.segment_amount); i++) {
            result.push({
                id: itemId
            });
        }
    }

    // 花盆
    else if (Name.startsWith("minecraft:potted_")) result.push({
        id: "flower_pot"
    }, {
        id: String(Name.split("minecraft:potted_")[1]),
        within: "flower_pot"
    })

    // 炼药锅装水
    else if (Name === 'minecraft:water_cauldron') {
        result.push({
            id: "cauldron"
        })
        if (Properties.level === "3") { // 装满时，一个水桶够了
            result.push({
                id: "water_bucket",
                within: "cauldron"
            })
        } else if (Properties.level === "2") { // 没装满的话就需要水瓶
            result.push({
                id: "potion",
                within: "cauldron"
            }, {
                id: "potion",
                within: "cauldron"
            });

        } else if (Properties.level === "1") {
            result.push({
                id: "potion",
                within: "cauldron"
            });
        }
    }
    // 熔岩炼药锅
    else if (Name === 'minecraft:lava_cauldron') result.push({
        id: "cauldron"
    }, {
        id: "lava_bucket",
        within: "cauldron"
    })


    // 细雪炼药锅
    // 细雪这个也是分层的，不过满的还好，不满的实在想不到是怎么搞的
    // 看了wiki说好像要用着火的箭，但谁会这样做呢？
    else if (Name === 'minecraft:powder_snow_cauldron') result.push({
        id: "cauldron"
    }, {
        id: "powder_snow_bucket",
        within: "cauldron"
    })

    // 大型垂滴叶
    else if (Name === 'minecraft:big_dripleaf') {
        result.push({
            id: "big_dripleaf"
        })
    }
    else if (Name === 'minecraft:big_dripleaf_stem') { // 有茎的地方可能需要用到骨粉
        result.push({
            id: "bone_meal",
            within: "big_dripleaf"
        })
    }
    // 小型的一般来说不用管



    // 末地传送门框架
    else if (Name === 'minecraft:end_portal_frame') {
        result.push({
            id: "end_portal_frame"
        })
        if (Properties.eye === "true") result.push(
            {
                id: "ender_eye",
                within: "end_portal_frame"
            },
        )
    }

    // 重生锚
    else if (Name === 'minecraft:respawn_anchor') {
        result.push({
            id: "respawn_anchor"
        })

        // 根据等级决定需要的萤石数量
        let level = Number(Properties.charge);
        for (let i = 0; i < level; i++) {
            result.push({
                id: "glowstone",
                within: "respawn_anchor"
            })
        }
    }


    // 床，特殊的是，一张床占两个同id方块，且有床头和床脚两种状态。
    // 由于只有床头破坏时才会掉落，这里就算床头了
    else if (Name.endsWith("_bed")) {
        if (Properties.part === "head")
            result.push({
                id: itemId
            })
    }


    // 门，也是非常特殊，有上下两个部分
    // 由于只有下半部分破坏时才会掉落，这里就算下半部分了
    else if (Name.endsWith("_door")) {
        if (Properties.half === "lower")
            result.push({
                id: itemId
            })
    }

    // 瓶子草也是
    else if (Name == "minecraft:pitcher_plant") {
        if (Properties.half === "lower")
            result.push({
                id: "pitcher_plant"
            })
    }
    else if (Name == "minecraft:pitcher_crop") {
        if (Properties.half === "lower") {
            if (Properties.age === "4") {
                result.push({
                    id: "pitcher_plant"
                })
            } else {
                result.push({
                    id: "pitcher_pod"
                })
            }
        }
    }

    // 水源
    else if (Name == "minecraft:water") {
        if (Properties.level === "0")
            result.push({
                id: "water_bucket"
            })
    }
    // 熔岩源
    else if (Name == "minecraft:lava") {
        if (Properties.level === "0")
            result.push({
                id: "lava_bucket"
            })
    }

    // 台阶，一般都有后缀名_slab
    else if (Name.endsWith("_slab") && Properties.type == "double") {
        result.push({
            id: itemId
        }, {
            id: itemId
        })
    }

    // 红石线
    else if (Name === "minecraft:redstone_wire") {
        result.push({
            id: 'redstone'
        })
    }

    else {
        // 没有特殊处理的话，都是方块和物品同一个id了
        result.push({
            id: itemId
        });
    }


    // 含水检测，有waterlogged: true的话一般都是含水方块
    if (Properties.waterlogged === "true") result.push({
        id: "water_bucket",
        within: itemId
    })


    // console.log('block', Name, Properties, ...result)
    return result;


}


function parseEntityToItem(entity: LitematicEntity): ParsedItem[] | null {
    let result: ParsedItem[] = [];

    const entityId = getNamespaceId(entity.id)

    if (entity.id === "minecraft:item_frame") {
        result.push({
            id: "item_frame",
        })

        if (entity.Item) {
            for (let i = 0; i < entity.Item.count; i++) {
                result.push({
                    id: getNamespaceId(entity.Item.id),
                    within: "item_frame",
                    container: true // 在容器内物品
                });
            }
        }

    }
    // 载人矿车
    else if (entity.id === "minecraft:minecart") {
        result.push({
            id: 'minecart',
        })

        // 矿车有乘客
        if (entity.Passengers) {
            for (let passenger of entity.Passengers) {
                let res = parseEntityToItem(passenger)
                if (res) result.push(...res.map(v => ({
                    ...v,
                    within: 'minecart'
                })))
            }
        }
    }
    // 容器矿车
    else if (entity.id === "minecraft:hopper_minecart" || entity.id === "minecraft:chest_minecart") {
        result.push({
            id: entityId,
        })

        for (let item of entity.Items) {
            for (let i = 0; i < item.count; i++) {
                result.push({
                    id: getNamespaceId(item.id),
                    within: entityId,
                    container: true // 在容器内物品
                });
            }
        }
    }
    // 其他类型矿车
    else if (
        entity.id === "minecraft:furnace_minecart"
        || entity.id === "minecraft:tnt_minecart"
        || entity.id === "minecraft:spawner_minecart"
    ) {
        result.push({
            id: entityId,
        })

    }
    // 盔甲架
    else if (entity.id === "minecraft:armor_stand") {
        result.push({
            id: 'armor_stand',
        })

        // 盔甲架的装备
        const items: any[] = [];
        if (entity.equipment) {
            // 将所有槽位的物品放到一块处理
            for (let evalue of entity.equipment) {
                items.push(evalue);
            }
        }

        // 由于1.9之后盔甲架不再使用equipment标签来存储装备物品，这里直接是否存在
        if (entity.HandItems) items.push(...entity.HandItems);
        if (entity.ArmorItems) items.push(...entity.ArmorItems);

        for (let item of items) {
            if (!item.id) continue; // 无物品则跳过
            for (let i = 0; i < (item.count || 1); i++) {
                result.push({
                    id: getNamespaceId(item.id),
                    within: 'armor_stand',
                    container: true // 在容器内物品
                });
            }
        }

    }
    // 船
    else if (entity.id.endsWith("_boat")) {
        result.push({
            id: entityId,
        })

        // 船有乘客
        if (entity.Passengers) {
            for (let passenger of entity.Passengers) {
                let res = parseEntityToItem(passenger)
                if (res) result.push(...res.map(v => ({
                    ...v,
                    within: entityId
                })))
            }
        }
    }
    // 其他生物
    else if (
        [
            "chicken",
            "cow",
            "pig",
            "sheep",
            "camel",
            "donkey",
            "horse",
            "mule",
            "cat",
            "parrot",
            "wolf",
            "armadillo",
            "bat",
            "bee",
            "fox",
            "goat",
            "llama",
            "ocelot",
            "panda",
            "polar_bear",
            "rabbit",
            "axolotl",
            "cod",
            "dolphin",
            "frog",
            "glow_squid",
            "nautilus",
            "pufferfish",
            "salmon",
            "squid",
            "tadpole",
            "tropical_fish",
            "turtle",
            "allay",
            "mooshroom",
            "sniffer",
            "copper_golem",
            "iron_golem",
            "snow_golem",
            "trader_llama",
            "villager",
            "wandering_trader",
            "bogged",
            "camel_husk",
            "drowned",
            "husk",
            "parched",
            "skeleton",
            "skeleton_horse",
            "stray",
            "zombie",
            "zombie_horse",
            "zombie_nautilus",
            "zombie_villager",
            "cave_spider",
            "spider",
            "breeze",
            "creaking",
            "creeper",
            "elder_guardian",
            "guardian",
            "phantom",
            "silverfish",
            "slime",
            "warden",
            "witch",
            "evoker",
            "pillager",
            "ravager",
            "vex",
            "vindicator",
            "blaze",
            "ghast",
            "happy_ghast",
            "hoglin",
            "magma_cube",
            "piglin",
            "piglin_brute",
            "strider",
            "wither_skeleton",
            "zoglin",
            "zombified_piglin",
            "enderman",
            "endermite",
            "shulker"
        ].includes(String(entity.id.split("minecraft:")[1]))

    ) {
        let item = getNamespaceId(entity.id) + "_spawn_egg"

        // 生物以刷怪蛋的形式显示
        result.push({
            id: item,
        })

        // 如果需要命名，需要命名牌
        if (entity.CustomName) {
            result.push({
                id: "name_tag",
                within: item
            })
        }

        // TODO：部分生物可能还需要捡起物品（如村民交易所的僵尸需要捡个斧）

    }

    // console.log('entity', entity.id, ...result)
    return result;
}

function parseTileEntityToItem(entity: LitematicTileEntity, blockId: string): ParsedItem[] | null {
    let result = [];

    // 方块实体一般都是容器类的，所以就简简单单了
    if (entity.Items) {
        for (let item of entity.Items) {
            for (let i = 0; i < item.count; i++) {
                result.push({
                    id: getNamespaceId(item.id),
                    within: blockId,
                    container: true // 在容器内物品
                });
            }
        }
    }

    // 陶罐
    if (blockId === "decorated_pot") {
        if (entity.item) {
            for (let i = 0; i < entity.item.count; i++) {
                result.push({
                    id: getNamespaceId(entity.item.id),
                    within: blockId,
                    container: true // 在容器内物品
                });
            }
        }
    }

    // 酿造台
    else if (blockId === "brewing_stand") {
        // 若剩余能量不为0，则额外需要一个烈焰粉
        if (entity.Fuel && entity.Fuel > 0) {
            result.push({
                id: "blaze_powder",
                within: blockId,
                container: true // 在容器内物品
            })
        }
    }

    // 讲台
    else if (blockId === "lectern") {
        // 讲台上的书
        if (entity.Book) {
            // 不考虑堆叠情况
            result.push({
                id: getNamespaceId(entity.Book.id),
                within: blockId,
                container: true // 在容器内物品
            });
        }
    }

    // 唱片机
    else if (blockId === "jukebox") {
        // 唱片机上的唱片
        if (entity.RecordItem) {
            // 不考虑堆叠情况
            result.push({
                id: getNamespaceId(entity.RecordItem.id),
                within: blockId,
                container: true // 在容器内物品
            });
        }
    }

    // 告示牌
    else if (blockId.endsWith("_sign")) {
        const side = (text: any) => {
            // 需要荧光墨囊
            if (text.has_glowing_text == 1) {
                result.push({
                    id: 'glow_ink_sac',
                    within: blockId,
                })
            }

            // 如果不是黑色，则需要染料
            if (text.color != "black") {
                result.push({
                    id: `${text.color}_dye`,
                    within: blockId,
                })
            }
        }

        side(entity.front_text);
        side(entity.back_text);

        // 如果涂蜡了，需要蜜脾
        if (entity.is_waxed == 1) {
            result.push({
                id: 'honeycomb',
                within: blockId,
            })
        }
    }


    // console.log('TileEntity', entity, ...result)
    return result;
}
/**
 * 获取指定坐标的方块状态
 * @param x - 子区块内 x 坐标 (0-15)
 * @param y - 子区块内 y 坐标 (0-15)
 * @param z - 子区块内 z 坐标 (0-15)
 * @param palette - 调色板数组
 * @param data - 存储数据的 BigInt 数组 (64位整数)
 * @returns 方块状态
 */
function getBlockStateAt(
    x: number, y: number, z: number,
    size: LitematicVec,
    palette: Array<LitematicBlockStatePalette>,
    data: bigint[]
): LitematicBlockStatePalette | null {
    // 参考 https://github.com/EndingCredits/litematic-viewer/blob/main/src/litematic-utils.js#L45

    const i = (size.x * size.z) * y + (size.x) * z + x;

    // 计算每个索引需要的位数
    const bitsPerEntry = Math.ceil(Math.log2(palette.length));

    // 计算起始位位置
    const startBit = BigInt(i * bitsPerEntry);

    // 计算需要的 64 位块数量
    const startBlockIndex = Number(startBit >> 6n);  // 除以 64
    const endBit = (i + 1) * bitsPerEntry - 1;
    const endBlockIndex = Number(BigInt(endBit) >> 6n);

    // 在块内的偏移
    const startOffset = Number(startBit & 63n);  // % 64

    let paletteIndex: number;

    if (startBlockIndex === endBlockIndex) {
        // 完全在一个 64 位块内
        const block = data[startBlockIndex] as bigint;
        paletteIndex = Number((block >> BigInt(startOffset)) & ((1n << BigInt(bitsPerEntry)) - 1n));
    } else {
        // 跨两个 64 位块
        const firstBlock = data[startBlockIndex] as bigint;
        const secondBlock = data[endBlockIndex] as bigint;

        const bitsFromFirst = 64 - startOffset;
        const bitsFromSecond = bitsPerEntry - bitsFromFirst;

        // 从第一个块取低位部分
        const firstPart = (firstBlock >> BigInt(startOffset)) & ((1n << BigInt(bitsFromFirst)) - 1n);
        // 从第二个块取高位部分
        const secondPart = secondBlock & ((1n << BigInt(bitsFromSecond)) - 1n);

        // 组合两部分
        paletteIndex = Number(firstPart | (secondPart << BigInt(bitsFromFirst)));
    }

    // 返回实际的方块状态
    if (!palette[paletteIndex]) return null;

    return palette[paletteIndex] as LitematicBlockStatePalette;
}