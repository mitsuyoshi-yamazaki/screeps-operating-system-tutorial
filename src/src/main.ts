import { ErrorMapper } from "./ErrorMapper"

console.log(`Deployed at ${new Date()}`)

export const loop = ErrorMapper.wrap((): void => {
  Array.from(Object.values(Game.creeps)).forEach(creep => {
    creep.say(creep.name)
  })
})
