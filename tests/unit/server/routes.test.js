import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import { Controller } from '../../../server/controller.js';
import { handler } from '../../../server/routes.js';
import TestUtil from '../_util/testUtil.js';

describe('#Routes - test suite for api response', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks();
    });

    test('GET / - should redirect to home page', async () => {
        const params = TestUtil.defaultHandlerParams();

        params.request.method = 'GET';
        params.request.url = '/';

        await handler(...params.values());

        expect(params.response.writeHead).toBeCalledWith(
            302,
            {
                'Location': config.location.home 
            }
        );
        expect(params.response.end).toHaveBeenCalled();
    });
    test(`GET /home - should respond with ${config.pages.controller} file stream`, async () => {
        const params = TestUtil.defaultHandlerParams();

        params.request.method = 'GET';
        params.request.url = '/home';

        const mockFileStream = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            Controller.prototype,
            "getFileStream"
        ).mockResolvedValue({
            stream: mockFileStream,
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toBeCalledWith(config.pages.homeHTML);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });
    test(`GET /controller - should respond with ${config.pages.controller} file stream`, async () => {
        const params = TestUtil.defaultHandlerParams();

        params.request.method = 'GET';
        params.request.url = '/controller';

        const mockFileStream = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            Controller.prototype,
            "getFileStream"
        ).mockResolvedValue({
            stream: mockFileStream,
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toBeCalledWith(config.pages.controller);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });
    test(`GET /index.html - should respond with file stream`, async () => {
        const params = TestUtil.defaultHandlerParams();
        const filename = '/index.html'

        params.request.method = 'GET';
        params.request.url = filename;

        const expectedType = '.html';
        const mockFileStream = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            Controller.prototype,
            "getFileStream"
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).toBeCalledWith(
            200,
            {
                "Content-Type": config.constants.CONTENT_TYPE[expectedType]
            }
        )
    });
    test(`GET /file.ext - should respond with file stream`, async () => {
        const params = TestUtil.defaultHandlerParams();
        const filename = '/file.ext'

        params.request.method = 'GET';
        params.request.url = filename;

        const expectedType = '.ext';
        const mockFileStream = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            Controller.prototype,
            "getFileStream"
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).not.toHaveBeenCalled()
    });

    test(`POST /unknown - given an inexistent route, it should respond with 404`, async () => {
        const params = TestUtil.defaultHandlerParams();

        params.request.method = 'POST';
        params.request.url = '/unknown';

        await handler(...params.values());

        expect(params.response.writeHead).toBeCalledWith(404);
        expect(params.response.end).toHaveBeenCalled();
    });

    describe('exceptions', () => { 
        test('given an inexistent file, it should respond with 404', async () => {
            const params = TestUtil.defaultHandlerParams();
            const filename = '/index.png'

            params.request.method = 'GET';
            params.request.url = filename;

            jest.spyOn(
                Controller.prototype,
                "getFileStream"
            ).mockRejectedValue(
                new Error('Error: ENOENT: no such file or directory')
            )

            await handler(...params.values());

            expect(params.response.writeHead).toBeCalledWith(404);
            expect(params.response.end).toHaveBeenCalled();
        });
        test('given an error, it should respond with 500', async () => {
            const params = TestUtil.defaultHandlerParams();
            const filename = '/index.png'

            params.request.method = 'GET';
            params.request.url = filename;

            const expectedType = '.ext';
            const mockFileStream = TestUtil.generateReadableStream(['data']);

            jest.spyOn(
                Controller.prototype,
                "getFileStream"
            ).mockRejectedValue(
                new Error('Error: ')
            )

            await handler(...params.values());

            expect(params.response.writeHead).toBeCalledWith(500);
            expect(params.response.end).toHaveBeenCalled();
        });
     })

})