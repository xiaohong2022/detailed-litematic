export type LitematicVecArr = [number, number, number]
export type LitematicBool = 0 | 1

export interface LitematicVec {
    "x": number,
    "y": number,
    "z": number
}

export interface LitematicMetadata {
    "TimeCreated": bigint,
    "TimeModified": bigint,
    "EnclosingSize": LitematicVec,
    "Description": string,
    "RegionCount": number,
    "TotalBlocks": number,
    "Author": string,
    "TotalVolume": number,
    "Name": string
}

export interface LitematicBlockStatePalette {
    "Name": string
    "Properties"?: Record<string, any>
}

export interface LitematicTileEntity extends LitematicVec {
    "id": string,
    [key: string]: any
}

export interface LitematicEntity {
    "Motion": LitematicVecArr,
    "FallDistance": number,
    "Pos": LitematicVecArr,
    "Fire": number,
    "Invulnerable": LitematicBool,
    "id": string,
    "Air": number,
    "OnGround": LitematicBool,
    "PortalCooldown": number,
    "UUID": [number, number, number, number],
    "Rotation": [number, number],
    [key: string]: any

}

export interface LitematicRegion {
    "BlockStates": bigint[],
    "PendingBlockTicks": unknown[],
    "Position": LitematicVec,
    "BlockStatePalette": LitematicBlockStatePalette[],
    "Size": LitematicVec,
    "PendingFluidTicks": unknown[],
    "TileEntities": LitematicTileEntity[],
    "Entities": LitematicEntity[]
}


export interface Litematic {
    "MinecraftDataVersion": number,
    "Version": number,
    "Metadata": LitematicMetadata,
    "Regions": Record<string, LitematicRegion>,
    "SubVersion"?: number
}