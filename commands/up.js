import express from 'express';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import figlet from 'figlet';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function upCommand() {
    const app = express();

    const publicPath = path.join(__dirname, '../public');

    app.use(express.static(publicPath));
    app.use(express.json());

    // API endpoint: Save file
    app.post('/api/save-file', (req, res) => {
        try {
            const { path: filePath, name, content } = req.body;
            
            if (!name || !content) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Determine save path
            let fullPath = filePath;
            
            // If path is just a filename or doesn't look like a full path
            if (!filePath || filePath === name || !filePath.includes(path.sep)) {
                // Save to current working directory or a default location
                const cwd = process.cwd();
                fullPath = path.join(cwd, name);
            }

            // Ensure the directory exists
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Write the file
            fs.writeFileSync(fullPath, content, 'utf8');
            res.json({ success: true, message: 'File saved successfully', path: fullPath });
        } catch (error) {
            console.error('Error saving file:', error);
            res.status(500).json({ error: error.message });
        }
    });

    const server = app.listen(0, async () => {
        const port = server.address().port;
        console.log(figlet.textSync('md2slides'));

        console.log(`Slides running on http://localhost:${port}`);

        await open(`http://localhost:${port}`);
    });
}