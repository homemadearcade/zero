import * as Yup from 'yup';

export const messageFormSchema = Yup.object({
  participantEmail: Yup.string().required('Required'),
});
