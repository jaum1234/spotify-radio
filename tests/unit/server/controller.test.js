import { jest, describe, test, beforeEach, expect } from '@jest/globals';
import { Controller } from '../../../server/controller';
import { Service } from '../../../server/service';
import TestUtil from '../_util/testUtil';

describe('#Controller - test suite for controller class', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks();
    });
    
    test('getFileStream', async () => {
        const filename = 'home/index.html'
        const fileType = '.html';
        const mockStream = TestUtil.generateReadableStream();

        const controller = new Controller();

        jest.spyOn(
            Service.prototype,
            "getFileStream"
        ).mockReturnValue({
            type: fileType,
            stream: mockStream
        })

        const result = await controller.getFileStream(filename);

        expect(Service.prototype.getFileStream).toBeCalledWith(filename);
        expect(result).toEqual({
            type: fileType,
            stream: mockStream
        })
    });
})