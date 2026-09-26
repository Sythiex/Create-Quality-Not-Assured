// Repair existing and newly generated fisherman offers before the trading UI opens.
// Recheck each interaction so offers unlocked by leveling up are covered too.
ItemEvents.entityInteracted(event => {
    const villager = event.target
    if (villager.type !== 'minecraft:villager') return
    const VillagerProfession = Java.loadClass('net.minecraft.world.entity.npc.VillagerProfession')
    if (!villager.getVillagerData().getProfession().equals(VillagerProfession.FISHERMAN)) return

    const replacements = {
        'rusticdelight:calamari': 'culturaldelights:raw_calamari',
        'rusticdelight:cooked_calamari': 'culturaldelights:cooked_calamari'
    }
    // getOffers also generates a new villager's initial offers before we inspect them.
    const offers = villager.getOffers()
    const MerchantOffer = Java.loadClass('net.minecraft.world.item.trading.MerchantOffer')
    const NbtOps = Java.loadClass('net.minecraft.nbt.NbtOps')
    const ops = villager.registryAccess().createSerializationContext(NbtOps.INSTANCE)

    for (let i = 0; i < offers.size(); i++) {
        const offer = offers.get(i)
        if (!replacements[String(offer.getBaseCostA().id)] &&
            !replacements[String(offer.getCostB().id)] &&
            !replacements[String(offer.getResult().id)]) continue

        // Round-trip just this offer through its registry-aware codec. Preserve
        // counts, components, uses, stock limits, demand, discounts and XP.
        const data = MerchantOffer.CODEC.encodeStart(ops, offer).getOrThrow()
        ;['buy', 'buyB', 'sell'].forEach(key => {
            if (!data.contains(key, 10)) return
            const stack = data.getCompound(key)
            const replacement = replacements[String(stack.getString('id'))]
            if (replacement) stack.putString('id', replacement)
        })
        offers.set(i, MerchantOffer.CODEC.parse(ops, data).getOrThrow())
    }
})
