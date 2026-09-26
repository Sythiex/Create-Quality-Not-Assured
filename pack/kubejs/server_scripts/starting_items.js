PlayerEvents.loggedIn(event => {
    const player = event.player
    const data = player.persistentData

    if (data.getBoolean('qna_received_starting_items')) return

    player.give('ftbquests:book')
    data.putBoolean('qna_received_starting_items', true)
})
