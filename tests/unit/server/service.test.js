import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { Service } from '../../../server/service.js'; 
import TestUtil from '../_util/testUtil';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import config from '../../../server/config.js';


describe('#Service - test suite for Servie class', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks();
    });

    test('createFileStream - should create a read stream', () => {
        const filename = 'home/index.html';

        const mockReadStream = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            fs,
            "createReadStream"
        ).mockReturnValue(mockReadStream);

        const expectedStream = Service.prototype.createFileStream(filename);
        
        expect(fs.createReadStream).toBeCalledWith(filename);
        expect(expectedStream).toStrictEqual(mockReadStream);
    })

    test('getFileInfo - should get the file info', async () => {
        const filename = "home/index.html"

        const fullFilePath = "C:\\Users\\vitin\\OneDrive\\Documentos\\estudos\\semana-js-expert\\project\\public\\home\\index.html"
        const type = '.html';

        jest.spyOn(
            path,
            "join"
        ).mockReturnValue(fullFilePath);

        jest.spyOn(
            fsPromises, 
            "access"
        );

        jest.spyOn(
            path,
            "extname"
        ).mockReturnValue(
            type
        )

        const expectedReturn = await Service.prototype.getFileInfo(filename);

        expect(path.join).toBeCalledWith(config.dir.publicDir, filename);
        expect(fsPromises.access).toBeCalledWith(fullFilePath);
        expect(path.extname).toBeCalledWith(fullFilePath);
        expect(expectedReturn).toEqual({
            type,
            name: fullFilePath
        });
    });

    test('getFileStream - should get the file stream', async () => {
        const filename = 'home/index.html';
        const fileType = '.html';
        const fullFilePath = "C:\\Users\\vitin\\OneDrive\\Documentos\\estudos\\semana-js-expert\\project\\public\\home\\index.html"

        const mockStream = TestUtil.generateReadableStream(['data']);

        jest.spyOn(
            Service.prototype,
            "getFileInfo"
        ).mockResolvedValue({
            name: fullFilePath,
            type: fileType
        });

        jest.spyOn(
            Service.prototype,
            "createFileStream"
        ).mockReturnValue(mockStream);

        const result = await Service.prototype.getFileStream(filename);

        expect(Service.prototype.getFileInfo).toBeCalledWith(filename);
        expect(Service.prototype.createFileStream).toBeCalledWith(fullFilePath);
        expect(result).toEqual({
            stream: mockStream,
            type: fileType
        });
    });
   

  
});