import client from "./client";

export const fetchMyInvitations = () =>
  client.get("/invitations").then((r) => r.data.invitations);

export const respondToInvitation = (invitationId, action) =>
  client.post(`/invitations/${invitationId}/respond`, { action }).then((r) => r.data);
