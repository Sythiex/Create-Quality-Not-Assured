// Quality Not Assured: reviewed Cafe/Cocktails compatibility using existing items.
// All replacements have qualitynotassured IDs, including recipes absent due to
// upstream conditions. No global fruit/juice tags or new items are introduced.
ServerEvents.recipes(event => {
    const bottle = 'minecraft:glass_bottle'
    const lemon = 'cookscollection:lemon'
    const lemonade = 'cookscollection:lemonade'
    const mint = 'culturaldelights:mint'
    const cinnamon = 'culturaldelights:cinnamon'
    const peach = 'yungscavebiomes:prickly_peach'

    function ingredient(id) {
        return id.charAt(0) === '#' ? { tag: id.substring(1) } : { item: id }
    }

    function replace(originalId, recipe) {
        event.remove({ id: originalId })
        event.custom(recipe).id('qualitynotassured:compat/' + originalId.replace(':', '/'))
    }

    function cafeTea(originalPath, fruit, fluid) {
        replace('createcafe:mixing/' + originalPath, {
            type: 'create:mixing',
            ingredients: [
                ingredient(fruit),
                { type: 'neoforge:tag', tag: 'c:milk', amount: 250 },
                { type: 'neoforge:single', fluid: 'createcafe:melted_sugar', amount: 250 }
            ],
            results: [{ id: 'createcafe:' + fluid, amount: 500 }],
            heat_requirement: 'heated'
        })
    }

    // The original grape recipe checks the plural tag but consumes the empty singular tag.
    cafeTea('grapes_tea_mixing', '#c:foods/grapes', 'grape_tea')
    cafeTea('peach_tea_mixing', peach, 'peach_tea')

    function cafeSyrup(flavor, flavorItem) {
        replace('createcafe:mixing/syrups/' + flavor + '_syrup_mixing', {
            type: 'create:mixing',
            ingredients: [
                ingredient(flavorItem),
                // Upstream uses fluidTag with neoforge:single, which cannot decode.
                { type: 'neoforge:single', fluid: 'minecraft:water', amount: 250 },
                { type: 'neoforge:single', fluid: 'createcafe:melted_sugar', amount: 750 }
            ],
            results: [{ id: 'createcafe:' + flavor + '_syrup', amount: 1000 }],
            heat_requirement: 'heated'
        })
    }
    cafeSyrup('coconut', 'crabbersdelight:coconut_halve')
    cafeSyrup('mint', mint)

    function cocktail(name, count, inputs) {
        replace('cocktailsdelight:' + name, {
            type: 'minecraft:crafting_shapeless',
            category: 'misc',
            ingredients: inputs.map(ingredient),
            result: { id: 'cocktailsdelight:' + name, count: count }
        })
    }

    cocktail('mint_julep', 1, [mint, 'cocktailsdelight:whiskey', 'minecraft:sugar', bottle])
    cocktail('hot_toddy', 2, [lemon, 'cocktailsdelight:whiskey', 'minecraft:honey_bottle', cinnamon, bottle, bottle])
    cocktail('mexican_hot_chocolate', 3, [
        '#c:drinks/milk', 'mynethersdelight:bullet_pepper', 'cocktailsdelight:kahlua',
        'cocktailsdelight:tequila', 'minecraft:cocoa_beans', bottle, bottle, bottle
    ])
    cocktail('espresso_martini', 2, [
        'cocktailsdelight:kahlua', 'brewinandchewin:vodka',
        'rusticdelight:roasted_coffee_beans', 'rusticdelight:dark_coffee', bottle, bottle
    ])
    cocktail('bees_knees', 3, [lemon, 'cocktailsdelight:gin', 'minecraft:honey_bottle', bottle, bottle, bottle])
    cocktail('whiskey_sour', 2, [lemon, 'cocktailsdelight:whiskey', 'minecraft:sugar', bottle, bottle])
    cocktail('gin_and_juice', 2, [lemonade, 'cocktailsdelight:gin', bottle, bottle])
    cocktail('half_and_half', 2, [lemonade, 'create:builders_tea', bottle, bottle])

    replace('cocktailsdelight:cooking/mulled_cider', {
        type: 'farmersdelight:cooking',
        ingredients: [ingredient(cinnamon), ingredient('cocktailsdelight:hard_cider')],
        result: { id: 'cocktailsdelight:mulled_cider', count: 1 },
        experience: 1,
        recipe_book_tab: 'misc'
    })

    function ferment(path, baseFluid, outputFluid, inputs, temperature) {
        replace('cocktailsdelight:fermenting/' + path, {
            type: 'brewinandchewin:fermenting',
            ingredients: inputs.map(ingredient),
            base_fluid: { ingredient: { id: baseFluid }, amount: 1000, unit: 'millibuckets' },
            result: { id: outputFluid, amount: 1000 },
            unit: 'millibuckets',
            fermenting_time: 9600,
            experience: 1,
            temperature: temperature
        })
    }

    ferment('peach_wine_from_water', 'minecraft:water', 'cocktailsdelight:peach_wine',
        [peach, peach, 'minecraft:sugar'], 3)

    // Preserve every original mulled-wine base, including the restored peach wine.
    const wineBases = {
        wine: 'red_wine',
        sweet_wine: 'sweet_red_wine',
        white_wine: 'white_wine',
        peach_wine: 'peach_wine'
    }
    Object.keys(wineBases).forEach(suffix => {
        ferment('mulled_wine_from_' + suffix, 'cocktailsdelight:' + wineBases[suffix],
            'cocktailsdelight:mulled_wine',
            [cinnamon, '#c:foods/fruit', '#c:seeds', '#c:foods/berry'], 5)
    })

    // Feed the existing hard-lemonade fermenting recipes with a working bottle drain.
    event.custom({
        type: 'create:emptying',
        ingredients: [ingredient(lemonade)],
        results: [
            { id: bottle },
            { id: 'cocktailsdelight:lemonade', amount: 250 }
        ]
    }).id('qualitynotassured:compat/cocktailsdelight/emptying/cookscollection_lemonade')

    // Kahlua fluid has no consumers. Its craftable bottles need no conversion.
})
