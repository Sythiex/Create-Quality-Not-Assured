ServerEvents.recipes(event => {
    event.remove({ id: 'create:splashing/gravel' })
    event.remove({ id: 'create:splashing/soul_sand' })

    // Keep red sand's original 5% dead bush output, without gold nuggets.
    event.remove({ id: 'create:splashing/red_sand' })
    event.custom({
        type: 'create:splashing',
        ingredients: [{ item: 'minecraft:red_sand' }],
        results: [{ chance: 0.05, id: 'minecraft:dead_bush' }]
    }).id('create:splashing/red_sand')
})
