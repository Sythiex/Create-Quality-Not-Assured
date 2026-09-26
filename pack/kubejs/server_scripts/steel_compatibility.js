// Use TFMG steel throughout crafting, with 144 mB of molten steel per ingot.
ServerEvents.recipes(event => {
    event.remove({ id: 'createbigcannons:mixing/alloy_steel' })

    // CBC defaults to 90 mB per ingot; match TFMG's casting yield instead.
    event.remove({ id: 'createbigcannons:compacting/forge_steel_ingot' })
    event.custom({
        type: 'create:compacting',
        ingredients: [{ type: 'neoforge:tag', tag: 'c:molten_steel', amount: 144 }],
        results: [{ id: 'tfmg:steel_ingot' }]
    }).id('createbigcannons:compacting/forge_steel_ingot')

    event.remove({ id: 'createbigcannons:compacting/forge_steel_block' })
    event.custom({
        type: 'create:compacting',
        ingredients: [{ type: 'neoforge:tag', tag: 'c:molten_steel', amount: 1296 }],
        results: [{ id: 'createbigcannons:steel_block' }]
    }).id('createbigcannons:compacting/forge_steel_block')

    // Includes unpacking CBC blocks and crafting ingots from CBC steel scrap.
    event.replaceOutput({}, 'createbigcannons:steel_ingot', 'tfmg:steel_ingot')
    // Preserve recipes whose ingredients use the old item instead of a tag.
    event.replaceInput({}, 'createbigcannons:steel_ingot', 'tfmg:steel_ingot')
})
