/**
* Checks if the player's held item (or hand) can mine a block
* based on its tier compared to the block's required tier.
* 
* @param {ItemStack} item - The item the player is holding (can be empty).
* @param {Block} block - The block being targeted.
* @returns {boolean} True if the player can mine the block.
*/
export function is_diggable(item, block) {
    if (!block) return false;

    // Define tier hierarchy (lowest → highest)
    const tierHierarchy = [
        "hand",                       // no tool
        "minecraft:stone_tier",       // also includes copper
        "minecraft:iron_tier",
        "minecraft:diamond_tier",
        "minecraft:netherite_tier"
    ];

    const blockTiers = [
        "minecraft:stone_tier_destructible",
        "minecraft:iron_tier_destructible",
        "minecraft:diamond_tier_destructible"
    ];

    // Determine the block's tier
    const blockTier = blockTiers.find(tag => block.hasTag(tag));
    if (!blockTier) return true; // blocks without a tier can always be mined

    // Determine the item tier
    let itemTier = "hand"; // default if empty hand or no tag

    if (item) {
        if (item.hasTag("minecraft:copper_tier") || item.hasTag("minecraft:stone_tier")) {
            itemTier = "minecraft:stone_tier";
        } else if (item.hasTag("minecraft:iron_tier")) {
            itemTier = "minecraft:iron_tier";
        } else if (item.hasTag("minecraft:diamond_tier")) {
            itemTier = "minecraft:diamond_tier";
        } else if (item.hasTag("minecraft:netherite_tier")) {
            itemTier = "minecraft:netherite_tier";
        }
        // wooden and golden tiers intentionally ignored
    }

    // Compare hierarchy levels
    const itemLevel = tierHierarchy.indexOf(itemTier);
    const blockLevel = blockTiers.indexOf(blockTier) + 1; // shift +1 since "hand" = 0

    return itemLevel >= blockLevel;
}