import fs from 'fs';
import config from './config.js';
import fsPromises from 'fs/promises';
import path from 'path';

export class Service {
    createFileStream(filename) {
        return fs.createReadStream(filename);
        // Um stream é ler uma grande arquivo em pedaços menores.
    }

    async getFileInfo(filename) {
        // filename = home/index.html
        const fullFilePath = path.join(config.dir.publicDir, filename);
        await fsPromises.access(fullFilePath);
        const fileType = path.extname(fullFilePath);

        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(filename) {
        const { name, type } = await this.getFileInfo(filename);

        return {
            stream: this.createFileStream(name),
            type    
        }
    }
}