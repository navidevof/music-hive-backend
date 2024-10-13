import z from 'zod';

const AddVideoToPlaylist = z.object({
  eventId: z.string({
    invalid_type_error: 'ID del evento debe ser un string',
    required_error: 'ID del evento es un campo obligatorio',
  }),
  videoId: z.string({
    invalid_type_error: 'ID del video debe ser un string',
    required_error: 'ID del video es un campo obligatorio',
  }),
  userName: z.string({
    invalid_type_error: 'Nombre del usuario debe ser un string',
    required_error: 'Nombre del usuario es un campo obligatorio',
  }),
  image: z.string({
    invalid_type_error: 'Imagen del video debe ser un string',
    required_error: 'Imagen del video es un campo obligatorio',
  }),
  title: z.string({
    invalid_type_error: 'Titulo del video debe ser un string',
    required_error: 'Titulo del video es un campo obligatorio',
  }),
});
const RemoveVideoFromPlaylist = z.object({
  eventId: z.string({
    invalid_type_error: 'ID del evento debe ser un string',
    required_error: 'ID del evento es un campo obligatorio',
  }),
  videoId: z.string({
    invalid_type_error: 'ID del video debe ser un string',
    required_error: 'ID del video es un campo obligatorio',
  }),
});

export type TAddVideoToPlaylist = z.infer<typeof AddVideoToPlaylist>;
export type TRemoveVideoFromPlaylist = z.infer<typeof RemoveVideoFromPlaylist>;

const validateAddVideoToPlaylist = (object: any) => {
  return AddVideoToPlaylist.safeParse(object);
};

const validateRemoveVideoFromPlaylist = (object: any) => {
  return RemoveVideoFromPlaylist.safeParse(object);
};

const VideosSchema = {
  validateAddVideoToPlaylist,
  validateRemoveVideoFromPlaylist,
};

export default VideosSchema;
