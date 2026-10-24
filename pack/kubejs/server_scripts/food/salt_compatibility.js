// Allow either salt item in recipes by using the shared salt tag.
// replaceInput skips recipe types without KubeJS schemas (including baking,
// Farmer's Delight cooking, and Cultural Delights aging), so patch their JSON.
ServerEvents.recipes(event => {
    const saltItems = ['ratatouille:salt', 'cookscollection:salt']
    const saltTags = ['c:salt', 'c:dusts/salt']

    function rewriteIngredient(value) {
        if (typeof value === 'string') {
            if (saltItems.indexOf(value) !== -1 ||
                saltTags.some(tag => value === '#' + tag)) return '#c:salts'
            return value
        }
        if (Array.isArray(value)) return value.map(rewriteIngredient)
        if (value && typeof value === 'object') {
            if (saltItems.indexOf(value.item) !== -1) {
                delete value.item
                value.tag = 'c:salts'
            } else if (saltTags.indexOf(value.tag) !== -1) {
                value.tag = 'c:salts'
            }
            Object.keys(value).forEach(key => {
                value[key] = rewriteIngredient(value[key])
            })
        }
        return value
    }

    // Restrict traversal to inputs; preserve outputs, conditions, and metadata.
    const inputFields = ['ingredient', 'ingredients', 'key', 'input', 'inputs',
        'base', 'addition']
    const patches = []
    event.forEachRecipe({}, recipe => {
        const json = JSON.parse(recipe.json.toString())
        const before = JSON.stringify(json)
        inputFields.forEach(field => {
            if (json[field] !== undefined) json[field] = rewriteIngredient(json[field])
        })
        if (JSON.stringify(json) !== before) {
            patches.push({ id: String(recipe.getId()), json: json })
        }
    })
    patches.forEach(patch => {
        event.remove({ id: patch.id })
        event.custom(patch.json).id(patch.id)
    })
    console.info('[Salt unification] Patched ' + patches.length + ' recipes.')
})
