import { ForbiddenError } from 'apollo-server-core';
import enforceKeepNthImagePolicy from 'src/crons/enforceKeepNthImagePolicy';
import GraphContext from 'src/types/GraphContext';

export default async function EnforceKeepNthPolicyResolver(_, __, ctx: GraphContext) {
  if (!ctx.user) throw new ForbiddenError('Only the owner can force running this rule');
  if (ctx.user.role !== 'OWNER') throw new ForbiddenError('Only the owner can force running this rule');

  enforceKeepNthImagePolicy().then().catch();

  return true;
}
