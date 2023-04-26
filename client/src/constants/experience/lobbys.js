import { defaultAudienceRoleId, defaultGuideRoleId, defaultParticipantRoleId } from "./constants"
import { ROLE_SECURITY_SCOPE_INVITE_ONLY, ROLE_SECURITY_SCOPE_PUBLIC, ROLE_SECURITY_SCOPE_UNLISTED } from "./constants/lobbys"

export const defaultLobby = {
  name: null,
  securityScopeByRoleId: {
    [defaultGuideRoleId]: ROLE_SECURITY_SCOPE_UNLISTED,
    [defaultParticipantRoleId]: ROLE_SECURITY_SCOPE_INVITE_ONLY,
    [defaultAudienceRoleId]: ROLE_SECURITY_SCOPE_PUBLIC,
  },
  hostRoleId: defaultGuideRoleId,
  activitys: {},
  initialActivityId: null,
  instructionsByRoleId: {},
  isRemoved: false
}