const http = require('http');
const url = require('url');

let listaDeMaterias= [
    { id: 1, nombre: 'Matemáticas', alumnos: 30 },
    { id: 2, nombre: 'Física', alumnos: 25 }
];

const server= http.createServer((req,res) =>{
    const parsedUrl=url.parse(req.url,true);

    

})