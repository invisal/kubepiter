import GraphContext from '../../types/GraphContext'

export default function MeResolver (_, __, ctx: GraphContext) {
  return ctx.user
}
