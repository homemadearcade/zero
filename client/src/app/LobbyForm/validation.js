import * as Yup from 'yup';

export const lobbyFormSchema = Yup.object({
  user: Yup.object().required('Required'),
  startTime: Yup.string().required('Required'),
});
