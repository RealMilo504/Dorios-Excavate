import { world } from '@minecraft/server'

let list = []
let blacklist = []
let maxLimit = 0

export function setMaxLimit(num) {
    maxLimit = num;
}

world.afterEvents.worldLoad.subscribe(e => {
    const existing = world.getDynamicProperty('dorios:initialVein')
    if (existing) {
        list = JSON.parse(existing)
    } else {
        list = [
            // Ores
            'minecraft:coal_ore',
            'minecraft:copper_ore',
            'minecraft:deepslate_coal_ore',
            'minecraft:deepslate_copper_ore',
            'minecraft:deepslate_diamond_ore',
            'minecraft:deepslate_emerald_ore',
            'minecraft:deepslate_gold_ore',
            'minecraft:deepslate_iron_ore',
            'minecraft:deepslate_lapis_ore',
            'minecraft:deepslate_redstone_ore',
            'minecraft:diamond_ore',
            'minecraft:emerald_ore',
            'minecraft:gold_ore',
            'minecraft:iron_ore',
            'minecraft:lapis_ore',
            'minecraft:nether_gold_ore',
            'minecraft:quartz_ore',
            'minecraft:redstone_ore',
            'minecraft:ancient_debris',
            // Logs
            'minecraft:oak_log',
            'minecraft:spruce_log',
            'minecraft:birch_log',
            'minecraft:jungle_log',
            'minecraft:acacia_log',
            'minecraft:dark_oak_log',
            'minecraft:cherry_log',
            'minecraft:mangrove_log',

            // Nether
            'minecraft:crimson_stem',
            'minecraft:warped_stem',
        ]
        world.setDynamicProperty('dorios:initialVein', JSON.stringify(list))
    }

    const existingBlacklist = world.getDynamicProperty('dorios:veinBlacklist')
    if (existingBlacklist) {
        blacklist = JSON.parse(existingBlacklist)
    } else {
        blacklist = [
            "minecraft:allow",
            "minecraft:barrier",
            "minecraft:bedrock",
            "minecraft:border_block",
            "minecraft:deny",
            "minecraft:end_portal_frame",
            "minecraft:end_portal",
            "minecraft:portal",
            "minecraft:reinforced_deepslate",
            "minecraft:command_block",
            "minecraft:chain_command_block",
            "minecraft:repeating_command_block"
        ]
        world.setDynamicProperty('dorios:veinBlacklist', JSON.stringify(blacklist))
    }

    const existingMaxLimit = world.getDynamicProperty('dorios:maxLimit')
    if (existingMaxLimit) {
        maxLimit = existingMaxLimit
    } else {
        maxLimit = 128
        world.setDynamicProperty('dorios:maxLimit', maxLimit)
    }
})

export { list, blacklist, maxLimit }