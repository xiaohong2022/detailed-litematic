// 物品id到贴图

// 数据来源于 Minecraft Wiki
const CUSTOM_NAME: Record<string, string> = {
    "coal_block": "Block_of_Coal",
    "gold_block": "Block_of_Gold",
    "redstone_block": "Block_of_Redstone",
    "copper_block": "Block_of_Copper",
    "waxed_copper_block": "Block_of_Copper",
    "lapis_block": "Block_of_Lapis_Lazuli",
    "diamond_block": "Block_of_Diamond",
    "emerald_block": "Block_of_Emerald",
    "netherite_block": "Block_of_Netherite",
    "resin_block": "Block_of_Resin",
    "iron_block": "Block_of_Iron",
    "amethyst_block": "Block_of_Amethyst",
    "quartz_block": "Block_of_Quartz",

    "lapis_ore": "Lapis_Lazuli_Ore",
    "deepslate_lapis_ore": "Deepslate_Lapis_Lazuli_Ore",

    "bamboo_block": "Block_of_Bamboo",
    "stripped_bamboo_block": "Block_of_Stripped_Bamboo",

    "ender_eye": "Eye_of_Ender",
    "experience_bottle": "Bottle_o%27_Enchanting",

    "milk_bucket": "Milk",
    "axolotl_bucket": "Bucket_of_Axolotl",
    "tadpole_bucket": "Bucket_of_Tadpole",
    "salmon_bucket": "Bucket_of_Tadpole",
    "pufferfish_bucket": "Bucket_of_Pufferfish",
    "tropical_fish_bucket": "Bucket_of_Tropical_Fish",

    "chest_minecart": "Minecart_with_Chest",
    "hopper_minecart": "Minecart_with_Hopper",
    "command_block_minecart": "Minecart_with_Command_Block",
    "furnace_minecart": "Minecart_with_Furnace",
    "tnt_minecart": "Minecart_with_TNT",
    "monster_spawner_minecart": "Minecart_with_Monster_Spawner",

    "oak_chest_boat": "Boat_with_Chest",
    "spruce_chest_boat": "Spruce_Boat_with_Chest",
    "birch_chest_boat": "Birch_Boat_with_Chest",
    "jungle_chest_boat": "Jungle_Boat_with_Chest",
    "acacia_chest_boat": "Acacia_Boat_with_Chest",
    "dark_oak_chest_boat": "Dark_oak_Boat_with_Chest",
    "mangrove_chest_boat": "Mangrove_Boat_with_Chest",
    "cherry_boat": "Cherry_Boat_with_Chest",

    "raw_copper_block": "Block_of_Raw_Copper",
    "raw_iron_block": "Block_of_Raw_Iron",
    "raw_gold_block": "Block_of_Raw_Gold",

    // 刷怪蛋数据获取方式：
    /*
    const data = [].slice.call($0.children)
    .filter(v=>v.className=="invslot")
    .map(v=>v.querySelector("img"))
    .map(v=>[
    v.alt.split("Invicon ")[1].split(".png")[0].split(" ").join("_").toLowerCase(),
    v.src.split("/images/Invicon_")[1].split(".png")[0]
    ])
    const result = {};
    for(let [k, v] of data) result[k] = v;
    */

    "chicken_spawn_egg": "Chicken_Spawn_Egg_Revision_3",
    "cow_spawn_egg": "Cow_Spawn_Egg_Revision_3",
    "pig_spawn_egg": "Pig_Spawn_Egg_Revision_3",
    "sheep_spawn_egg": "Sheep_Spawn_Egg_Revision_3",
    "camel_spawn_egg": "Camel_Spawn_Egg_Revision_2",
    "donkey_spawn_egg": "Donkey_Spawn_Egg_Revision_3",
    "horse_spawn_egg": "Horse_Spawn_Egg_Revision_2",
    "mule_spawn_egg": "Mule_Spawn_Egg_Revision_3",
    "cat_spawn_egg": "Cat_Spawn_Egg_Revision_3",
    "parrot_spawn_egg": "Parrot_Spawn_Egg_Revision_2",
    "wolf_spawn_egg": "Wolf_Spawn_Egg_Revision_3",
    "armadillo_spawn_egg": "Armadillo_Spawn_Egg_Revision_2",
    "bat_spawn_egg": "Bat_Spawn_Egg_Revision_2",
    "bee_spawn_egg": "Bee_Spawn_Egg_Revision_3",
    "fox_spawn_egg": "Fox_Spawn_Egg_Revision_2",
    "goat_spawn_egg": "Goat_Spawn_Egg_Revision_2",
    "llama_spawn_egg": "Llama_Spawn_Egg_Revision_2",
    "ocelot_spawn_egg": "Ocelot_Spawn_Egg_Revision_2",
    "panda_spawn_egg": "Panda_Spawn_Egg_Revision_2",
    "polar_bear_spawn_egg": "Polar_Bear_Spawn_Egg_Revision_2",
    "rabbit_spawn_egg": "Rabbit_Spawn_Egg_Revision_2",
    "axolotl_spawn_egg": "Axolotl_Spawn_Egg_Revision_2",
    "cod_spawn_egg": "Cod_Spawn_Egg_Revision_2",
    "dolphin_spawn_egg": "Dolphin_Spawn_Egg_Revision_2",
    "frog_spawn_egg": "Frog_Spawn_Egg_Revision_2",
    "glow_squid_spawn_egg": "Glow_Squid_Spawn_Egg_Revision_2",
    "nautilus_spawn_egg": "Nautilus_Spawn_Egg",
    "pufferfish_spawn_egg": "Pufferfish_Spawn_Egg_Revision_3",
    "salmon_spawn_egg": "Salmon_Spawn_Egg_Revision_3",
    "squid_spawn_egg": "Squid_Spawn_Egg_Revision_3",
    "tadpole_spawn_egg": "Tadpole_Spawn_Egg_Revision_2",
    "tropical_fish_spawn_egg": "Tropical_Fish_Spawn_Egg_Revision_3",
    "turtle_spawn_egg": "Turtle_Spawn_Egg_Revision_2",
    "allay_spawn_egg": "Allay_Spawn_Egg_Revision_2",
    "mooshroom_spawn_egg": "Mooshroom_Spawn_Egg_Revision_4",
    "sniffer_spawn_egg": "Sniffer_Spawn_Egg_Revision_2",
    "copper_golem_spawn_egg": "Copper_Golem_Spawn_Egg",
    "iron_golem_spawn_egg": "Iron_Golem_Spawn_Egg_Revision_2",
    "snow_golem_spawn_egg": "Snow_Golem_Spawn_Egg_Revision_2",
    "trader_llama_spawn_egg": "Trader_Llama_Spawn_Egg_Revision_2",
    "villager_spawn_egg": "Villager_Spawn_Egg_Revision_3",
    "wandering_trader_spawn_egg": "Wandering_Trader_Spawn_Egg_Revision_2",
    "bogged_spawn_egg": "Bogged_Spawn_Egg_Revision_2",
    "camel_husk_spawn_egg": "Camel_Husk_Spawn_Egg",
    "drowned_spawn_egg": "Drowned_Spawn_Egg_Revision_2",
    "husk_spawn_egg": "Husk_Spawn_Egg_Revision_3",
    "parched_spawn_egg": "Parched_Spawn_Egg",
    "skeleton_spawn_egg": "Skeleton_Spawn_Egg_Revision_3",
    "skeleton_horse_spawn_egg": "Skeleton_Horse_Spawn_Egg_Revision_2",
    "stray_spawn_egg": "Stray_Spawn_Egg_Revision_3",
    "zombie_spawn_egg": "Zombie_Spawn_Egg_Revision_3",
    "zombie_horse_spawn_egg": "Zombie_Horse_Spawn_Egg_Revision_4",
    "zombie_nautilus_spawn_egg": "Zombie_Nautilus_Spawn_Egg",
    "zombie_villager_spawn_egg": "Zombie_Villager_Spawn_Egg_Revision_2",
    "cave_spider_spawn_egg": "Cave_Spider_Spawn_Egg_Revision_3",
    "spider_spawn_egg": "Spider_Spawn_Egg_Revision_3",
    "breeze_spawn_egg": "Breeze_Spawn_Egg_Revision_3",
    "creaking_spawn_egg": "Creaking_Spawn_Egg_Revision_2",
    "creeper_spawn_egg": "Creeper_Spawn_Egg_Revision_3",
    "elder_guardian_spawn_egg": "Elder_Guardian_Spawn_Egg_Revision_2",
    "guardian_spawn_egg": "Guardian_Spawn_Egg_Revision_2",
    "phantom_spawn_egg": "Phantom_Spawn_Egg_Revision_3",
    "silverfish_spawn_egg": "Silverfish_Spawn_Egg_Revision_4",
    "slime_spawn_egg": "Slime_Spawn_Egg_Revision_3",
    "warden_spawn_egg": "Warden_Spawn_Egg_Revision_2",
    "witch_spawn_egg": "Witch_Spawn_Egg_Revision_2",
    "evoker_spawn_egg": "Evoker_Spawn_Egg_Revision_2",
    "pillager_spawn_egg": "Pillager_Spawn_Egg_Revision_2",
    "ravager_spawn_egg": "Ravager_Spawn_Egg_Revision_2",
    "vex_spawn_egg": "Vex_Spawn_Egg_Revision_2",
    "vindicator_spawn_egg": "Vindicator_Spawn_Egg_Revision_2",
    "blaze_spawn_egg": "Blaze_Spawn_Egg_Revision_4",
    "ghast_spawn_egg": "Ghast_Spawn_Egg_Revision_3",
    "happy_ghast_spawn_egg": "Happy_Ghast_Spawn_Egg",
    "hoglin_spawn_egg": "Hoglin_Spawn_Egg_Revision_3",
    "magma_cube_spawn_egg": "Magma_Cube_Spawn_Egg_Revision_3",
    "piglin_spawn_egg": "Piglin_Spawn_Egg_Revision_2",
    "piglin_brute_spawn_egg": "Piglin_Brute_Spawn_Egg_Revision_2",
    "strider_spawn_egg": "Strider_Spawn_Egg_Revision_2",
    "wither_skeleton_spawn_egg": "Wither_Skeleton_Spawn_Egg_Revision_2",
    "zoglin_spawn_egg": "Zoglin_Spawn_Egg_Revision_2",
    "zombified_piglin_spawn_egg": "Zombified_Piglin_Spawn_Egg_Revision_2",
    "enderman_spawn_egg": "Enderman_Spawn_Egg_Revision_3",
    "endermite_spawn_egg": "Endermite_Spawn_Egg_Revision_2",
    "shulker_spawn_egg": "Shulker_Spawn_Egg_Revision_3",

    // 染料
    "white_dye": "White_Dye_Revision_2",
    "light_gray_dye": "Light_Gray_Dye_Revision_2",
    "gray_dye": "Gray_Dye_Revision_2",
    "black_dye": "Black_Dye_Revision_2",
    "brown_dye": "Brown_Dye_Revision_2",
    "red_dye": "Red_Dye_Revision_2",
    "orange_dye": "Orange_Dye_Revision_2",
    "yellow_dye": "Yellow_Dye_Revision_2",
    "lime_dye": "Lime_Dye_Revision_2",
    "green_dye": "Green_Dye_Revision_2",
    "cyan_dye": "Cyan_Dye_Revision_2",
    "light_blue_dye": "Light_Blue_Dye_Revision_2",
    "blue_dye": "Blue_Dye_Revision_2",
    "purple_dye": "Purple_Dye_Revision_2",
    "magenta_dye": "Magenta_Dye_Revision_2",
    "pink_dye": "Pink_Dye_Revision_2",

    // 石头
    "infested_cobblestone": "Cobblestone",
    "stone": "Infested_Stone",
    "stone_bricks": "Infested_Stone_Bricks",
    "infested_cracked_stone_bricks": "Cracked_Stone_Bricks",
    "mossy_stone_bricks": "Infested_Mossy_Stone_Bricks",
    "infested_chiseled_stone_bricks": "Chiseled_Stone_Bricks",
    "infested_deepslate": "Deepslate",

    "comparator": "Redstone_Comparator",
    "repeater": "Redstone_Repeater",
    "player_head": "Head",
    "tnt": "TNT",
    "short_grass": "Grass",
    "wheat_seeds": "Seeds",
    "quartz": "Nether_Quartz",
    "white_banner": "Banner",

    "beef": "Raw_Beef",
    "porkchop": "Raw_Porkchop",
    "mutton": "Raw_Mutton",
    "chicken": "Raw_Chicken",
    "rabbit": "Raw_Rabbit",
    "cod": "Raw_Cod",
    "salmon": "Raw_Salmon",
    "frogspawn": "Frog_Spawn",
    "hay_block": "Hay_Bale",
    "map": "Empty_Locator_Map",
    "filled_map": "Buried_Treasure_Map",
    "writable_book": "Book_and_Quill",
    "dragon_breath": "Dragon%27s_Breath",
    "rabbit_foot": "Rabbit%27s_Foot",
    "jack_o_lantern": "Jack_o%27Lantern",
    "vine": "Vines",
    "turtle_scute": "Scute",
    "slime_ball": "Slimeball",
    "clay_ball": "Clay_%28ball%29",
    "music_disc_creator_music_box": "Music_Disc_Creator_%28Music_Box%29",
    "potion": "Awkward_Potion",

    // 皮革胸甲
    "leather_helmet": "Leather_Cap",
    "leather_chestplate": "Leather_Tunic",
    "leather_leggings": "Leather_Pants",
    "leather_boots": "Leather_Boots",

    // 兼容
    "chain": "Iron_Chain"
}

