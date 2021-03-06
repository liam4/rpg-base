module.exports = class KeyListener {
  // A convenient class to get pressed keys.

  constructor(el) {
    this.keys = {}
    this.justPressedKeys = {}

    this.initEventListeners(el)
  }

  initEventListeners(el) {
    el.addEventListener('keydown', evt => {
      this.keys[evt.keyCode] = true
      this.justPressedKeys[evt.keyCode] = true
    })

    el.addEventListener('keyup', evt => {
      this.keys[evt.keyCode] = false
    })
  }

  isPressed(key) {
    return !!this.keys[key]
  }

  isJustPressed(key) {
    return !!this.justPressedKeys[key]
  }

  clearJustPressed() {
    // Call this every render, after everything that might use isJustPressed is
    // done.

    this.justPressedKeys = {}
  }

  isActionPressed() {
    // Returns whether or not an "action" key is pressed. Use this for
    // consistency across user interfaces. Uses isJustPressed.

    return [32, 13].some(k => this.isJustPressed(k))
  }

  isHelpPressed() {
    return this.isJustPressed(112) || (this.isJustPressed(191) && this.isPressed(16))
  }
}
