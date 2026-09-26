ServerEvents.recipes(event => {
    event.remove({ output: 'modulardynamics:energy_io_module' })
    event.remove({ output: 'modulardynamics:energy_wire_module' })

    event.shaped(Item.of('modulardynamics:pipe', 4), [
        'BRB',
        'R R',
        'BRB'
    ], {
        B: '#c:plates/brass',
        R: 'create:polished_rose_quartz'
    }).id('modulardynamics:pipe')

    event.shaped(Item.of('modulardynamics:wrench', 1), [
        'B B',
        ' I ',
        ' B '
    ], {
        B: '#c:ingots/brass',
        I: '#c:ingots/iron'
    }).id('modulardynamics:wrench')

    event.shaped(Item.of('modulardynamics:extractor_module', 1), [
        'BEB',
        'RPR',
        'BMB'
    ], {
        B: '#c:plates/brass',
        E: 'create:electron_tube',
        R: '#c:dusts/redstone',
        P: 'modulardynamics:pipe',
        M: 'create:precision_mechanism'
    }).id('modulardynamics:extractor_module')

    event.shaped(Item.of('modulardynamics:requestor_module', 1), [
        'EBE',
        'BMB',
        'EBE'
    ], {
        B: '#c:plates/brass',
        E: 'create:electron_tube',
        M: 'modulardynamics:extractor_module'
    }).id('modulardynamics:requestor_module')

    event.shaped(Item.of('modulardynamics:filter_module', 1), [
        'E',
        'C',
        'P'
    ], {
        E: 'create:electron_tube',
        C: 'modulardynamics:item_filter_card',
        P: 'modulardynamics:pipe'
    }).id('modulardynamics:filter_module')

    event.shaped(Item.of('modulardynamics:cover', 1), [
        'C',
        'N'
    ], {
        C: '#copycats:copycat_board',
        N: '#c:nuggets/industrial_iron'
    }).id('modulardynamics:cover')

    event.shaped(Item.of('modulardynamics:network_visualizer', 1), [
        ' B ',
        'BRB',
        ' T '
    ], {
        B: '#c:plates/brass',
        R: 'create:polished_rose_quartz',
        T: 'minecraft:redstone_torch'
    }).id('modulardynamics:network_visualizer')

    const cardRecipes = {
        'modulardynamics:overclock_card': { identifier: 'create:electron_tube', count: 1 },
        'modulardynamics:item_filter_card': { identifier: 'create:filter', count: 1 },
        'modulardynamics:item_stock_card': { identifier: 'create:stockpile_switch', count: 1 },
        'modulardynamics:fluid_filter_card': { identifier: 'create:smart_fluid_pipe', count: 1 },
        'modulardynamics:fluid_stock_card': { identifier: 'create:fluid_valve', count: 1 },
        'modulardynamics:mod_filter_card': { identifier: 'eccentrictome:tome', count: 1 },
        'modulardynamics:tag_filter_card': { identifier: 'create:attribute_filter', count: 1 },
        'modulardynamics:data_filter_card': { identifier: 'computercraft:computer_normal', count: 1 },
        'modulardynamics:matching_filter_card': { identifier: 'create:content_observer', count: 1 },
        'modulardynamics:priority_card': { identifier: 'simulated:redstone_magnet', count: 1 }
    }

    Object.entries(cardRecipes).forEach(([card, recipe]) => {
        event.shaped(Item.of(card, recipe.count), [
            'I',
            'N',
            'C'
        ], {
            I: recipe.identifier,
            N: '#c:nuggets/iron',
            C: '#c:plates/cardboard'
        }).id(card)
    })
})
