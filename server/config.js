import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));

const root = join(currentDir, "../");
const audioDir = join(root, "audio");
const publicDir = join(root, "public");

export default {
    port: process.env.PORT || 3001,
    dir: {
        root,
        publicDir,
        audioDir,
        songsDir: join(audioDir, "song"),
        fxDir: join(audioDir, "fx")
    },
    pages: {
        homeHTML: "home/index.html",
        controller: "controller/index.html"
    },
    location: {
        home: "/home"
    },
    constants: {
        CONTENT_TYPE: {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/js'
        }
    }
}
