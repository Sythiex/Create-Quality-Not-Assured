// Chest rewards are deliberately narrower than the recycling ingredient tag.
const armamentariumLootWeapons = [
    'armamentarium:zombified_arm',
    'armamentarium:bonecarved_scythe',
    'armamentarium:flame_frenzied_claymore',
    'armamentarium:devourers_forked_tongue',
    'armamentarium:razor_sharp_arachnostars_3',
    'armamentarium:evergale_wand',
    'armamentarium:driftstone_kris',
    'armamentarium:slimesling_whip',
    'armamentarium:heavenly_virtues_shamshir',
    'armamentarium:hanakiba',
    'armamentarium:lazulian_order_kunai_4',
    'armamentarium:blood_prince_flamberge',
    'armamentarium:eventide_waveblade',
    'armamentarium:tarantula_cragneedle',
    'armamentarium:blade_of_ruin',
    'armamentarium:thorned_chorus_root',
    'armamentarium:sea_guardian_twinblade',
    'armamentarium:scorpion_queens_rapier',
    'armamentarium:dead_mans_glove',
    'armamentarium:vilethorn_pike',
    'armamentarium:greataxe_of_glory',
    'armamentarium:honeycomb_gavel',
    'armamentarium:icebreaker',
    'armamentarium:holy_mourning_star',
    'armamentarium:mjolnir',
    'armamentarium:executioner',
    'armamentarium:halberd_of_the_omens',
    'armamentarium:twinned_netherdagger',
    'armamentarium:mariana_scepter',
    'armamentarium:empyrean_cinquedea',
    'armamentarium:ender_maiden_shortbow',
    'armamentarium:rum_strawberry'
]

// All 56 weapon IDs in Armamentarium 1.3.3, including depleted charge states,
// the Ancient Cullblade, and all six reusable throwable fruit tonics.
// Ordinary mining tools and armor are not weapons.
const armamentariumRecyclableWeapons = armamentariumLootWeapons.concat([
    'armamentarium:ancient_cullblade',
    'armamentarium:dragonslayer',
    'armamentarium:emerald_karambit',
    'armamentarium:excalibur',
    'armamentarium:greatalloy_axe',
    'armamentarium:greatalloy_sword',
    'armamentarium:reaper_of_the_gaol',
    'armamentarium:severance_scythe',
    'armamentarium:severance_shotel',
    'armamentarium:splitwing_scissorblade',
    'armamentarium:teraton_blackhammer',
    'armamentarium:warspear_of_the_desecrator',
    'armamentarium:lazulian_order_kunai_0',
    'armamentarium:lazulian_order_kunai_1',
    'armamentarium:lazulian_order_kunai_2',
    'armamentarium:lazulian_order_kunai_3',
    'armamentarium:razor_sharp_arachnostars_0',
    'armamentarium:razor_sharp_arachnostars_1',
    'armamentarium:razor_sharp_arachnostars_2',
    'armamentarium:rum_orange',
    'armamentarium:rum_pineapple',
    'armamentarium:rum_lime',
    'armamentarium:rum_coconut',
    'armamentarium:rum_passion'
])

const armamentariumWhetstones = [
    'angel', 'blaze', 'blood', 'bone', 'emerald', 'end', 'feather', 'flesh',
    'gilded', 'gravity', 'guardian', 'harmony', 'honey', 'jack', 'lazulian',
    'magma', 'ocean', 'poison', 'purpur', 'rum', 'sakura', 'sanctified',
    'sculk', 'slime', 'soul', 'stone', 'tarantula', 'thunder', 'titan',
    'venomous', 'vine', 'water', 'zombie'
].map(name => 'armamentarium:' + name + '_whetstone')

const armamentariumArmor = [
    'adamantine', 'death_prince', 'lone_graveseeker', 'greatalloy_armor'
].flatMap(set => ['helmet', 'chestplate', 'leggings', 'boots']
    .map(slot => 'armamentarium:' + set + '_' + slot))

// One chance roll per table generation, then one equally weighted weapon.
const armamentariumLootChances = {
    'mes:mega_ship_treasure': 1 / 5,
    'mns:chests/treasure': 1 / 10,
    'mns:chests/dragon_arena/epic': 1 / 2,
    'mns:chests/large_arena/treasure': 1 / 8,
    'mns:chests/mega_fortress/intact_treasure': 1 / 10,
    'mtr:desert_temple_lower_chamber': 1 / 12,
    'mtr:jungle_temple_puzzle_treasure': 1 / 6,
    'mtr:nether_temple_rare': 1 / 4,
    'betterjungletemples:chests/treasure': 1 / 3,
    'idas:chests/collectors_museum/museum_treasure': 1 / 10,
    'idas:chests/desert_pyramid/desert_pyramid_treasure': 1 / 16,
    'idas:chests/labyrinth/labyrinth_tomb': 1 / 16,
    'idas:chests/ruins_of_the_deep/ruins_treasure': 1 / 16,
    'idas:chests/tinkers_citadel/tinkers_citadel_vault': 1 / 12,
    'idas:chests/tinkers_workshop/tinkers_workshop_vault': 1 / 12,
    'dungeoncrawl:chests/treasure': 1 / 7
}

