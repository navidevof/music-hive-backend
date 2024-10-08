import { Request, Response } from 'express';
import response from '../../utils/response';
import VideosService from './services';

const search = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const results = await VideosService().search(q);
    return response({
      res,
      status: 200,
      error: false,
      message: 'Datos obtenidos',
      body: {
        results,
      },
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

const VideosController = {
  search,
};

export default VideosController;
