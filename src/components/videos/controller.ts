import { Request, Response } from 'express';
import response from '../../utils/response';
import VideosService from './services';
import EventsServices from '../events/services';
import VideosSchema from './schema';

const search = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const results = await VideosService().search(q);
    return response({
      res,
      status: 200,
      error: false,
      message: 'Datos obtenidos',
      body: results,
    });
  } catch (error) {
    console.log({ error });
    return response({
      res,
      status: 500,
      error: true,
      message: 'Error al obtener datos',
    });
  }
};

const addVideoToPlaylist = async (req: Request, res: Response) => {
  try {
    const result = VideosSchema.validateAddVideoToPlaylist(req.body);
    if (result.error) {
      return response({
        res,
        status: 400,
        error: true,
        message: result.error.errors[0].message,
      });
    }

    const video = {
      image: result.data.image,
      title: result.data.title,
      userName: result.data.userName,
      videoId: result.data.videoId,
    };

    const isExistingVideo = await VideosService().getVideoById({ eventId: result.data.eventId, videoId: result.data.videoId });

    if (isExistingVideo) return response({ res, status: 400, error: true, message: 'El video ya existe en la lista de reproducción' });

    await VideosService().addVideoToPlaylist({ eventId: result.data.eventId, video });
    const playlists = await EventsServices().getPlaylistByEvent({ eventId: result.data.eventId });

    req.io.to(result.data.eventId).emit('updatePlaylists', playlists);

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
      message: 'Error al agregar video a la lista de reproducción.',
    });
  }
};

const removeVideoFromPlaylist = async (req: Request, res: Response) => {
  try {
    const result = VideosSchema.validateRemoveVideoFromPlaylist(req.body);
    if (result.error) {
      return response({
        res,
        status: 400,
        error: true,
        message: result.error.errors[0].message,
      });
    }

    const isExistingVideo = await VideosService().getVideoById({ eventId: result.data.eventId, videoId: result.data.videoId });
    if (!isExistingVideo) return response({ res, status: 400, error: true, message: 'El video no existe en la lista de reproducción' });

    await VideosService().removeVideoFromPlaylist({ eventId: result.data.eventId, videoId: result.data.videoId });
    const playlists = await EventsServices().getPlaylistByEvent({ eventId: result.data.eventId });

    req.io.to(result.data.eventId).emit('updatePlaylists', playlists);

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
      message: 'Error al eliminar video a la lista de reproducción.',
    });
  }
};

const VideosController = {
  search,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};

export default VideosController;
