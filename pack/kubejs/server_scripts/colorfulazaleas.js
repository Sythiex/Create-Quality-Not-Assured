// Colorful Azaleas incorrectly uses Cherry Logs for all 16 unstripped wood recipes.
ServerEvents.recipes(event => {
    const variants = [
        'azule', 'bright', 'bromelia', 'cerulean',
        'dusk', 'earthen', 'fiss', 'lethe',
        'pastoral', 'pitch', 'pluvial', 'roze',
        'tecal', 'titanium', 'verdant', 'walnut'
    ]

    variants.forEach(variant => {
        event.replaceInput(
            { id: 'colorfulazaleas:' + variant + '_azalea_wood' },
            'minecraft:cherry_log',
            'colorfulazaleas:' + variant + '_azalea_log'
        )
    })
})
