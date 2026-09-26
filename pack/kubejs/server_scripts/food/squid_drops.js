// One base food drop, plus exactly one raw calamari per Looting level.
// Knife kills: whole squid. Other deaths: raw calamari. Fire does not cook it.
LootJS.modifiers(event => {
    const modifiers = [
        'crabbersdelight:scavenging_tentacles_from_squid',
        'crabbersdelight:scavenging_tentacles_from_glow_squid',
        'crabbersdelight:scavenging_cooked_tentacles_from_squid',
        'crabbersdelight:scavenging_cooked_tentacles_from_glow_squid',
        'farmersdelight:cut_tentacles_squid',
        'farmersdelight:cut_tentacles_glow_squid',
        'rusticdelight:calamari_from_squid',
        'rusticdelight:calamari_from_glow_squid'
    ]
    modifiers.forEach(id => event.removeGlobalModifiers(id))
})

LootJS.lootTables(event => {
    const raw = 'culturaldelights:raw_calamari'
    const oldFoodDrops = [
        raw, 'culturaldelights:squid', 'culturaldelights:glow_squid',
        'culturaldelights:cooked_squid', 'culturaldelights:cooked_calamari',
        'crabbersdelight:raw_squid_tentacles', 'crabbersdelight:raw_glow_squid_tentacles',
        'crabbersdelight:cooked_squid_tentacles', 'crabbersdelight:cooked_glow_squid_tentacles',
        'oceansdelight:tentacles', 'rusticdelight:calamari', 'rusticdelight:cooked_calamari'
    ]

    function configure(tableId, wholeSquid) {
        const table = event.getLootTable(tableId)
        // Cultural supplies whole-squid entries directly in the entity tables.
        // Remove only food entries; preserve any unrelated loaded-table drops.
        oldFoodDrops.forEach(item => table.removeItem(item))
        table.createPool(pool => {
            // addCustomEntry uses plain JsonOps in LootJS 3.7.0, which cannot
            // resolve registry-backed tag predicates. Use native builders.
            pool.addEntry(LootEntry.alternative(
                LootEntry.of(wholeSquid).matchMainHand('#c:tools/knife'),
                LootEntry.of(raw)
            ))
        })
        table.createPool(pool => {
            // A constant bonus of 1 gives exactly L, not a random 0..L roll.
            // The native helper resolves Looting through the registry lookup.
            pool.addEntry(LootEntry.of(raw).setCount(0).applyEnchantmentBonus(1))
        })
    }
    configure('minecraft:entities/squid', 'culturaldelights:squid')
    configure('minecraft:entities/glow_squid', 'culturaldelights:glow_squid')
})