const gif = [
    "sea_lantern", "prismarine", "prismarine_slab", "prismarine_stairs",
    "stonecutter", "magma_block", "enchanted_golden_apple",
    "calibrated_sculk_sensor", "sculk_sensor"
]


function toFirstUpperCase(str: string) {
    const list = str.split("");
    list[0] = String(list[0]?.toUpperCase());
    return list.join("")
}

export function itemIdToImageURL(id: string) {
    if (id.endsWith("_smithing_template")) {
        id = String(id.split("_smithing_template")[0]);
    }

    let name = CUSTOM_NAME[id] || id.split('_').map(v => {
        if (['of', 'with', 'and', "on", "a", "an", "the"].includes(v)) return v;
        else return toFirstUpperCase(v);
    }).join("_");

    if (name.startsWith("Waxed_")) name = String(name.split("Waxed_")[1])
    if (name.startsWith("Weathered_")) name = "Waxed_" + name
    // if (id == "waxed_weathered_copper_bulb") name = "Waxed_Weathered_Copper_Bulb" // 特例

    return `https://zh.minecraft.wiki/images/Invicon_${name}.${gif.includes(id) ? 'gif' : 'png'}`
}


// 物品id到名字
import zh_cn from '../assets/zh_cn.json'

// @ts-ignore
export function itemIdToName(id: string, components: Record<string, any> = {}) {
    let translates = zh_cn as any; // 万恶之源：as any

    if (id.startsWith("music_disc")) {
        return `音乐唱片：${translates[id + '.desc']}`;
    }
    // if (id === 'potion') return translates['potion.effect.water']

    return translates[id];
}


