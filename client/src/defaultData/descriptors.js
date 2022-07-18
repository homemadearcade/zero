import { spriteSheetIds } from "./spritesheets";
import axios from "axios";

export async function getSpritesByDescriptor() {
  const global = getDescriptors()

  const spritesheetsRequested = Object.keys({...spriteSheetIds}).filter((name) => {
    if(spriteSheetIds[name]) return true
  })

  const options = {
    params: {
      spriteSheetIds: spritesheetsRequested
    }
  };

  const response = await axios.get('/spriteSheets', options)

  const spriteSheets = response.data.spriteSheets
  global.spriteSheets = spriteSheets
  window.spriteSheets = spriteSheets
  window.spriteSheetIds = spriteSheetIds

  global.textureIdsByDescriptor = {}
  global.missingComplexDescriptors = {}
  
  function generateTextureIdsByDescriptors() {
    global.textureIdsByDescriptor = {}
  
    global.spriteSheets.forEach((ss) => {
      ss.sprites.forEach((s, i) => {
        if(!s.descriptors) return
  
        let spriteMatchesComplex = false
        Object.keys(global.complexDescriptors).forEach((desc) => {
          const descriptor = global.complexDescriptors[desc]
          let failed = false
          Object.keys(descriptor.withDescriptors).forEach((withD) => {
            if(!s.descriptors[withD]) {
              failed = true
            }
          })
          // if(!failed) console.log(desc)
          if(failed) return
  
          spriteMatchesComplex = true
  
          if(!global.textureIdsByDescriptor[desc]) {
            global.textureIdsByDescriptor[desc] = []
          }
          global.textureIdsByDescriptor[desc].push({...s, author: ss.author})
        })
  
        // if it matches a complex descriptor, you can get it from there, easy
        if(spriteMatchesComplex) {
          // console.log(s)
          return
        }
  
        // if not add ALL of its tags to the map
        if(s.descriptors) {
          let toAdd = []
          let hasModifer = false
          let spriteAdditions = []
          Object.keys(s.descriptors).forEach((desc) => {
            if(!s.descriptors[desc]) return
  
            // mods should normally be used to create a complex version of a sprite, if a mod descriptor has reached this point it is missing a complex descriptor
            // later we generate a descriptor for it
            if(global.complexityModifiers[desc]) {
              if(!global.missingComplexDescriptors[desc]) {
                global.missingComplexDescriptors[desc] = []
              }
              global.missingComplexDescriptors[desc].push({...s, author: ss.author})
              hasModifer = true
              if(!global.complexityModifiers[desc].searchable) {
                return
              } else {
                if(!global.textureIdsByDescriptor[desc]) {
                  global.textureIdsByDescriptor[desc] = []
                }
                global.textureIdsByDescriptor[desc].push({...s, author: ss.author})
              }
            }
  
            // directional modfiers dont get a generated descriptor
            if(global.directionalModifiers[desc]) {
              hasModifer = true
              return
            }
  
            spriteAdditions.push({
              desc,
              sprite: {...s, author: ss.author}
            })
          })
  
          // if its not a modified sprite we can just add it to all of the categories it has listed
          if(!hasModifer) {
            spriteAdditions.forEach(({desc, sprite}) => {
              if(!global.textureIdsByDescriptor[desc]) {
                global.textureIdsByDescriptor[desc] = []
              }
              global.textureIdsByDescriptor[desc].push(sprite)
            })
          }
        }
      });
    })
  
    Object.keys(global.allDescriptors).forEach((desc) => {
      if(!global.allDescriptors[desc]) return
      if(global.allDescriptors[desc].children) {
        if(!global.textureIdsByDescriptor[desc]) {
          global.textureIdsByDescriptor[desc] = []
        }
        global.allDescriptors[desc].children.forEach((child) => {
          if(global.textureIdsByDescriptor[child]) {
            global.textureIdsByDescriptor[desc].push(...global.textureIdsByDescriptor[child])
          }
        })
      }
    })
  
    Object.keys(global.missingComplexDescriptors).forEach((modifier) => {
      if(modifier === 'Duplicate') return
      const sprites = global.missingComplexDescriptors[modifier]
  
      sprites.forEach((sprite) => {
        let nonModifier
        Object.keys(sprite.descriptors).forEach((desc) => {
          if(!sprite.descriptors[desc]) return
          if(global.allModifiers[desc]) return
  
          nonModifier = desc
        })
  
        if(!nonModifier) return
  
        let name = nonModifier + ` (${modifier})`
        if(!global.textureIdsByDescriptor[name]) {
          global.allDescriptors[name] = {
            withDescriptors: sprite.descriptors,
            dontShowAdminsInSpriteSheetEditor: true,
            generated: true,
          }
          global.textureIdsByDescriptor[name] = []
        }
        global.textureIdsByDescriptor[name].push(sprite)
      })
    })
  }

  generateTextureIdsByDescriptors()

  return global.textureIdsByDescriptor
}


