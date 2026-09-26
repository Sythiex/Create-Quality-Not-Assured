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
