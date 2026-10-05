// /endportals on|off|status (operator permission level 2).
// Controls the global override for Eye of Ender insertion in the Overworld.
// With the override off (the default), players need Save The Empire to insert Eyes.
// The override is saved per world; individual access uses advancement progress.
// Reload with /reload.
const END_PORTAL_EYES_ENABLED_KEY = 'cqna:end_portal_eyes_enabled'
const END_PORTAL_UNLOCK_ADVANCEMENT = 'armamentarium:save_the_empire'

// UNLOCK WHISPER: sent when a player earns Save The Empire, outside the random list.
const END_PORTAL_UNLOCK_WHISPER = 'Your worth is known. The End awaits.'

// FIXED OPENING WHISPER: always first, after a player switch, and after a full cycle.
const END_PORTAL_FIRST_WHISPER = "Only a king's blade may unseal the End."

// RANDOM MESSAGES: each plays once per shuffled cycle.
// Strings get "A whisper: "; use { observation: '...' } for unprefixed narration.
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
    { observation: 'For a moment, the Eye looks back.' },
    { observation: 'You feel the weight of all the earth above you.' },
    { observation: 'Something on the other side seems very far away.' },
    { observation: 'The stone beneath your feet feels older than the halls around it.' },
    { observation: 'For a heartbeat, you remember a kingdom you have never seen.' },
    { observation: 'The silence feels less like refusal than expectation.' },
    { observation: 'You hear steel being drawn somewhere impossibly far away.' },
    { observation: 'Somewhere above, the world continues without you.' }
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

    const text = typeof message === 'string' ? 'A whisper: ' + message : message.observation
    player.tell(Text.of(text).gray().italic())
}

function endPortalEyesEnabled(server) {
    return server.persistentData.getBoolean(END_PORTAL_EYES_ENABLED_KEY)
}

PlayerEvents.advancement(END_PORTAL_UNLOCK_ADVANCEMENT, event => {
    event.player.tell(Text.of('A whisper: ' + END_PORTAL_UNLOCK_WHISPER).gray().italic())
})

BlockEvents.rightClicked('minecraft:end_portal_frame', event => {
    if (String(event.level.dimension) !== 'minecraft:overworld') return
    if (event.item.id !== 'minecraft:ender_eye') return
    if (endPortalEyesEnabled(event.server)) return
    if (event.player.isAdvancementDone(END_PORTAL_UNLOCK_ADVANCEMENT)) return

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
        source.sendSuccess(Text.of('Overworld Eye of Ender insertion: ' + (enabled
            ? 'enabled for everyone (global override on).'
            : 'requires Save The Empire (global override off).')), false)
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