ServerEvents.tags('item', event => {
    event.add('qualitynotassured:armamentarium_recyclable_weapons', armamentariumRecyclableWeapons)
})

ServerEvents.recipes(event => {
    event.remove({ id: 'armamentarium:keystone_recipe' })
    event.remove({ id: 'armamentarium:severance_shotel_recipe' })
    event.remove({ id: 'armamentarium:severance_scythe' })

    // Remove all armor crafting/upgrading and reclamation, plus unused templates.
    armamentariumArmor.forEach(item => {
        event.remove({ output: item })
        event.remove({ input: item })
    })
    ;['adam_template', 'damon_template', 'theron_template'].forEach(template => {
        event.remove({ output: 'armamentarium:' + template })
    })

    // Recycling is the only recipe source for this currency and for whetstones.
    event.remove({ output: 'armamentarium:raw_adamantium' })
    armamentariumWhetstones.forEach(item => event.remove({ output: item }))

    // Tag ingredients accept duplicates, damage and enchantments. All three items
    // are consumed; no components are copied onto the single fresh salvage item.
    const recyclable = '#qualitynotassured:armamentarium_recyclable_weapons'
    event.shapeless('armamentarium:raw_adamantium', [recyclable, recyclable, recyclable])
        .id('qualitynotassured:armamentarium/recycle_weapons')

    armamentariumWhetstones.forEach(item => {
        event.stonecutting(item, 'armamentarium:raw_adamantium')
            .id('qualitynotassured:armamentarium/whetstones/' + item.split(':')[1])
    })

    event.smithing(
        'armamentarium:greatalloy_ingot',
        'minecraft:netherite_upgrade_smithing_template',
        'create:brass_ingot',
        'minecraft:netherite_ingot'
    ).id('qualitynotassured:greatalloy_ingot')

    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'equipment',
        pattern: [
            ' a ',
            'bcb',
            'ded'
        ],
        key: {
            a: { item: 'minecraft:quartz_block' },
            b: { item: 'armamentarium:greatalloy_ingot' },
            c: { item: 'minecraft:iron_block' },
            d: { item: 'create:brass_ingot' },
            e: { item: 'armamentarium:raw_adamantium' }
        },
        result: { id: 'armamentarium:blade_of_ruin', count: 1 }
    }).id('qualitynotassured:blade_of_ruin')

    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'equipment',
        pattern: [
            ' b ',
            'cdc',
            'efe'
        ],
        key: {
            b: { item: 'armamentarium:greatalloy_block' },
            c: { item: 'minecraft:diamond' },
            d: { item: 'minecraft:iron_block' },
            e: { item: 'armamentarium:vine_of_glory' },
            f: { item: 'armamentarium:blade_of_ruin' }
        },
        result: { id: 'armamentarium:excalibur', count: 1 }
    }).id('armamentarium:excalibur')

    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'misc',
        pattern: [
            'abc',
            ' d ',
            'efg'
        ],
        key: {
            a: { item: 'minecraft:ghast_tear' },
            b: { item: 'armamentarium:blood_whetstone' },
            c: { item: 'armamentarium:greatalloy_ingot' },
            d: { item: 'minecraft:iron_ingot' },
            e: { item: 'minecraft:netherite_ingot' },
            f: { item: 'minecraft:end_rod' },
            g: { item: 'minecraft:redstone_block' }
        },
        result: { id: 'armamentarium:blood_prince_flamberge', count: 1 }
    }).id('armamentarium:blood_prince_flamberge_recipe')

    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'equipment',
        pattern: [
            'abc',
            'ded',
            'fgf'
        ],
        key: {
            a: { item: 'armamentarium:vine_of_glory' },
            b: { item: 'minecraft:netherite_ingot' },
            c: { item: 'armamentarium:vine_of_agony' },
            d: { item: 'minecraft:iron_block' },
            e: { item: 'armamentarium:the_mind_of_jean' },
            f: { item: 'armamentarium:greatalloy_block' },
            g: { item: 'armamentarium:excalibur' }
        },
        result: { id: 'armamentarium:dragonslayer', count: 1 }
    }).id('armamentarium:dragon_slayer')

    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'misc',
        pattern: [
            'aab',
            ' cd',
            'ef '
        ],
        key: {
            a: { item: 'armamentarium:ancient_cullblade' },
            b: { item: 'armamentarium:sculk_patient_zero' },
            c: { item: 'minecraft:netherite_hoe' },
            d: { item: 'minecraft:sculk_catalyst' },
            e: { item: 'betterend:aeternium_ingot' },
            f: { item: 'armamentarium:raw_adamantium' }
        },
        result: { id: 'armamentarium:reaper_of_the_gaol', count: 1 }
    }).id('armamentarium:reaper_of_the_gaol_recipe')

    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'equipment',
        pattern: [
            'aba',
            'cdc',
            ' e '
        ],
        key: {
            a: { item: 'betterend:aeternium_ingot' },
            b: { item: 'armamentarium:kings_cold_heart' },
            c: { item: 'minecraft:netherite_ingot' },
            d: { item: 'armamentarium:raw_adamantium' },
            e: { item: 'minecraft:anvil' }
        },
        result: { id: 'armamentarium:teraton_blackhammer', count: 1 }
    }).id('armamentarium:teraton_blackhammer')

    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'equipment',
        pattern: [
            'aba',
            'cdc',
            ' e '
        ],
        key: {
            a: { item: 'minecraft:netherite_sword' },
            b: { item: 'armamentarium:spine_of_a_death_lord' },
            c: { item: 'minecraft:redstone_block' },
            d: { item: 'armamentarium:raw_adamantium' },
            e: { item: 'betterend:aeternium_ingot' }
        },
        result: { id: 'armamentarium:warspear_of_the_desecrator', count: 1 }
    }).id('armamentarium:warspear_of_the_desecrator')
})

