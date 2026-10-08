// Armamentarium 1.3.3: give colored items their corresponding vanilla base rarity.
// Keep the mod's language entries (and name colors) unchanged. Requires a full restart.
// Existing non-Common rarities, including fruit tonics and The Mind of Jean, are untouched.
ItemEvents.modification(event => {
    const rarities = {
        UNCOMMON: [
            'blade_of_ruin',
            'bonecarved_scythe',
            'dead_mans_glove',
            'devourers_forked_tongue',
            'driftstone_kris',
            'emerald_karambit',
            'evergale_wand',
            'flame_frenzied_claymore',
            'greataxe_of_glory',
            'honeycomb_gavel',
            'icebreaker',
            'mariana_scepter',
            'razor_sharp_arachnostars_0',
            'razor_sharp_arachnostars_1',
            'razor_sharp_arachnostars_2',
            'razor_sharp_arachnostars_3',
            'scorpion_queens_rapier',
            'sea_guardian_twinblade',
            'slimesling_whip',
            'thorned_chorus_root',
            'twinned_netherdagger',
            'vilethorn_pike',
            'zombified_arm',
            // Block items also have colored names but default to Common.
            'black_ice',
            'marble',
            'marble_stairs',
            'marble_slab',
            'marble_wall',
            'polished_marble',
            'polished_marble_stairs',
            'polished_marble_slab',
            'polished_marble_wall',
            'polished_marble_pressure_plate',
            'polished_marble_button',
            'polished_marble_bricks',
            'polished_marble_brick_stairs',
            'polished_marble_brick_slab',
            'polished_marble_brick_wall',
            'chiseled_marble',
            'sword_of_the_stone',
            'sword_of_the_stone_placeholder'
        ],
        RARE: [
            'blood_prince_flamberge',
            'empyrean_cinquedea',
            'eventide_waveblade',
            'excalibur',
            'executioner',
            'halberd_of_the_omens',
            'hanakiba',
            'heavenly_virtues_shamshir',
            'holy_mourning_star',
            'lazulian_order_kunai_0',
            'lazulian_order_kunai_1',
            'lazulian_order_kunai_2',
            'lazulian_order_kunai_3',
            'lazulian_order_kunai_4',
            'mjolnir',
            'splitwing_scissorblade',
            'tarantula_cragneedle'
        ],
        EPIC: [
            'reaper_of_the_gaol',
            'severance_scythe',
            'teraton_blackhammer',
            'warspear_of_the_desecrator',
            // Gold names use Epic, matching The Mind of Jean's native rarity.
            'dragonslayer',
            'adamantine_helmet',
            'adamantine_chestplate',
            'adamantine_leggings',
            'adamantine_boots',
            'death_prince_helmet',
            'death_prince_chestplate',
            'death_prince_leggings',
            'death_prince_boots',
            'lone_graveseeker_helmet',
            'lone_graveseeker_chestplate',
            'lone_graveseeker_leggings',
            'lone_graveseeker_boots',
            'keystone',
            'keystone_adamantine',
            'keystone_lone_graveseeker',
            'keystone_death_prince'
        ]
    }

    Object.keys(rarities).forEach(rarity => {
        rarities[rarity].forEach(id => {
            event.modify('armamentarium:' + id, item => {
                item.rarity = rarity
            })
        })
    })
})

// Armamentarium 1.3.3: these subscribers spawn drops directly, bypassing loot tables.
// Includes Honey/Jack whetstone interactions so recycling is the only source.
// Run after all mods register their event listeners. Requires a full game restart.
StartupEvents.postInit(event => {
    const bus = Java.loadClass('net.neoforged.neoforge.common.NeoForge').EVENT_BUS
    const procedures = [
        'AngelWhetstoneDropProcedure',
        'BlazeWhetstoneDropProcedure',
        'BloodWhetstoneDropProcedure',
        'BoneWhetstoneDropProcedure',
        'CoagulatedBastardBloodDropProcedure',
        'EmeraldWhetstoneDropProcedure',
        'EndWhetstoneDropProcedure',
        'FeatherWhetstoneDropProcedure',
        'FleshWhetstoneDropProcedure',
        'GildedWhetstoneDropProcedure',
        'GravityWhetstoneDropProcedure',
        'GuardianWhetstoneDropProcedure',
        'HarmonyWhetstoneDropProcedure',
        'HoneyWhetstoneDropProcedure',
        'JackWhetstoneDropProcedure',
        'LazuliWhetstoneDropProcedure',
        'MagmaWhetstoneDropProcedure',
        'MindOfJeanDropProcedure',
        'OceanWhetstoneDropProcedure',
        'PoisonWhetstoneDropProcedure',
        'PurpurWhetstoneDropProcedure',
        'RumWhetstoneDropProcedure',
        'SakuraWhetstoneDropProcedure',
        'SanctifiedWhetstoneDropProcedure',
        'SculkPatientZeroDropProcedure',
        'SculkWhetstoneDropProcedure',
        'SlimeWhetstoneDropProcedure',
        'SoulWhetstoneDropProcedure',
        'SpineOfADeathLordDropProcedure',
        'StoneWhetstoneDropProcedure',
        'TarantulaWhetstoneDropProcedure',
        'TheKingsColdHeartDropProcedure',
        'ThunderWhetstoneDropProcedure',
        'TitanWhetstoneDropProcedure',
        'VenomWhetstoneDropProcedure',
        'VineWhetstoneDropProcedure',
        'WaterWhetstoneDropProcedure',
        'ZombieWhetstoneDropProcedure'
    ]
    procedures.forEach(name => {
        bus.unregister(Java.loadClass('net.gqstavo.armamentarium.procedures.' + name))
    })
    console.info('Disabled ' + procedures.length + ' Armamentarium drop/interaction handlers')
})
