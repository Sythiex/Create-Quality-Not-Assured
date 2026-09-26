// QNA exploration income. Configuration reloads with /reload.
// Only exact, reviewed container tables are targeted; ordinary loot is untouched.
const QNAChestCoin = Java.loadClass('dev.ithundxr.createnumismatics.content.backend.Coin')
const QNAChestRegistries = Java.loadClass('net.minecraft.core.registries.Registries')
const QNAChestResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
const QNAChestResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
const QNAChestLootTable = Java.loadClass('net.minecraft.world.level.storage.loot.LootTable')
const QNAChestItems = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

const qnaChestMoney = {
    rules: [],
    registered: 0,

    // Rates include travel/search/combat divided by all rewarded containers.
    rewardBounds: function(difficulty, minutesPerChest, hourlyTargets) {
        if (typeof difficulty !== 'number' || Math.floor(difficulty) !== difficulty || difficulty < 1 || difficulty > 5) {
            throw new Error('Chest money difficulty must be an integer from 1 to 5')
        }
        if (typeof minutesPerChest !== 'number' || !isFinite(minutesPerChest) || minutesPerChest < 1) {
            throw new Error('Chest money minutesPerChest must be finite and at least 1')
        }
        const hourly = hourlyTargets[String(difficulty)]
        if (typeof hourly !== 'number' || !isFinite(hourly) || hourly <= 0) {
            throw new Error('Chest money hourly target must be positive and finite')
        }
        const mean = hourly * minutesPerChest / 60
        const min = Math.ceil(mean * 0.5)
        const max = Math.floor(mean * 1.5)
        // Bound allocation as well as Java's signed-int RNG/conversion inputs.
        if (min < 1 || max < min || max > 1000000) {
            throw new Error('Chest money reward must fit between 1 and 1,000,000 Spurs')
        }
        return { min: min, max: max, mean: (min + max) / 2 }
    },

    compile: function(config) {
        if (!config || config.version !== 1 || !Array.isArray(config.tables) || !config.hourlyTargets) {
            throw new Error('Invalid chest_money.json: expected version 1, hourlyTargets and tables')
        }
        const seen = {}
        return config.tables.map(row => {
            // Some mods (including MSS) put chest tables at the namespace root.
            if (typeof row.id !== 'string' || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(row.id)) {
                throw new Error('Chest money requires an exact namespace:path table ID: ' + row.id)
            }
            if (seen[row.id]) throw new Error('Duplicate chest money table: ' + row.id)
            seen[row.id] = true
            return { id: row.id, bounds: this.rewardBounds(row.difficulty, row.minutesPerChest, config.hourlyTargets) }
        })
    },

    sample: function(bounds, random) {
        return bounds.min + random.nextInt(bounds.max - bounds.min + 1)
    },

    coinStacks: function(spurs) {
        if (typeof spurs !== 'number' || Math.floor(spurs) !== spurs || spurs < 1 || spurs > 1000000) {
            throw new Error('Invalid chest money total: ' + spurs)
        }
        const stacks = []
        // Use function-scoped mutable locals across Rhino's Java callback boundary.
        QNAChestCoin.getCoinsFromSpurAmount(spurs).forEach(function(entry) {
            const coin = entry.getKey()
            var remainingCoins = Number(entry.getValue())
            const maxStack = Number(coin.asStack().getMaxStackSize())
            while (remainingCoins > 0) {
                var stackSize = Math.min(remainingCoins, maxStack)
                stacks.push(coin.asStack(stackSize))
                remainingCoins -= stackSize
            }
        })
        return stacks
    },

    // Additive: sample once, then split that total into actual Numismatics coins.
    addReward: function(bounds, context, loot) {
        const stacks = this.coinStacks(this.sample(bounds, context.getRandom()))
        stacks.forEach(stack => loot.addItem(stack))
    },

    selfTest: function(server) {
        if (!this.registered || this.registered !== this.rules.length) throw new Error('Modifiers did not register')
        // This native conversion returns every denomination, including zero-count entries.
        // Use the Java List callback already used by coinStacks, and compare registry IDs,
        // avoiding Java enum-array indexing and identity of KubeJS item wrappers.
        const valuesById = {}
        QNAChestCoin.getCoinsFromSpurAmount(1).forEach(function(entry) {
            const coin = entry.getKey()
            const id = String(QNAChestItems.ITEM.getKey(coin.asStack().getItem()))
            const value = Number(coin.value)
            if (id === 'minecraft:air' || !isFinite(value) || value <= 0 || valuesById[id] !== undefined) {
                throw new Error('Invalid currency denomination: ' + id + ' = ' + value)
            }
            valuesById[id] = value
        })
        if (Object.keys(valuesById).length !== 6) throw new Error('Expected six currency denominations')
        this.rules.forEach(rule => {
            const key = QNAChestResourceKey.create(QNAChestRegistries.LOOT_TABLE, QNAChestResourceLocation.parse(rule.id))
            // Rhino unwraps Java objects for ===; inherited Object.equals is not exposed.
            if (server.reloadableRegistries().getLootTable(key) === QNAChestLootTable.EMPTY) {
                throw new Error('Missing loaded loot table: ' + rule.id)
            }
            const checkTotals = [rule.bounds.min, rule.bounds.max]
            checkTotals.forEach(total => {
                var value = 0
                this.coinStacks(total).forEach(stack => {
                    if (stack.isEmpty() || stack.getCount() > stack.getMaxStackSize()) throw new Error('Invalid coin stack')
                    const id = String(QNAChestItems.ITEM.getKey(stack.getItem()))
                    const unitValue = valuesById[id]
                    if (unitValue === undefined) throw new Error('Unknown currency item: ' + id)
                    value += unitValue * Number(stack.getCount())
                })
                if (value !== total) throw new Error('Coin value mismatch: ' + value + ' vs ' + total)
            })
        })
        return this.rules.length
    }
}

LootJS.modifiers(event => {
    // Compile everything before registering anything; malformed edits cannot half-register a catalog.
    const config = JSON.parse(String(JsonIO.readString('kubejs/config/chest_money.json')))
    qnaChestMoney.rules = qnaChestMoney.compile(config)
    qnaChestMoney.registered = 0
    qnaChestMoney.rules.forEach(rule => {
        event.addTableModifier(rule.id).customAction((context, loot) => {
            qnaChestMoney.addReward(rule.bounds, context, loot)
        })
        qnaChestMoney.registered++
    })
    console.info('[QNA Chest Money] Registered ' + qnaChestMoney.registered + ' exact table rewards')
})

ServerEvents.commandRegistry(event => {
    event.register(event.commands.literal('chestmoneytest')
        .requires(source => source.hasPermission(2))
        .executes(context => {
            const source = context.getSource()
            try {
                var testedTableCount = qnaChestMoney.selfTest(source.getServer())
                source.sendSuccess(Text.of('Chest money self-test passed: ' + testedTableCount + ' tables; native coin values verified. Container/Lootr checks remain manual.'), false)
                return 1
            } catch (error) {
                source.sendFailure(Text.of('Chest money self-test failed: ' + error))
                return 0
            }
        }))
})
