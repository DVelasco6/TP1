const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let listaMaterias = [
    { id: 1, nombre: 'Matemáticas', alumnos: 30 },
    { id: 2, nombre: 'Física', alumnos: 25 }
];
let contadorID = 3;

// Funciones de API
function ObtenerMaterias(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listaMaterias));
}

// Función original de tu profesor para eliminar materias
function EliminarMateriaPorId(res, id) {
    const index = listaMaterias.findIndex(materia => materia.id === id);
    if (index !== -1) {
        const materiaEliminada = listaMaterias.splice(index, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Materia eliminada', materia: materiaEliminada }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Materia no encontrada.' }));
    }
}

function EliminarMaterias(res) {
    if (listaMaterias.length === 0) {
        // Si no hay materias
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No hay materias para eliminar.' }));
    } else {
        listaMaterias = []; // Eliminar todas las materias
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: 'Todas las materias fueron eliminadas.' }));
    }
}

// Función para agregar materias
function AgregarMateria(res, nuevaMateria) {
    nuevaMateria.id = contadorID++;
    listaMaterias.push(nuevaMateria);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Materia agregada', materia: nuevaMateria }));
}

// Crear servidor
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const extname = path.extname(parsedUrl.pathname);

    // Servir archivos estáticos (CSS y JS)
    if (extname === '.css' || extname === '.js') {
        const filePath = path.join(__dirname, parsedUrl.pathname);
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Archivo no encontrado');
            } else {
                const contentType = extname === '.css' ? 'text/css' : 'application/javascript';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
        return;
    }

    // Servir HTML principal
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
        return;
    }

    // Rutas de la API
    if (req.method === 'GET' && parsedUrl.pathname === '/api/materias') {
        ObtenerMaterias(res); // Obtener todas las materias
        return;
    } else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/materias/')) {
        const id = parseInt(parsedUrl.pathname.slice(14)); // Extraer el ID de la URL
        if (!isNaN(id)) {
            const materia = listaMaterias.find(item => item.id === id);
            if (materia) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(materia));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Materia no encontrada.' }));
            }
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID inválido: no corresponde a ninguna materia.' }));
        }
        return;
    } else if (req.method === 'POST' && parsedUrl.pathname === '/api/materias') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const nuevaMateria = JSON.parse(body);
            AgregarMateria(res, nuevaMateria);
        });
        return;
    } else if (req.method === 'DELETE' && req.url.startsWith('/api/delete/materia/')) {
        const idMateria = parseInt((req.url).slice(20)); // Extraer el ID de la URL
        if (!isNaN(idMateria)) {
            EliminarMateriaPorId(res, idMateria);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID inválido: no corresponde a ninguna materia.' }));
        }
        return;
    } else if (req.method === 'DELETE' && req.url === '/api/delete/materias') {

        EliminarMaterias(res); // Elimina todas las materias
        return;
    }
    
    // Ruta no encontrada
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada.');
});

// Iniciar servidor
server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