// Preserve the restored Greatalloy block drops, including their explosion rules.
// All other tables still have Armamentarium items stripped before approved rewards.
const armamentariumFilteredLootTables = /^(?!armamentarium:blocks\/(?:greatalloy_block|greatalloy_brick)$).*/
LootJS.lootTables(event => {
    event.modifyLootTables(armamentariumFilteredLootTables).removeItem('@armamentarium')
})

LootJS.modifiers(event => {
    const Player = Java.loadClass('net.minecraft.world.entity.player.Player')

    // Also filter generated loot, including items supplied by tag entries.
    event.addTableModifier(armamentariumFilteredLootTables).removeLoot('@armamentarium')

    // Run after removal. A single pool roll chooses one of the 32 entries;
    // zero bonus rolls and zero quality keep Luck from changing the odds.
    Object.keys(armamentariumLootChances).forEach(table => {
        event.addTableModifier(table)
            .randomChance(armamentariumLootChances[table])
            .pool(pool => {
                pool.rolls(1).bonusRolls(0)
                armamentariumLootWeapons.forEach(item => {
                    pool.addEntry(LootEntry.of(item).setCount(1).withWeight(1).withQuality(0))
                })
            })
    })

    // Add this exception after the removal above so Ambrosia survives the filter.
    // Check the killing player and their main hand at the time of the Wither's death.
    event.addTableModifier('minecraft:entities/wither')
        .matchAttackerCustom(attacker =>
            attacker instanceof Player &&
            attacker.getMainHandItem().id === 'armamentarium:blade_of_ruin'
        )
        .addLoot('armamentarium:ambrosia')
})

// Restore the original guaranteed Mind of Jean reward. The killer must hold
// Teraton Blackhammer, Reaper of the Gaol, Warspear of the Desecrator, or
// Dragonslayer in their main hand. Reuse the mod's procedure to preserve its
// conditions, item spawn, message and sounds. Direct spawns bypass loot filters.
// Keep its native subscriber disabled in startup_scripts to avoid duplicate drops.
EntityEvents.death('minecraft:ender_dragon', event => {
    const dragon = event.getEntity()
    const reward = Java.loadClass('net.gqstavo.armamentarium.procedures.MindOfJeanDropProcedure')
    reward.execute(
        dragon.level(), dragon.getX(), dragon.getY(), dragon.getZ(),
        dragon, event.getSource().getEntity()
    )
})

// Guaranteed Sculk Patient Zero from a Warden with sky access, with any weapon.
// Preserve the original credited-killer requirement, sky check, message and sounds.
// Spawn directly to bypass loot filtering; keep the native subscriber disabled.
EntityEvents.death('minecraft:warden', event => {
    const warden = event.getEntity()
    const level = warden.level()
    const killer = event.getSource().getEntity()
    if (level.isClientSide() || killer == null) return
    if (!level.canSeeSkyFromBelowWater(warden.blockPosition())) return

    const ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
    const drop = new ItemEntity(
        level, warden.getX(), warden.getY(), warden.getZ(),
        Item.of('armamentarium:sculk_patient_zero')
    )
    drop.setPickUpDelay(10)
    level.addFreshEntity(drop)

    const Player = Java.loadClass('net.minecraft.world.entity.player.Player')
    const Component = Java.loadClass('net.minecraft.network.chat.Component')
    if (killer instanceof Player) {
        killer.displayClientMessage(Component.literal("You severed the Sculk's Patient Zero!"), true)
    }
    const SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
    const SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
    level.playSound(null, warden.blockPosition(), SoundEvents.UI_STONECUTTER_TAKE_RESULT, SoundSource.NEUTRAL, 2, 0)
    level.playSound(null, warden.blockPosition(), SoundEvents.ENCHANTMENT_TABLE_USE, SoundSource.NEUTRAL, 2, 0)
    level.playSound(null, warden.blockPosition(), SoundEvents.ALLAY_AMBIENT_WITHOUT_ITEM, SoundSource.NEUTRAL, 0.2, 2)
})

