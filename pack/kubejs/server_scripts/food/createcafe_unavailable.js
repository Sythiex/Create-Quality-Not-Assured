// Updated for drink_compatibility.js; see codex/drink-compatibility/REPORT.md.
// Create Cafe 1.4.3: unavailable fluids and their dependent drinks in this pack.
// Audited against the loaded recipe/item-tag snapshot dated 2026-09-23.
// Full trace and reasons: codex/createcafe-audit/REPORT.md and trace.json.
// Re-audit after adding fruit mods, changing tags, or updating Create Cafe.
// These events change recipe-viewer visibility only.

var cafeUnavailableFluids = [
    "createcafe:aloe_tea",
    "createcafe:apricot_tea",
    "createcafe:banana_syrup",
    "createcafe:banana_tea",
    "createcafe:barberry_tea",
    "createcafe:blackberry_tea",
    "createcafe:blood_tea",
    "createcafe:blueberry_tea",
    "createcafe:cherry_tea",
    "createcafe:citron_tea",
    "createcafe:dragonfruit_tea",
    "createcafe:durian_tea",
    "createcafe:fig_tea",
    "createcafe:gooseberry_tea",
    "createcafe:grapefruit_tea",
    "createcafe:guava_tea",
    "createcafe:jackfruit_tea",
    "createcafe:kiwi_tea",
    "createcafe:lavender_tea",
    "createcafe:lime_tea",
    "createcafe:lychee_tea",
    "createcafe:mana_tea",
    "createcafe:mandarin_tea",
    "createcafe:mango_tea",
    "createcafe:orange_tea",
    "createcafe:papaya_tea",
    "createcafe:passionfruit_tea",
    "createcafe:persimmon_tea",
    "createcafe:pineapple_tea",
    "createcafe:plum_tea",
    "createcafe:pomegranate_tea",
    "createcafe:pomelo_tea",
    "createcafe:raspberry_syrup",
    "createcafe:raspberry_tea",
    "createcafe:redlove_tea",
    "createcafe:starfruit_tea",
    "createcafe:strawberry_syrup",
    "createcafe:strawberry_tea",
    "createcafe:tamarind_tea",
    "createcafe:vanilla_syrup",
    "createcafe:vanilla_tea",
    "createcafe:yucca_tea",
]

var cafeUnavailableFoods = [
    "createcafe:aloe_milk_tea",
    "createcafe:apricot_milk_tea",
    "createcafe:banana_iced_coffee",
    "createcafe:banana_milk_tea",
    "createcafe:barberry_milk_tea",
    "createcafe:blackberry_milk_tea",
    "createcafe:blood_orange",
    "createcafe:blood_orange_milk_tea",
    "createcafe:blueberry_milk_tea",
    "createcafe:cherry_milk_tea",
    "createcafe:citron_milk_tea",
    "createcafe:dragonfruit_milk_tea",
    "createcafe:durian_milk_tea",
    "createcafe:fig_milk_tea",
    "createcafe:gooseberry_milk_tea",
    "createcafe:grapefruit_milk_tea",
    "createcafe:guava_milk_tea",
    "createcafe:jackfruit_milk_tea",
    "createcafe:kiwi_milk_tea",
    "createcafe:lavender_milk_tea",
    "createcafe:lime_milk_tea",
    "createcafe:lychee_milk_tea",
    "createcafe:mana_berries",
    "createcafe:mana_berry_milk_tea",
    "createcafe:mandarin_milk_tea",
    "createcafe:mango_milk_tea",
    "createcafe:orange_milk_tea",
    "createcafe:papaya_milk_tea",
    "createcafe:passionfruit_milk_tea",
    "createcafe:persimmon_milk_tea",
    "createcafe:pineapple_milk_tea",
    "createcafe:plum_milk_tea",
    "createcafe:pomegranate_milk_tea",
    "createcafe:pomelo_milk_tea",
    "createcafe:raspberry_iced_coffee",
    "createcafe:raspberry_milk_tea",
    "createcafe:redlove_milk_tea",
    "createcafe:starfruit_milk_tea",
    "createcafe:strawberry_iced_coffee",
    "createcafe:strawberry_milk_tea",
    "createcafe:tamarind_milk_tea",
    "createcafe:vanilla_iced_coffee",
    "createcafe:vanilla_milk_tea",
    "createcafe:yucca_milk_tea",
]

RecipeViewerEvents.removeEntries('fluid', event => {
    cafeUnavailableFluids.forEach(id => {
        event.remove(id)
        event.remove(id.replace('createcafe:', 'createcafe:flowing_'))
    })
})

RecipeViewerEvents.removeEntries('item', event => {
    cafeUnavailableFluids.forEach(id => event.remove(id + '_bucket'))
    cafeUnavailableFoods.forEach(id => event.remove(id))
})

// Hide filling recipes whose fluids remain unavailable.
RecipeViewerEvents.removeRecipes(event => {
    var recipes = [
    "createcafe:filling/aloe_tea_filling",
    "createcafe:filling/apricot_tea_filling",
    "createcafe:filling/banana_tea_filling",
    "createcafe:filling/barberry_tea_filling",
    "createcafe:filling/blackberry_tea_filling",
    "createcafe:filling/blood_tea_filling",
    "createcafe:filling/blueberry_tea_filling",
    "createcafe:filling/cherry_tea_filling",
    "createcafe:filling/citron_tea_filling",
    "createcafe:filling/coffee/banana_iced_coffee_filling",
    "createcafe:filling/coffee/raspberry_iced_coffee_filling",
    "createcafe:filling/coffee/strawberry_iced_coffee_filling",
    "createcafe:filling/coffee/vanilla_iced_coffee_filling",
    "createcafe:filling/dragonfruit_tea_filling",
    "createcafe:filling/durian_tea_filling",
    "createcafe:filling/fig_tea_filling",
    "createcafe:filling/gooseberry_tea_filling",
    "createcafe:filling/grapefruit_tea_filling",
    "createcafe:filling/guava_tea_filling",
    "createcafe:filling/jackfruit_tea_filling",
    "createcafe:filling/kiwi_tea_filling",
    "createcafe:filling/lavender_tea_filling",
    "createcafe:filling/lime_tea_filling",
    "createcafe:filling/lychee_tea_filling",
    "createcafe:filling/mana_tea_filling",
    "createcafe:filling/mandarin_tea_filling",
    "createcafe:filling/mango_tea_filling",
    "createcafe:filling/orange_tea_filling",
    "createcafe:filling/papaya_tea_filling",
    "createcafe:filling/passionfruit_tea_filling",
    "createcafe:filling/persimmon_tea_filling",
    "createcafe:filling/pineapple_tea_filling",
    "createcafe:filling/plum_tea_filling",
    "createcafe:filling/pomegranate_tea_filling",
    "createcafe:filling/pomelo_tea_filling",
    "createcafe:filling/raspberry_tea_filling",
    "createcafe:filling/redlove_tea_filling",
    "createcafe:filling/starfruit_tea_filling",
    "createcafe:filling/strawberry_tea_filling",
    "createcafe:filling/tamarind_tea_filling",
    "createcafe:filling/vanilla_tea_filling",
    "createcafe:filling/yucca_tea_filling",
]
    event.remove(recipes)
})
