ServerEvents.tags('item', event => {
    // Allow the No Mo' Wanderer totem in the neck Curio slot.
    event.add('curios:necklace', 'nomowanderer:no_mo_wanderer_totem')

    // Allow vanilla Flowering Azalea in Colorful Azaleas' dye recipes.
    event.add('c:flowering_azaleas', 'minecraft:flowering_azalea')

    // music discs
    event.add('c:music_discs', [
        'idas:music_disc_slither',
        'idas:music_disc_calidum',
        'create_confectionery:the_bright_side'
    ])
})