// Guaranteed King's Cold Heart from an Elder Guardian killed in the Nether.
// Any weapon or empty hand qualifies; retain the credited-killer requirement.
// Spawn directly to bypass loot filtering; keep the native subscriber disabled.
EntityEvents.death('minecraft:elder_guardian', event => {
    const guardian = event.getEntity()
    const level = guardian.level()
    const killer = event.getSource().getEntity()
    if (level.isClientSide() || killer == null) return
    const Level = Java.loadClass('net.minecraft.world.level.Level')
    if (!level.dimension().equals(Level.NETHER)) return

    const ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
    const drop = new ItemEntity(
        level, guardian.getX(), guardian.getY(), guardian.getZ(),
        Item.of('armamentarium:kings_cold_heart')
    )
    drop.setPickUpDelay(10)
    level.addFreshEntity(drop)

    const Player = Java.loadClass('net.minecraft.world.entity.player.Player')
    const Component = Java.loadClass('net.minecraft.network.chat.Component')
    if (killer instanceof Player) {
        killer.displayClientMessage(Component.literal("You severed the King's Cold Heart!"), true)
    }
    const SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
    const SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
    level.playSound(null, guardian.blockPosition(), SoundEvents.UI_STONECUTTER_TAKE_RESULT, SoundSource.NEUTRAL, 2, 0)
    level.playSound(null, guardian.blockPosition(), SoundEvents.ENCHANTMENT_TABLE_USE, SoundSource.NEUTRAL, 2, 0)
    level.playSound(null, guardian.blockPosition(), SoundEvents.ALLAY_AMBIENT_WITHOUT_ITEM, SoundSource.NEUTRAL, 0.2, 2)
})

// Guaranteed Spine of a Death-Lord from a Wither previously near an Ender Dragon.
// The mod's active WorkAroundProcedure permanently sets this proximity flag.
// Any weapon or empty hand qualifies; retain the credited-killer requirement.
// Spawn directly, leaving the native drop subscriber disabled (it also gives Ambrosia).
EntityEvents.death('minecraft:wither', event => {
    const wither = event.getEntity()
    const level = wither.level()
    const killer = event.getSource().getEntity()
    if (level.isClientSide() || killer == null) return
    if (!wither.getPersistentData().getBoolean('spinethathoe')) return

    const ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
    const drop = new ItemEntity(
        level, wither.getX(), wither.getY(), wither.getZ(),
        Item.of('armamentarium:spine_of_a_death_lord')
    )
    drop.setPickUpDelay(10)
    level.addFreshEntity(drop)

    const Player = Java.loadClass('net.minecraft.world.entity.player.Player')
    const Component = Java.loadClass('net.minecraft.network.chat.Component')
    if (killer instanceof Player) {
        killer.displayClientMessage(Component.literal('You severed the Spine of a Death-Lord!'), true)
    }
    const SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
    const SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
    level.playSound(null, wither.blockPosition(), SoundEvents.UI_STONECUTTER_TAKE_RESULT, SoundSource.NEUTRAL, 2, 0)
    level.playSound(null, wither.blockPosition(), SoundEvents.ENCHANTMENT_TABLE_USE, SoundSource.NEUTRAL, 2, 0)
    level.playSound(null, wither.blockPosition(), SoundEvents.ALLAY_AMBIENT_WITHOUT_ITEM, SoundSource.NEUTRAL, 0.2, 2)
})

// Remove whetstone and Severance Shotel offers before the trading screen opens, including offers
// saved on existing villagers/traders. Keep all unrelated trades intact.
ItemEvents.entityInteracted(event => {
    const merchant = event.target
    if (merchant.type !== 'minecraft:villager' && merchant.type !== 'minecraft:wandering_trader') return

    const offers = merchant.getOffers()
    for (let i = offers.size() - 1; i >= 0; i--) {
        const offer = offers.get(i)
        const involvesBlockedItem = [offer.getBaseCostA(), offer.getCostB(), offer.getResult()]
            .some(stack => {
                const item = String(stack.id)
                return item === 'armamentarium:severance_shotel' || armamentariumWhetstones.indexOf(item) !== -1
            })
        if (involvesBlockedItem) offers.remove(i)
    }
})