// 格式化数量显示（需要多少组，预计多少箱（潜影盒）
export function formatItemNumber(id: string, num: number, isInContainer = false) {
    let maxStack = getItemMaxStackSize(id);

    let r = `${num}`;

    // 如果是只能使用的物品（如锄头，打火石）并且不是用于填充容器的，直接显示（使用次数）
    if (isUseOnlyItem(id) && !isInContainer) return `${r} 次`;

    if (maxStack > 1) {
        let groups = Math.floor(num / maxStack)
        let reminds = num % maxStack

        if (groups > 0) {
            r += ` = ${maxStack} × ${groups}`
            if (reminds > 0) r += ` + ${reminds}`;
        }

    }

    let filled_groups = Math.ceil(num / maxStack) // 向上舍入
    if (filled_groups > 1 && !id.endsWith("shulker_box")) {
        let boxes = filled_groups / 27;

        r += ` ≈ ${boxes.toFixed(2)} 潜影盒`
    }

    return r;
}

// 是否是只能使用的物品
export function isUseOnlyItem(id: string) {
    if (id.endsWith("_shovel")) return true // 铲子
    if (id.endsWith("_pickaxe")) return true // 稿子
    if (id.endsWith("_axe")) return true // 斧头
    if (id.endsWith("_hoe")) return true // 锄头
    if (id.endsWith("_sword")) return true // 剑
    if (id.endsWith("_spear")) return true // 矛
    if ([
        "flint_and_steel", "fishing_rod", "brush", "shears",
        "elytra", "trident", "mace", "shield", "bow", "crossbow",
    ].includes(id)) return true

    return false;
}

