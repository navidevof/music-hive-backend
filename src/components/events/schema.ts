import z from 'zod';

const CreateEvent = z.object({
  uid: z.string({
    invalid_type_error: 'ID del usuario debe ser un string',
    required_error: 'ID del usuario es un campo obligatorio',
  }),
  name: z.string({
    invalid_type_error: 'Nombre debe ser un string',
    required_error: 'Nombre es un campo obligatorio',
  }),
});

const Event = z.object({
  eventId: z.string({
    invalid_type_error: 'ID del evento debe ser un string',
    required_error: 'ID del evento es un campo obligatorio',
  }),
});

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

export type TCreateEvent = z.infer<typeof CreateEvent>;
export type TEvent = z.infer<typeof Event>;
export type TAddVideoToPlaylist = z.infer<typeof AddVideoToPlaylist>;

const validateCreateEvent = (object: any) => {
  return CreateEvent.safeParse(object);
};

const validateEvent = (object: any) => {
  return Event.safeParse(object);
};

const validateAddVideoToPlaylist = (object: any) => {
  return AddVideoToPlaylist.safeParse(object);
};

const eventsSchema = {
  validateCreateEvent,
  validateEvent,
  validateAddVideoToPlaylist,
};

export default eventsSchema;
