ServerEvents.recipes(event => {
    event.remove({ output: 'mermod:sea_crystal' })

    event.remove({ id: 'mermod:sea_necklace' })
    event.shaped('mermod:sea_necklace', [
        ' A ',
        'AHA',
        ' B '
    ], {
        A: 'minecraft:iron_ingot',
        B: 'mermod:sea_crystal',
        H: 'minecraft:heart_of_the_sea'
    }).id('mermod:sea_necklace')
})

LootJS.lootTables(event => {
    // Add one guaranteed Sea Crystal alongside the Elder Guardian's normal drops.
    event.getLootTable('minecraft:entities/elder_guardian').createPool(pool => {
        pool.addEntry(LootEntry.of('mermod:sea_crystal').setCount(1))
    })
})
