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
