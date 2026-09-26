// Remove the original Raw Adamantium lore, including its blank spacer lines.
ItemEvents.modifyTooltips(event => {
    const Component = Java.loadClass('net.minecraft.network.chat.Component')
    event.modify('armamentarium:raw_adamantium', tooltip => {
        for (let i = 0; i <= 6; i++) {
            tooltip.removeExactText(Component.translatable('item.armamentarium.raw_adamantium.description_' + i))
        }
    })
})
