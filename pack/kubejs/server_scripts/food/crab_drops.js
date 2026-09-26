LootJS.lootTables(event => {
    function addDrop(table, item, min, max, looting, cookWhenBurning) {
        let entry = LootEntry.of(item).setCount([min, max])

        if (cookWhenBurning) {
            entry.jsonFunction({
                function: 'minecraft:furnace_smelt',
                conditions: [{
                    condition: 'minecraft:entity_properties',
                    entity: 'this',
                    predicate: {
                        flags: { is_on_fire: true }
                    }
                }]
            })
        }

        if (looting) {
            entry.applyEnchantmentBonus([0, 1])
        }

        // Separate pools let each added item drop independently.
        table.createPool(pool => {
            pool.addEntry(entry)
        })
    }

    const quark = event.getLootTable('quark:entities/crab')
    const naturalist = event.getLootTable('naturalist:entities/crab')

    // Both other crabs can drop claws, but no whole crab in these tables.
    for (const table of [quark, naturalist]) {
        addDrop(table, 'crabbersdelight:crab_claw', 0, 1, true, false)
    }

    // Exchange the two other food drops.
    addDrop(naturalist, 'quark:crab_leg', 0, 1, true, true)
    addDrop(quark, 'naturalist:crab_meat', 1, 2, true, true)
})

LootJS.modifiers(event => {
    // One coin flip for the entire result: either one whole crab or all
    // the normal drops above. A failed roll leaves the generated loot intact.
    event.addTableModifier('quark:entities/crab')
        .randomChance(0.5)
        .removeLoot(ItemFilter.ANY)
        .addLoot('crabbersdelight:crab')
})
