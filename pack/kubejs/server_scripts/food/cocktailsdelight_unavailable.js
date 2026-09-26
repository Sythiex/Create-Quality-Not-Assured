// Updated for drink_compatibility.js; see codex/drink-compatibility/REPORT.md.
// Cocktail's Delight 1.1.11: inaccessible fluids, drinks, and grenadine.
// Audit: codex/cocktailsdelight-audit/REPORT.md and trace.json (2026-09-23).
// Re-audit after mod/recipe/tag changes. Viewer visibility only.
// Cider is obtainable by reverse keg filling; Kahlua bottles are craftable
// even though Kahlua fluid has no conversion recipe. Keep these items visible.

var cocktailsUnavailableFluids = [
    "cocktailsdelight:blue_curacao",
    "cocktailsdelight:kahlua",
    "cocktailsdelight:nut_brown_ale",
    "cocktailsdelight:plum_wine",
]

var cocktailsUnavailableItems = [
    "cocktailsdelight:aqua_velva",
    "cocktailsdelight:blue_curacao",
    "cocktailsdelight:brass_monkey",
    "cocktailsdelight:china_blue",
    "cocktailsdelight:cranberry_juice",
    "cocktailsdelight:gimlet",
    "cocktailsdelight:grenadine",
    "cocktailsdelight:johnny_silverhand",
    "cocktailsdelight:lemon_lime",
    "cocktailsdelight:margarita",
    "cocktailsdelight:medina",
    "cocktailsdelight:mermaid_lemonade",
    "cocktailsdelight:mojito",
    "cocktailsdelight:nut_brown_ale",
    "cocktailsdelight:pina_colada",
    "cocktailsdelight:plum_wine",
    "cocktailsdelight:salted_margarita",
    "cocktailsdelight:screwdriver",
    "cocktailsdelight:singapore_sling",
    "cocktailsdelight:tequila_sunrise",
]

RecipeViewerEvents.removeEntries('fluid', event => {
    cocktailsUnavailableFluids.forEach(id => {
        event.remove(id)
        event.remove(id.replace('cocktailsdelight:', 'cocktailsdelight:flowing_'))
    })
})

RecipeViewerEvents.removeEntries('item', event => {
    cocktailsUnavailableItems.forEach(id => event.remove(id))
})

// Hide recipes whose ingredients remain unavailable after compatibility fixes.
RecipeViewerEvents.removeRecipes(event => {
    var recipes = [
    "cocktailsdelight:petrolpark/filling/pouring/blue_curacao",
    "cocktailsdelight:petrolpark/filling/pouring/nut_brown_ale",
    "cocktailsdelight:petrolpark/filling/pouring/plum_wine",
    "cocktailsdelight:pouring/blue_curacao",
    "cocktailsdelight:pouring/nut_brown_ale",
    "cocktailsdelight:pouring/plum_wine",
]
    event.remove(recipes)
})
