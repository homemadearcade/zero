import * as Yup from 'yup';

export const lobbyFormSchema = Yup.object({
  participantEmail: Yup.string().required('Required'),
  startTime: Yup.string().required('Required'),
});
