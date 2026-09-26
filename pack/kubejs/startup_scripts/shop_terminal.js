// Decorative copy of Create Numismatics 1.1.0's bank terminal.
// A full game restart is required after adding or changing this registration.
StartupEvents.registry('block', event => {
  const facing = Java.loadClass('net.minecraft.world.level.block.state.properties.BlockStateProperties').HORIZONTAL_FACING

  // Cardinal blocks place opposite the player's horizontal direction and rotate
  // the north-oriented boxes below to match the facing state.
  event.create('qualitynotassured:shop_terminal', 'cardinal')
    .displayName('Shop Terminal')
    .parentModel('qualitynotassured:block/shop_terminal')
    // Keep the cardinal builder's generated item-model texture slots valid too.
    .texture('qualitynotassured:block/shop_terminal/shop_terminal_drum')
    .texture(['front'], 'qualitynotassured:block/shop_terminal/shop_terminal_front')
    .soundType('metal')
    // Bedrock-like mining hardness and blast resistance; Creative can remove it.
    .unbreakable()
    .resistance(3600000.0)
    .opaque(false)
    .fullBlock(false)
    .defaultState(state => state.set(facing, 'north'))
    .rotateState(state => state.setValue(facing, state.rotate(state.getValue(facing))))
    .mirrorState(state => state.setValue(facing, state.mirror(state.getValue(facing))))
    // Exact NumismaticsShapes.BANK_TERMINAL outline/collision boxes (0-16).
    .box(0, 0, 0, 16, 16, 8)
    .box(0, 0, 8, 16, 8, 16)
    .box(1, 8, 8, 15, 15, 15)
})
