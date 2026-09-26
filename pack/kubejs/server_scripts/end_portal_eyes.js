// /endportals on|off|status (operator permission level 2).
// Controls Eye of Ender insertion in the Overworld only.
// The setting is saved per world. A missing setting means disabled, including
// existing worlds that have never used this command. Reload with /reload.
const END_PORTAL_EYES_ENABLED_KEY = 'cqna:end_portal_eyes_enabled'

// FIXED OPENING WHISPER: always first, after a player switch, and after a full cycle.
const END_PORTAL_FIRST_WHISPER = "Only a king's blade may unseal the End."

// RANDOM WHISPERS: add more strings here. Each plays once per shuffled cycle.
// Run /reload after editing. This also resets the whisper sequence.
const END_PORTAL_RANDOM_WHISPERS = [
    'The ruined blade has yet to earn its name.',
    'The weapons of old lie scattered. The seal remembers.',
    'The Eye sees a stronghold. The seal sees a kingdom still in peril.',
    'The hand that bears ruin may yet bear hope.',
    'Among the arms of old, one blade was a promise.',
    'The old king left no key. Only a blade, and a duty.',
    'The scattered arms remember the hands that failed them.',
    'Beyond these stones waits the last battle. This is not yet yours.',
    'Let the kingdom speak your worth. The seal will listen.',
    'For a moment, the Eye looks back.',
    'You feel the weight of all the earth above you.',
    'There are still things beneath this sky worth tending to.',
    'A crown is not inherited here. It is answered for.',
    'The old steel waits for an older name.',
    'Beyond lies an ending for a story not yet told.',
    'Some relics remember triumph. Others remember the moment before it was lost.',
    'The old arms wait in tombs because their work outlived their wielders.',
    'A kingdom of death took more than land.',
    'What withers is not always dead.',
    'There are poisons that kill men, and poisons that kill ages.',
    'What was stolen from the divine may yet remain.',
    'The old name waits beyond ruin.',
    'Something on the other side seems very far away.',
    'The stone beneath your feet feels older than the halls around it.',
    'For a heartbeat, you remember a kingdom you have never seen.',
    'The silence feels less like refusal than expectation.',
    'You hear steel being drawn somewhere impossibly far away.',
    'Somewhere above, the world continues without you.'
]

// Shared, in-memory sequence; nothing about whispers is saved to the world.
const endPortalWhisperState = { lastPlayer: '', remaining: [] }

function whisperEndPortal(player) {
    const state = endPortalWhisperState
    const playerId = String(player.getStringUuid())
    let message

    if (state.lastPlayer !== playerId || state.remaining.length === 0) {
        message = END_PORTAL_FIRST_WHISPER
        state.lastPlayer = playerId
        state.remaining = END_PORTAL_RANDOM_WHISPERS.slice()

        // Fisher-Yates: shuffle a fresh copy, then draw without replacement.
        // Use let: this Rhino version does not reinitialize loop-local consts.
        for (let i = state.remaining.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let previous = state.remaining[i]
            state.remaining[i] = state.remaining[j]
            state.remaining[j] = previous
        }
    } else {
        message = state.remaining.pop()
    }

    player.tell(Text.of('A whisper: ' + message).gray().italic())
}

function endPortalEyesEnabled(server) {
    return server.persistentData.getBoolean(END_PORTAL_EYES_ENABLED_KEY)
}

BlockEvents.rightClicked('minecraft:end_portal_frame', event => {
    if (String(event.level.dimension) !== 'minecraft:overworld') return
    if (event.item.id !== 'minecraft:ender_eye') return
    if (endPortalEyesEnabled(event.server)) return

    // Cancel before EnderEyeItem.useOn can insert or consume the Eye.
    // In MC 1.21.1, EnderEyeItem.use also returns PASS when aimed at a
    // portal frame, so cancellation cannot fall through to throwing an Eye.
    // Keep the frame intact (including any eye already present).
    try {
        whisperEndPortal(event.player)
    } catch (error) {
        console.error('End portal whisper failed: ' + error)
    } finally {
        // KubeJS cancel() exits the handler; always run it, even if a whisper fails.
        event.cancel()
    }
})

ServerEvents.commandRegistry(event => {
    const commands = event.commands

    function report(source) {
        const enabled = endPortalEyesEnabled(source.getServer())
        source.sendSuccess(Text.of('Overworld Eye of Ender insertion: ' + (enabled ? 'enabled' : 'disabled') + '.'), false)
        return 1
    }

    function setEnabled(source, enabled) {
        source.getServer().persistentData.putBoolean(END_PORTAL_EYES_ENABLED_KEY, enabled)
        return report(source)
    }

    event.register(commands.literal('endportals')
        .requires(source => source.hasPermission(2))
        .executes(context => report(context.getSource()))
        .then(commands.literal('status')
            .executes(context => report(context.getSource())))
        .then(commands.literal('on')
            .executes(context => setEnabled(context.getSource(), true)))
        .then(commands.literal('off')
            .executes(context => setEnabled(context.getSource(), false))))
})
