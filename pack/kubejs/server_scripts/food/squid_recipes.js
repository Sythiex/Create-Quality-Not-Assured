// Cultural Delights squid backbone. Keep Ocean's cut tentacles and unique meals.
// Barrels store whole squid by species; the crate stores raw calamari.
ServerEvents.recipes(event => {
    const raw = 'culturaldelights:raw_calamari'
    const cooked = 'culturaldelights:cooked_calamari'
    const replacements = {
        'crabbersdelight:raw_squid_tentacles': raw,
        'crabbersdelight:raw_glow_squid_tentacles': raw,
        'oceansdelight:tentacles': raw,
        'rusticdelight:calamari': raw,
        'crabbersdelight:cooked_squid_tentacles': cooked,
        'crabbersdelight:cooked_glow_squid_tentacles': cooked,
        'rusticdelight:cooked_calamari': cooked,
        'rusticdelight:calamari_roll': 'culturaldelights:calamari_roll'
    }

    // Remove competing cooking routes BEFORE replacing their ingredients.
    const removed = [
        'crabbersdelight:cooked_squid_tentacles',
        'crabbersdelight:cooked_squid_tentacles_from_smoking',
        'crabbersdelight:cooked_squid_tentacles_from_campfire_cooking',
        'crabbersdelight:cooked_glow_squid_tentacles',
        'crabbersdelight:cooked_glow_squid_tentacles_from_smoking',
        'crabbersdelight:cooked_glow_squid_tentacles_from_campfire_cooking',
        'rusticdelight:cooked_calamari',
        'rusticdelight:cooked_calamari_from_smoking',
        'rusticdelight:cooked_calamari_from_campfire_cooking',
        'rusticdelight:cooked_calamari_slice',
        'rusticdelight:cooked_calamari_slice_from_smoking',
        'rusticdelight:cooked_calamari_slice_from_campfire_cooking',
        'rusticdelight:cutting/calamari_slice',
        'rusticdelight:calamari_roll'
    ]
    removed.forEach(id => event.remove({ id: id }))

    // Work on JSON ingredient/output fields so custom cutting/frying serializers
    // are covered too. Exact IDs only; tag names and recipe conditions stay intact.
    function rewrite(value) {
        if (typeof value === 'string') return replacements[value] || value
        if (Array.isArray(value)) return value.map(rewrite)
        if (value && typeof value === 'object') {
            Object.keys(value).forEach(key => {
                if (key !== 'tag') value[key] = rewrite(value[key])
            })
        }
        return value
    }

    const fields = ['ingredient', 'ingredients', 'key', 'input', 'inputs',
        'base', 'addition', 'result', 'results', 'output', 'outputs']
    const patches = []
    event.forEachRecipe({}, recipe => {
        const id = String(recipe.getId())
        if (removed.indexOf(id) !== -1) return
        const json = JSON.parse(recipe.json.toString())
        const before = JSON.stringify(json)
        fields.forEach(field => {
            if (json[field] !== undefined) json[field] = rewrite(json[field])
        })

        // Override generic portion replacement for species-specific storage.
        // Keep packing and unpacking paired at the original nine-item quantity.
        if (id === 'crabbersdelight:squid_barrel') {
            json.key['#'] = { item: 'culturaldelights:squid' }
        } else if (id === 'crabbersdelight:squid_from_barrel') {
            json.result.id = 'culturaldelights:squid'
        } else if (id === 'crabbersdelight:glow_squid_barrel') {
            json.key['#'] = { item: 'culturaldelights:glow_squid' }
        } else if (id === 'crabbersdelight:glow_squid_from_barrel') {
            json.result.id = 'culturaldelights:glow_squid'
        }

        if (id === 'create_deepfried:deep_frying/calamari') {
            json.ingredients = json.ingredients.map(ingredient => {
                return ingredient.tag === 'c:squid' ? { item: raw } : ingredient
            })
        }

        if (JSON.stringify(json) !== before) patches.push({ id: id, json: json })
    })
    patches.forEach(patch => {
        event.remove({ id: patch.id })
        event.custom(patch.json).id(patch.id)
    })
    console.info('[Squid unification] Patched ' + patches.length + ' recipes; removed ' + removed.length + ' redundant recipes.')
})

ServerEvents.tags('item', event => {
    // Union of the replaced raw items' bundled tags in the installed versions.
    // Broad fish/whole/portion membership is intentional for this pack.
    const rawTags = [
        'c:foods', 'c:foods/raw_squid', 'c:foods/raw_calamari', 'c:tentacles',
        'crabbersdelight:raw_squid', 'diet:proteins', 'forge:tentacles',
        'frycooks_delight:has_fish_slice', 'minecraft:cat_food',
        'minecraft:fishes', 'minecraft:ocelot_food', 'rusticdelight:calamari_roll_ingredients'
    ]
    const cookedTags = [
        'c:foods', 'c:foods/cooked_squid', 'c:foods/cooked_calamari',
        'crabbersdelight:cooked_squid', 'forge:tentacles', 'minecraft:fishes'
    ]
    rawTags.forEach(tag => event.add(tag, 'culturaldelights:raw_calamari'))
    cookedTags.forEach(tag => event.add(tag, 'culturaldelights:cooked_calamari'))
})