// i might be missing school theme?
// Locker, Chalkboard, School Chair, Desk, Etc

export function getDescriptors() {
  const global = {}

  global.generalDescriptors = {
    'Scifi Theme': {},
    'Fantasy Theme': {},
    'Platformer View': {},
  }

  global.elementDescriptors = {
    Grass: {},
    Dirt: {},
    Snow: {},
    Ice: {},
    Sand: {},
    Stone: {},
    Metal: {},
    Wood: {},
    Glass: {},
    Gravel: {},
    Concrete: {},
    Brick: {},
    Mud: {},

    Cloth: {},
    Bone: {},
    Slime: {},

    Gem: {},
    Ore: {},

    Fire: {},
    Lava: {},
    Electricity: {},
  }

  global.waterElementDescriptors = {
    Water: {
      relatedTags: [
        'water'
      ]
    },
    'Water Element': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Bubbles', 'Waterfall', 'Whirlpool', 'Lily Pad'],
    },
    'Wave': {},
    'Lily Pad': {},
    'Bubbles': {},
    'Waterfall': {},
    'Whirlpool': {},
    'Coral': {},
    'Seaweed': {}
  }

  global.overworldMapDescriptors = {
    Mountain : {},
    Tree : {
      children: ['Dead Tree', 'Colored Tree', 'Forest'],
    },
    'Tree Stump': {},
    "Campfire": {},
    "Stone Structure": {},
    'Hill' : {},
    House : {
      children: ['Village'],
    },
    Castle : {},
    Cave : {},
    Building : {
      children: ['Castle', 'House', 'Church', 'Store', 'Village'],
    },
    Church : {},
    Store : {
      children: ['Weapon Store', 'Item Store']
    },
    'Weapon Store': {},
    'Item Store': {},
    'Castle Wall' : {},
    Tornado: {},
    Volcano: {},
    Lightning: {},
    Gazebo: {},
    Totem: {},
    Farm: {},
    Lake: {},
    Graveyard: {},
    Mine: {},
    Bridge: {},
    'Mountain Wall': {},
    Planet : {},
    Sun: {},
    Star: {},
    'Moon': {},
    'Earth': {},
  }

  global.buildingPartDescriptors = {
    'Building Wall': {},
    'Building Floor Tile': {},
    // 'Special Floor Tile': {
    //   children: []
    // },
    'Spaceship Wall': {},
    'Spaceship Floor': {},
    Block: {},
    Door: {},
    Archway: {},
    Entryway: {},
    Ladder: {},
    Stairs: {},
    Window: {},
    Pipe: {},
    Chimney: {},
    Column: {},
    'Roof Tile/Shillings': {},
  }

  global.outsideBuildingDescriptors = {
    Fence: {},
    Well: {},
    Plant: {
      children: ['Crop', 'Bush', 'Flower', 'Mushroom', 'Ivy', 'Grass Tuft'],
    },
    Hedge: {},
    'Venus Flytrap': {},
    Ivy: {},
    Cactus: {},
    Mushroom: {},
    Bush: {},
    Flower: {},
    Crop: {},
    'Grass Tufft': {},
    Sign: {},
    'Directional Sign': {},
    Grave: {},
    Gravestone: {},
    Skull: {},
    Skeleton: {},
    Coffin: {},
    Barrel: {},
    Crate: {},
    Pot: {},
    Cauldron: {},
    Box: {},
    Fountain: {},
    "Weather Vane": {},
  }

  global.insideBuildingDescriptors = {
    'Musical Instrument': {
      children: ['Harp', 'Guitar','Drum', 'Flute', 'Piano']
    },
    "Curtain": {},
    Harp: {},
    Guitar: {},
    Drum: {},
    Flute: {},
    Piano: {},
    Candle: {
      relatedSprites: ['Torch'],
    },
    Lantern: {},
    Altar: {},
    Appliance: {},
    Machine: {
      children: ['Computer', 'Engine', 'Generator'],
    },
    Computer: {},
    Furniture: {
      children: ['Chair', 'Desk', 'Table', 'Fireplace', 'Couch', 'Bookshelf', 'Stove', 'Oven'],
    },
    Rug: {},
    Desk: {},
    Bookshelf: {},
    Couch: {},
    Chair: {},
    Bench: {},
    Table: {},
    Bathtub: {},
    Lamp: {},
    Lightswitch: {},
    Jewelry: {
      children: ['Necklace', 'Ring', 'Chalice']
    },
    Chalice: {},
    Necklace: {},
    Ring: {},
    'Kitchen Utensil': {
      children: ['Fork', 'Knife', 'Spoon']
    },
    "Kitchen Ware": {},
    Fork: {},
    Knife: {},
    Spoon: {},
    Stove: {},
    Oven: {},
    Food: {
      children: ['Meat', 'Fruit', 'Vegetable', 'Drink']
    },
    Device: {
      children: ['Clock', 'Computer', 'Phone', 'Compass'],
    },
    Engine: {},
    Generator: {},
    Phone: {},
    Clock: {},
    Fireplace: {},
    Bed: {},
    Throne: {},
    Carpet: {},
    'Display Case': {},
    'Weapon/Armor Stand': {},
    'Liquid Tank': {},
    Tent: {},
  }

  global.otherDescriptors = {
    "Animal Trough": {},
    Symbol: {},
    Stick: {},
    Rock: {},
    Stalagmite: {},
    Gear: {},
    'Spider Web': {},
    'Sports Equipment': {},
    'Candy Cane': {},
    Manican: {},
    Mirror: {},
    'Bathroom Item': {
      children: ['Toilet', 'Sink'],
    },
    Horn: {},
    Tire: {},
    Vine: {},
    'Weight': {},
    'Alarm Light': {},
    'Security Camera': {},
    Toilet: {},
    Sink: {},
    'Jail Cell Bars': {},
    'Church Item': {
      children: ['Candlelabra','Candle', 'Altar'],
    },
    'Candelabra': {},
    'Stained Glass Window': {},
    Awning: {},
    Clothesline: {},
    'Food Stand': {},
    'Public Item': {
      children: ['Trash', 'Mailbox', 'Fire Hydrant'],
    },
    Trash: {},
    Mailbox: {},
    'Fire Hydrant': {},
    'User Interface': {
      children: ['Heart'],
    },
    'Genie Lamp': {},
    'Crystal Ball': {},
    'Magnifying Glass': {},
    'Glasses': {},
    Parasol: {},
    'Toxic Waste': {},
    Flag: {},
    Banner: {},
    'Medal': {},
    Feather: {},
    Syringe: {},
    'Gas Can': {},
    // Undescribed: {},
    Circle: {},
    Triangle: {},
    Square: {},
    Poop: {},
    "Tunnel Entrance": {},
    Stardust: {},
    Portal: {},
    Galaxy: {},
    Marionette: {},
    Dumpster: {},
    Dollar: {},
    Microscrope: {},
    Vial: {},
    Mask: {},
    Locker: {},
    Microphone: {},
    Log: {},
  }

  global.weaponDescriptors = {
    // Weapon: {
    //   dontShowAdminsInSpriteSheetEditor: true,
    //   children: ['Waraxe', 'Staff', 'Mace', 'Gun', 'Sword','Bow', 'Crossbow', 'Laser', 'Spear', 'Halbierd', 'Scythe', 'Bomb', 'Scimitar', 'Rapier'],
    // },
    'Melee Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Warhammer', 'Club', 'Waraxe','Mace', 'Sword','Spear', 'Whip', 'Scimitar', 'Rapier', 'Scythe', 'Halbierd', 'Dagger'],
    },
    'Ranged Weapon': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Throwing Stars','Staff','Gun','Bow','Crossbow', 'Laser','Spear', 'Wand', 'Sling', 'Boomerang'],
    },
    'Throwing Stars': {},
    Warhammer: {},
    Club: {},
    Waraxe: {},
    Crossbow: {},
    Scythe: {},
    Halbierd: {},
    Dagger: {},
    Axe: {},
    Scimitar: {},
    Rapier: {},
    Boomerang: {},
    Staff: {},
    Wand: {},
    Mace: {},
    Lance: {},
    Gun: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Cannon', 'Shotgun', 'Pistol', 'Rocket Launcher', 'Rifle', 'Machine Gun'],
    },
    Sling: {},
    Cannon: {},
    Shotgun: {},
    Pistol: {},
    'Rocket Launcher': {},
    'Rifle': {},
    'Machine Gun':{},
    Whip: {},
    Sword: {},
    Bow: {},
    Laser: {},
    Spear: {},
    Bomb: {},
    'Grenade': {},
    'Dynamite': {},
    Projectile: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Magic', 'Bullet', 'Arrow', 'Spear', 'Cannonball'],
    },
    'Magic Ball': {},
    Bullet: {},
    Cannonball: {},
    Arrow: {},
    'Quiver': {},
  }

  global.toolDescriptors = {
    Tool:  {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Axe', 'Pickaxe', 'Torch', 'Device', 'Shovel', 'Hammer', "Shears"],
    },
    Shears: {},
    'Mortar and Pestle': {},
    Compass: {},
    Hammer: {},
    Anvil: {},
    Device: global.insideBuildingDescriptors.Device,
    Pickaxe: {},
    Torch: {},
    Shovel: {},
    Wearable: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pants', 'Shirt', 'Cape', 'Robe', 'Hood', 'Shield', 'Armor', 'Helment', 'Clothes', 'Hat', 'Gloves', 'Boots'],
    },
    Pants: {},
    Shirt: {},
    'Crown': {},
    Helmet: {},
    'Plate Leggings': {},
    'Platebody': {},
    'Chainmail': {},
    Armor: {
      children: ['Armor', 'Gloves', 'Boots', 'Shield', 'Helment', 'Plate Leggings', 'Platebody', 'Chainmail']
    },
    Clothes: {},
    Gloves: {},
    Boots: {},
    Robe: {},
    Hood: {},
    Cape: {},
    Shield: {},
    Hat: {},
  }

  global.itemDescriptors = {
    Key: {
      children: global.insideBuildingDescriptors.Key,
    },
    Bucket: {},
    Bottle: {},
    Potion: {},
    Bag: {},
    Heart: {},
    'First Aid Kit': {},
    Food: global.insideBuildingDescriptors.Food,
    Candy: {},
    Soda: {},
    Snack: {},
    Meat: {},
    Fruit: {},
    Vegetable: {},
    Drink: {},
    Bread: {},
    Bullet: global.toolDescriptors.Bullet,
    'Expensive Item': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Gold', 'Jewelry', 'Coin'],
    },
    Gold: {},
    Coin: {},
    Literature: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Book', 'Page', 'Scroll', 'Disk'],
    },
    Book: {},
    Page: {},
    Scroll: {},
    Disk: {
      children: []
    }
  }

  global.dungeonItemDescriptors = {
    Door: global.buildingPartDescriptors.Door,
    Ladder: global.buildingPartDescriptors.Ladder,
    Stairs: global.buildingPartDescriptors.Stairs,
    Key: global.itemDescriptors.Key,
    Keyhole: {},
    'Trap Door': {},
    Chest: {},
    Block: {},
    Icicle: {},
    Spring: {},
    Lever: {},
    Switch: {},
    'Upward Chomper': {},
    'Spikes': {},
    'Bear Trap': {},
    'Hole': {},
    'Switch': {},
    'Magic Floor Tile': {},
    'Arrow Tile': {},
    'Warp Tile': {},
    'Button Tile': {},
    Rope: {},
    Tentacles: {},
  }

  global.transportDescriptors = {
    Vehicle: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Car', 'Boat', 'Spaceship', 'Rail Car'],
    },
    Boat: {},
    Car: {},
    Motorcycle: {},
    Tank: {
      children: []
    },
    Spaceship: {},
    // Plane: {
    //   children: []
    // },
    Rail: {},
    'Rail Car': {},
    Street: {},
    'Traffic Item': {
      children: ['Traffic Cone', 'Traffic Light', 'Traffic Barricade']
    },
    'Traffic Cone': {},
    'Traffic Light': {},
    'Traffic Barricade': {},
    'Spaceship Wall': {},
  }

  global.humanDescriptors = {
    Human: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Pirate', 'Barbarian','Baby','Astronaut','Soldier','Space','Wizard','King','Queen','Archer','Warrior','Rogue','Angel','Thief','Ninja','Musician','Engineer','Athlete','Priest','Nun','Cop','Citizen','Villager','Detective','Knight',
      ],
    },
    Dancer: {},
    Baby: {},
    Astronaut: {},
    Soldier: {},
    Space: {},
    Wizard: {},
    King: {},
    Queen: {},
    Archer: {},
    Warrior: {},
    'Rogue': {
      children: ['Thief', 'Ninja']
    },
    'Angel': {},
    'Thief': {},
    'Ninja': {},
    'Musician': {},
    Engineer: {},
    Athlete: {},
    Priest: {},
    Nun: {},
    Cop: {},
    'Citizen': {},
    'Villager': {},
    Detective: {},
    Knight: {},
    Pirate: {},
    Barbarian: {},
  }

  global.animalDescriptors = {
    // Animal: {
    //   dontShowAdminsInSpriteSheetEditor: true,
    //   children: ['Cat', 'Bird', 'Dog', 'Mouse', 'Chicken', 'Bug', 'Fish', 'Reptile', 'Deer', 'Bear'],
    // },
    /// sound oriented
    Bird: {
      children: ['Vulture', 'Flamingo', 'Swan', 'Goose', 'Chicken', 'Crow', 'Bat', 'Duck', 'Ostrich', 'Owl', 'Penguin', 'Seagull',],
    },


    'Farm Animal': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: [ 'Sheep','Donkey', 'Horse', 'Chicken', 'Cow', 'Goat', 'Bull', 'Pig', 'Yak']
    },
    'Saddle Animal': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: [ 'Donkey', 'Horse', 'Camel']
    },
    'Lawn Animal': {
      dontShowAdminsInSpriteSheetEditor: true,
      children: [ 'Bunny', 'Mouse', 'Racoon', 'Squirrel', 'Frog', 'Mole']
    },
    Reptile: {
      children: [
        'Alligator',
        'Cobra',
        'Crocodile',
        'Frog',
        'Turtle',
        'Snake'
      ]
    },

    // fish
    Fish: {
      children: ['Starfish', 'Piranha', 'Anglerfish','Mola Mola', 'Stingray', 'Anglerfish', 'Shark', 'Eel', 'Jellyfish', 'Crayfish', 'Whale', 'Squid', 'Seahorse']
    },
    "Piranha": {},

    'Anglerfish': {},
    'Mola Mola': {},
    Shark: {},
    'Shark Fin': {},
    Eel: {},
    Jellyfish: {},
    Crayfish: {},
    Whale: {},
    Squid: {},
    Seahorse: {},
    Stingray: {},
    Starfish: {},
    // other
    Rhino: {},
    'Musk Ox': {},
    Hippo: {},
    Bison: {},
    Monkey: {},
    Panda: {},
    Elephant: {},
    Gorilla: {},
    Hog: {},



    // pets
    Cat: {},
    Dog: {},
    Ferret: {},
    Chinchilla: {},

    // predator
    Cougar: {},
    Tiger: {},
    Lion: {},
    Wolf: {},

    // Woodland
    Deer: {},
    Bear: {},
    Badger: {},
    Fox: {},
    Boar: {},
    Porcupine: {},
    Snail: {},
    Beaver: {},
    Reindeer: {},
    Beehive: {},

    // Bugs
    Bug: {
      children: [
        'Bee',
        'Butterfly',
        'Ant',
        'Scorpion',
        'Fly',
        'Ladybug',
        'Spier',
        'Leech',
        'Beetle',
        'Grasshopper',
        'Worm',
        'Praying Mantis'
      ]
    },
    Ant: {},
    Bee: {},
    Butterfly: {},
    Scorpion: {},
    Fly: {},
    Ladybug: {},
    Spider: {},
    Leech: {},
    Beetle: {},
    Grasshopper: {},
    Worm: {},
    "Praying Mantis": {},

    'Mythical Beast': {
      children: ['Manticore', 'Cockatrice', 'Cyclops', 'Unicorn', 'Dragon', 'Mermaid', 'Vampire', 'Mermaid', 'Demon', 'Golem', 'Griffin', 'Ent', 'Hag', 'Harpie', 'Siren', 'Genie', 'Minotaur', 'Troll', 'Centaur'],
    },

    /// mythical
    Unicorn: {},
    Dragon: {},
    Demon: {},
    Ent: {},
    Mermaid: {},
    'Genie': {},
    'Minotaur': {},
    Troll: {},
    Centaur: {},
    Cyclops: {},
    Manticore: {},
    Cockatrice: {},
    'Werewolf': {},
    'Frogman': {},
    'Sabretooth Tiger': {},
    "Will o' The Wisp": {},
    "Lizard Person": {},
    "Chupacabra": {},

  }

  global.reptileDescriptors = {
    Alligator: {},
    Cobra: {},
    Crocodile: {},
    Frog: {},
    Turtle: {},
    Snake: {},
  }

  global.lawnAnimalDescriptors = {
    Bunny: {},
    Mouse: {},
    Racoon: {},
    Squirrel: {},
    Mole: {},
    Frog: global.reptileDescriptors.Frog
  }

  global.farmAnimalDescriptors = {
    'Donkey': {},
    'Horse': {},
    'Chicken': {},
    'Cow': {},
    'Goat': {},
    'Bull': {},
    'Pig': {},
    'Yak': {},
    'Turkey': {},
    Sheep: {},
  }

  global.birdDescriptors = {
    Chicken: global.farmAnimalDescriptors.Chicken,
    Crow: {},
    Bat: {},
    Duck: {},
    Ostrich:{},
    Owl: {},
    Penguin: {},
    Seagull: {},
    Egg: {},
    Goose: {},
    Flamingo: {},
    Swan: {},
    Vulture: {},
  }

  global.monsterDescriptors = {
    Monster: {
      dontShowAdminsInSpriteSheetEditor: true,
      children: ['Mummy', 'ElementalMonster', 'Evil Eyeball', 'Skeleton Monster', 'Slime Monster','Bug', 'Ghost', 'Goblin', 'Undead', 'Zombie', 'Machine', 'Mythical Beast', ...global.animalDescriptors['Mythical Beast'].children],
    },
    "Hooded Ghost": {},
    // Pest: {},
    'Skeleton Monster': {},
    Mummy: {},
    'Slime Monster': {},
    Alien: {},
    Robot: {},
    Golem: {},
    Vampire: {},
    Hag: {},
    Harpie: {},
    'Elemental Monster': {},
    'Possessed Object': {},
    'Evil Eyeball': {
      withDescriptors: {
        Eyeball: true,
        Evil: true,
      }
    }
  }

  global.edgeModifiers = {
    'Top': {},
    'Right': {},
    'Left': {},
    'Bottom': {},
    'Center': {},
    'TopLeft': {},
    'TopRight': {},
    'BottomLeft': {},
    'BottomRight': {},
  }

  global.facingModifiers = {
    'FacingUp': {},
    'FacingRight': {},
    'FacingLeft': {},
    'FacingDown': {},
    'Going Up': {},
    'Going Down': {}
  }

  global.pathModifiers= {
    'Up-Right': {},
    'Up-Down': {},
    'Up-Left': {},
    'Down-Right': {},
    'Down-Left': {},
    'Right-Left': {},
    'Up-Down-Right-Left': {},
    'Up-Right-Left': {},
    'Down-Right-Left': {},
    'Up-Down-Right': {},
    'Up-Down-Left': {},
    'TopRight-BottomLeft': {},
    'TopLeft-BottomRight': {},
  }

  global.modifierDescriptors = {
    'Many': {},
    'Empty': {},
    'Broken': {},
    'Turned On': {},
    'Messy': {},
    'Open': {},
    'Closed': {},
    'Boarded Up': {},
    'With Window': {},
    'With Blood': {},
    'Scaley': {},
    'Carpeted': {},
    'Potted': {},
    'Decorated': {},
    'Powered Up': {},
    'Elevated': {},
    'Checkered': {},
    'Alt1': {},
    'Alt2': {},
    'Duplicate': {},
    "Platform": {},
    "Locked": {},
    Barred: {},
    Radioactive: {},
    Small: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
    },
    Large: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,
    },
  }

  global.livingCreatureModifiers = {
    'With Saddle': {},
    'Holding Weapon': {},
    Ghost: {
      searchable: true,
    },
    'Elf': {
      searchable: true,
    },
    'Goblin': {
      searchable: true,
    },
    'Two Headed': {},
    'Mounted': {},
    'Mythical': {},
    'Magical': {},
    'Child': {},
    'Male': {},
    "Female": {},
    'Horned': {},
    'Evil': {},
    'Dead': {},
    'With Face': {},
    Zombie: {
      searchable: true,
    },
    Statue: {
      searchable: true,
    },
  }

  global.elementalModifiers = {
    'Mossy': {},
    'Ivied': {},
    'Frozen': {},
    'With Snow': {},
    'With Fruit': {},
    'Pine': {},
    'Willow': {},
    'Cherry Blossom': {},
    'Muddy': {},
    'Tropical': {},
    'On Fire': {},
    'In Water': {},
    'Waters Edge': {},
    'In Air': {},
    'Lightning Charged': {},
  }

  global.audioModifierDescriptor = {
    Small: global.modifierDescriptors.Small,
    Large: global.modifierDescriptors.Large,
    Cute: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Mean: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Evil: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Mad: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Happy: {
      audioRelated: true,
      dontShowAdminsInSpriteSheetEditor: true,},
    Random: {
      dontShowAdminsInSpriteSheetEditor: true,},
  }

  global.colorModifiers = {
    'Dark': {},
    'Light': {},
    'Brown': {},
    'Orange': {},
    'GreenBlue': {},
    'Yellow': {},
    'Green': {},
    'Grey': {},
    'Dark Grey': {},
    'Blue': {},
    'Red': {},
    'Rainbow': {},
    'Purple': {},
    'White': {},
    'Pink': {},
    'Flame': {},
    'Christmas': {}
  }

  global.complexDescriptors = {
    Forest : {
      withDescriptors: {
        Tree: true,
        Many: true
      }
    },
    'Mountain Range' : {
      withDescriptors: {
        Mountain: true,
        Many: true
      }
    },
    'Mountain (Snow)' : {
      withDescriptors: {
        Mountain: true,
        'With Snow': true
      }
    },
    'House (Snow)' : {
      withDescriptors: {
        House: true,
        'With Snow': true
      }
    },
    Village: {
      withDescriptors: {
        House: true,
        Many: true
      }
    },
    'Tree (Pine)' : {
      withDescriptors: {
        Tree: true,
        Pine: true
      }
    },
    'Tree (Cherry Blossom)' : {
      withDescriptors: {
        Tree: true,
        Pink: true
      }
    },
    'Tree (Tropical)' : {
      withDescriptors: {
        Tree: true,
        Tropical: true
      }
    },
    'Tree (Fruit)' : {
      withDescriptors: {
        Tree: true,
        'With Fruit': true
      }
    },
    'Tree (Dead)' : {
      withDescriptors: {
        Tree: true,
        Dead: true
      }
    },
    'Tree (Snow)' : {
      withDescriptors: {
        Tree: true,
        'With Snow': true
      }
    },
    // 'Tree (Frozen)' : {
    //   withDescriptors: {
    //     Tree: true,
    //     Blue: true
    //   }
    // },
    // 'Tree (Hot)' : {
    //   withDescriptors: {
    //     Tree: true,
    //     Red: true
    //   }
    // },
    'Tree (Dark)' : {
      withDescriptors: {
        Tree: true,
        Dark: true
      }
    },
    'Grass (Dark)': {
      withDescriptors: {
        Grass: true,
        Dark: true
      }
    },
    'Water (Deep)': {
      withDescriptors: {
        Water: true,
        Dark: true
      }
    },
    'Sand Dune' : {
      withDescriptors: {
        Mountain: true,
        Sand: true
      }
    },
    'Coin Stack' : {
      withDescriptors: {
        Coin: true,
        Many: true
      }
    },
    'Chest (Open)' : {
      withDescriptors: {
        Chest: true,
        Open: true
      }
    },
    'Door (Open)' : {
      withDescriptors: {
        Door: true,
        Open: true
      }
    },
    'Barrel (Open)' : {
      withDescriptors: {
        Barrel: true,
        Open: true
      }
    },
    'Lumber' : {
      withDescriptors: {
        Wood: true,
        Many: true
      }
    },
    'Carpeted Stairs' : {
      withDescriptors: {
        Stairs: true,
        Carpeted: true
      }
    },
    'Carpeted Tile' : {
      withDescriptors: {
        'Building Floor Tile': true,
        Carpeted: true
      }
    },
    'Torch (On)': {
      withDescriptors: {
        Torch: true,
        'Turned On': true
      }
    },
    'Lantern (On)': {
      withDescriptors: {
        Lantern: true,
        'Turned On': true
      }
    },
    'Evil Eyeball': global.monsterDescriptors['Evil Eyeball']
  }

  global.goreDescriptors = {
    'Body Part': {
      children: ['Eyeball', 'Arm', 'Leg', 'Torso', 'Head']
    },
    Eyeball: {},
    Arm: {},
    Leg: {},
    Torso: {},
    Head: {}
  }

  // basically its just that these ones are ignored from sprite slection and randomization right now
  global.directionalModifiers = {
    ...global.pathModifiers,
    // ...global.facingModifiers,
    ...global.edgeModifiers,
  }

  // this ones will auto group if there is no matching complexity descriptor
  global.complexityModifiers = {
    // ...global.colorModifiers,
    ...global.audioModifierDescriptors,
    ...global.modifierDescriptors,
    ...global.elementalModifiers,
    ...global.livingCreatureModifiers,
    ...global.facingModifiers,
    ...global.colorModifiers,
    // ...global.directionalModifiers,
  }

  global.allModifiers = {
    ...global.colorModifiers,
    ...global.complexityModifiers,
    ...global.directionalModifiers,
  }

  global.allDescriptors = {
    ...global.generalDescriptors,
    ...global.elementDescriptors,
    ...global.waterElementDescriptors,
    ...global.overworldMapDescriptors,
    ...global.buildingPartDescriptors,
    ...global.outsideBuildingDescriptors,
    ...global.insideBuildingDescriptors,
    ...global.otherDescriptors,
    ...global.toolDescriptors,
    ...global.itemDescriptors,
    ...global.transportDescriptors,
    ...global.humanDescriptors,
    ...global.monsterDescriptors,
    ...global.animalDescriptors,
    ...global.farmAnimalDescriptors,
    ...global.lawnAnimalDescriptors,
    ...global.reptileDescriptors,
    ...global.birdDescriptors,
    ...global.audioModifierDescriptors,
    ...global.modifierDescriptors,
    ...global.weaponDescriptors,
    // ...global.complexDescriptors,
    ...global.goreDescriptors,
    // ...global.colorModifiers,
    ...global.dungeonItemDescriptors,
    // ...global.elementalModifiers,
    // ...global.livingCreatureModifiers,
    ...global.allModifiers,
    // ...global.directionalModifiers,
  }

  return global
}