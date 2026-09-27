// Tier upgrades are crafted only; keep backpack loot and other upgrades intact.
LootJS.modifiers(event => {
    const modifiers = [
        'abandoned_mineshaft_inject_iron_tier_upgrade',
        'abandoned_mineshaft_inject_gold_tier_upgrade',
        'simple_dungeon_inject_iron_tier_upgrade',
        'desert_pyramid_inject_iron_tier_upgrade',
        'desert_pyramid_inject_gold_tier_upgrade',
        'shipwreck_treasure_inject_iron_tier_upgrade',
        'shipwreck_treasure_inject_gold_tier_upgrade',
        'woodland_mansion_inject_iron_tier_upgrade',
        'woodland_mansion_inject_gold_tier_upgrade',
        'nether_bridge_inject_iron_tier_upgrade',
        'nether_bridge_inject_gold_tier_upgrade',
        'bastion_treasure_inject_iron_tier_upgrade',
        'bastion_treasure_inject_gold_tier_upgrade',
        'end_city_treasure_inject_gold_tier_upgrade',
        'end_city_treasure_inject_diamond_tier_upgrade'
    ]
    modifiers.forEach(id => event.removeGlobalModifiers('travelersbackpack:' + id))
})

ServerEvents.recipes(event => {
    const tiers = {
        iron: 'c:ingots/iron',
        gold: 'c:ingots/gold',
        diamond: 'c:gems/diamond'
    }

    Object.keys(tiers).forEach(tier => {
        const id = 'travelersbackpack:' + tier + '_tier_upgrade'

        // Keep the original recipe type and ingredients, except the two center edge slots.
        event.remove({ id: id })
        event.custom({
            type: 'travelersbackpack:backpack_shaped',
            category: 'misc',
            pattern: ['ASA', 'ABA', 'ASA'],
            key: {
                A: { tag: tiers[tier] },
                B: { item: 'travelersbackpack:blank_upgrade' },
                S: { item: 'minecraft:shulker_shell' }
            },
            result: { count: 1, id: id }
        }).id(id)
    })
})
