export const loop = () => {
  Array.from(Object.values(Game.creeps)).forEach(creep => {
    creep.say(creep.name)
  })
}