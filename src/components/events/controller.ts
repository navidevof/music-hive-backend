import { Request, Response } from 'express';
import EventsSchema from './schema';
import response from '../../utils/response';
import EventsServices from './services';

const createEvent = async (req: Request, res: Response) => {
  try {
    const result = EventsSchema.validateCreateEvent(req.body);
    if (result.error) {
      return response({
        res,
        status: 400,
        error: true,
        message: result.error.errors[0].message,
      });
    }

    const eventId = await EventsServices().createEvent({
      name: result.data.name,
      uid: result.data.uid,
      maxParticipants: 5,
    });

    response({
      res,
      status: 200,
      error: false,
      body: { eventId },
      message: 'ok',
    });
  } catch (error) {
    console.log({ error });
    return response({
      res,
      status: 500,
      error: true,
      message: 'Error al crear evento',
    });
  }
};

const joinEvent = async (req: Request, res: Response) => {
  try {
    const result = EventsSchema.validateEvent(req.body);
    if (result.error) {
      return response({
        res,
        status: 400,
        error: true,
        message: result.error.errors[0].message,
      });
    }

    const event = await EventsServices().getEvent({ eventId: result.data.eventId });
    if (!event) {
      return response({
        res,
        status: 404,
        error: true,
        message: 'Evento no encontrado',
      });
    }

    const currentParticipants = req.io.sockets.adapter.rooms.get(result.data.eventId)?.size ?? 1;
    if (currentParticipants >= event.maxParticipants) {
      return response({
        res,
        status: 400,
        error: true,
        message: 'Evento lleno',
      });
    }

    return response({
      res,
      status: 200,
      error: false,
      body: event,
      message: 'ok',
    });
  } catch (error) {
    console.log({ error });
    return response({
      res,
      status: 500,
      error: true,
      message: 'Error al buscar el evento',
    });
  }
};

const getPlaylistByEvent = async (req: Request, res: Response) => {
  try {
    const result = EventsSchema.validateEvent(req.params);
    if (result.error) {
      return response({
        res,
        status: 400,
        error: true,
        message: result.error.errors[0].message,
      });
    }

    const event = await EventsServices().getEvent({ eventId: result.data.eventId });
    if (!event) {
      return response({
        res,
        status: 404,
        error: true,
        message: 'Evento no encontrado',
      });
    }

    const playlists = await EventsServices().getPlaylistByEvent({ eventId: result.data.eventId });

    return response({
      res,
      status: 200,
      error: false,
      body: playlists,
      message: 'ok',
    });
  } catch (error) {
    console.log({ error });
    return response({
      res,
      status: 500,
      error: true,
      message: 'Error al obtener la lista de reproducción.',
    });
  }
};

const leaveEvent = async (req: Request, res: Response) => {
  try {
    const result = EventsSchema.validateEvent(req.body);
    if (result.error) {
      return response({
        res,
        status: 400,
        error: true,
        message: result.error.errors[0].message,
      });
    }

    await EventsServices().removeEvent({ eventId: result.data.eventId });

    req.io.to(result.data.eventId).emit('closeEvent', result.data.eventId);
    req.io.to(result.data.eventId).disconnectSockets(true);

    return response({
      res,
      status: 200,
      error: false,
      body: null,
      message: 'ok',
    });
  } catch (error) {
    console.log({ error });
    return response({
      res,
      status: 500,
      error: true,
      message: 'Error al abandonar el evento.',
    });
  }
};

const eventsController = {
  createEvent,
  joinEvent,
  getPlaylistByEvent,
  leaveEvent,
};

export default eventsController;
