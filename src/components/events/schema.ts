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

export type TCreateEvent = z.infer<typeof CreateEvent>;
export type TEvent = z.infer<typeof Event>;

const validateCreateEvent = (object: any) => {
  return CreateEvent.safeParse(object);
};

const validateEvent = (object: any) => {
  return Event.safeParse(object);
};

const eventsSchema = {
  validateCreateEvent,
  validateEvent,
};

export default eventsSchema;
