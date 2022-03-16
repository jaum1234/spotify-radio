import { logger } from './util.js';
import config from './config.js';
import { Controller } from './controller.js';

const controller = new Controller();

const routes = async (request, response) => {
    const { method, url } = request;

    if (method === 'GET' && url === '/') {
        response.writeHead(302, {
            'Location': config.location.home
        });
        return response.end();
    }

    if (method === 'GET' && url === '/home') {
        const { stream } = await controller.getFileStream(config.pages.homeHTML);
        
        return stream.pipe(response);
    }


    if (method === 'GET' && url === '/controller') {
        const { stream } = await controller.getFileStream(config.pages.controller);

        return stream.pipe(response);
    }

    if (method === 'GET') {
        const { stream, type } = await controller.getFileStream(url);

        const contentType = config.constants.CONTENT_TYPE[type];

        if (contentType) {

            response.writeHead(200, {
                'Content-Type': config.constants.CONTENT_TYPE[type]
            })
        }
        return stream.pipe(response);
    }

    
    response.writeHead(404);
    response.end();
}

const handleError = (err, response) => {
    if (err.message.includes('ENOENT')) {
        logger.warn(`asset not found ${err.stack}` );
        response.writeHead(404);
        return response.end();
    }

    logger.error(`caught error on API ${err.stack}`);
    response.writeHead(500);
    return response.end();
}

export const handler = (request, response) => {
    return routes(request, response)
    .catch(err => handleError(err, response));
}