// 获取物品最大堆叠数
export function getItemMaxStackSize(id: string) {
    if (id.endsWith("_sign")) return 16 // 告示牌
    if (id.endsWith("_banner")) return 16 // 旗帜
    if (id === "armor_stand") return 16 // 盔甲架
    if (id === "egg" || id.endsWith("_egg")) return 16 // 鸡蛋
    if (id === "snowball") return 16 // 雪球
    if (id === "ender_pearl") return 16 // 珍珠
    if (id === "honey_bottle") return 16 // 蜂蜜瓶

    if (id === "bucket") return 16 // 没装有东西的桶
    if (id.endsWith("_bucket")) return 1 // 装有东西的桶


    if (id.endsWith("_shovel")) return 1 // 铲子
    if (id.endsWith("_pickaxe")) return 1 // 稿子
    if (id.endsWith("_axe")) return 1 // 斧头
    if (id.endsWith("_hoe")) return 1 // 锄头
    if (id.endsWith("_sword")) return 1 // 剑
    if (id.endsWith("_spear")) return 1 // 矛
    if (id.endsWith("_helmet")) return 1 // 头盔
    if (id.endsWith("_chestplate")) return 1 // 胸甲
    if (id.endsWith("_leggings")) return 1 // 护腿
    if (id.endsWith("_boots")) return 1 // 鞋子
    if (id.endsWith("_armor")) return 1 // 马铠 / 狼铠 / 鹦鹉螺铠
    if (id == "totem_of_undying") return 1 // 不死图腾

    if (id.endsWith("shulker_box")) return 1 // 潜影盒
    if (id.endsWith("_bed")) return 1 // 床

    if (id.endsWith("_on_a_stick")) return 1 // xx钓竿
    if (id.endsWith("_harness")) return 1 // xx挽具
    if (id.endsWith("_boat")) return 1 // 船
    if (id.endsWith("_born")) return 1 // 羊山角
    if (id.endsWith("_minecart") || id === "minecart") return 1 // 矿车
    if (id.startsWith("music_disc")) return 1 // 唱片
    if (id.endsWith("_banner_pattern")) return 1 // 图案
    if ([
        "flint_and_steel", "fishing_rod", "bundle", "spyglass", "brush", "shears",
        "elytra", "saddle", "trident", "mace", "shield", "bow", "crossbow",

        "cake", "suspicious_stew", "potion", "splash_potion", "lingering_potion",

        "enchanted_book"
    ].includes(id)) return 1


    return 64
}