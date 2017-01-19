const Menu = require('../Menu')

const Levelmap = require('../Levelmap')
const LayerMenu = require('./LayerMenu')
const WorldResizeMenu = require('./WorldResizeMenu')
const DoorMenu = require('./DoorMenu')

const fsp = require('fs-promise')

module.exports = class LevelMenu extends Menu {
  constructor(levelmap) {
    super(levelmap.game, [
      {label: 'Edit World..', action: () => {
        levelmap.game.setDialog(null)
        levelmap.editorMode = Levelmap.EDITOR_MODE_WORLD
      }},
      {label: 'Edit General Map Data..', action: () => this.generalMenu()},
      {label: 'Edit Layers..', action: () => this.layerMenu()},
      {label: 'Edit Doors..', action: () => this.doorMenu()},
      {label: 'Edit Doormap..', action: () => {
        levelmap.game.setDialog(null)
        levelmap.editorMode = Levelmap.EDITOR_MODE_DOORMAP
      }},
      {label: 'Resize Map..', action: () => this.resizeMenu()},
      {label: 'Save Map', action: () => this.save()}
    ])

    this.levelmap = levelmap
  }

  resizeMenu() {
    const { levelmap } = this

    const menu = new WorldResizeMenu(this.levelmap)
    this.initSubmenu(menu)
  }

  layerMenu() {
    const menu = new LayerMenu(this.levelmap)
    this.initSubmenu(menu)
  }

  doorMenu() {
    const menu = new DoorMenu(this.levelmap)
    this.initSubmenu(menu)
  }

  generalMenu() {
    // I'm actually hiding the fact that you can't really reference 'this' in
    // a getter method, since then 'this' refers to the object and not the
    // lexical this (i.e. the 'this' in the scope of this comment).
    const { levelmap } = this

    const defaultSpawnPosItem = {
      get label() {
        const sp = levelmap.defaultSpawnPos
        return `${sp[0]}, ${sp[1]} on layer ${sp[2]}`
      },

      action: () => {
        levelmap.game.setDialog(null)
        levelmap.pickTile().then(tile => {
          if (tile) {
            levelmap.defaultSpawnPos = [tile.x, tile.y, tile.layer]
          }

          levelmap.game.setDialog(menu)
        })
      }
    }

    const menu = new Menu(levelmap.game, [
      {label: 'File path:', selectable: false},
      {label: levelmap.filePath, action: () => {
        levelmap.game.revealPath(levelmap.filePath)
      }, selectable: (process.platform === 'darwin')},
      {label: '', selectable: false},

      {label: 'Default spawn pos:', selectable: false},
      defaultSpawnPosItem,
      {label: '', selectable: false},

      {label: 'Back', action: () => levelmap.game.setDialog(this)}
    ])

    this.initSubmenu(menu)
  }

  initSubmenu(menu) {
    // Aliases ftw?
    menu.on('confirmed', () => closeMenu())
    menu.on('canceled', () => closeMenu())
    menu.on('closed', () => closeMenu())
    const closeMenu = this.levelmap.game.setDialog(menu)
  }

  save() {
    game.saveLevelmap()
      .then(() => {
        console.log('Saved.')
      })
      .catch(err => {
        console.error('Failed to save!', err)
      })
  }
}
