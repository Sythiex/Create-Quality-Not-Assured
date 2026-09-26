ServerEvents.recipes(event => {
    // Remove the crafting recipes for all regular and framed Fluid Drawers.
    event.remove({ id: 'functionalstorage:fluid_1' })
    event.remove({ id: 'functionalstorage:fluid_2' })
    event.remove({ id: 'functionalstorage:fluid_4' })
    event.remove({ id: 'functionalstorage:framed_fluid_1' })
    event.remove({ id: 'functionalstorage:framed_fluid_2' })
    event.remove({ id: 'functionalstorage:framed_fluid_4' })
    event.remove({ id: 'functionalstorage:ender_drawer' })
    event.remove({ id: 'functionalstorage:dripping_upgrade' })
    event.remove({ id: 'functionalstorage:water_generator_upgrade' })
})
