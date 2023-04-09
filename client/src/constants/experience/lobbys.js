import { defaultAudienceRoleId, defaultGuideRoleId, defaultParticipantRoleId } from "./constants"
import { SECURITY_SCOPE_INVITE_ONLY, SECURITY_SCOPE_PUBLIC, SECURITY_SCOPE_UNLISTED } from "./constants/lobbys"

export const defaultLobby = {
  name: null,
  securityScopeByRoleId: {
    [defaultGuideRoleId]: SECURITY_SCOPE_UNLISTED,
    [defaultParticipantRoleId]: SECURITY_SCOPE_INVITE_ONLY,
    [defaultAudienceRoleId]: SECURITY_SCOPE_PUBLIC,
  },
  hostRoleId: defaultGuideRoleId,
  activitys: {},
  initialActivityId: null,
  instructionsByRoleId: {},
  isRemoved: false
}