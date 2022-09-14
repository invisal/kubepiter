import GraphContext from 'src/types/GraphContext';

export default async function SetupStatusResolver(_, __, ctx: GraphContext) {
  const owner = await ctx.db.getOwner();

  return {
    hasOwnerSetup: !!owner,
  };
}
