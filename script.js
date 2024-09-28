//Agregar Materia
document.getElementById('materiaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombreMateria').value;
    const alumnos = document.getElementById('cantidadAlumnos').value;

    fetch('/api/materias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, alumnos })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log('Materia agregada:', data);
        mostrarMaterias();
                document.getElementById('nombreMateria').value = '';
        document.getElementById('cantidadAlumnos').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al agregar la materia');
    });
});
//Eliminar Materia por ID
document.getElementById('eliminarMateriaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const idMateriaAEliminar = document.getElementById('idMateriaAEliminar').value;

    fetch(`/api/delete/materia/${idMateriaAEliminar}`, { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === 'Materia eliminada') {
            alert(data.mensaje);
            console.log('Eliminación exitosa:', data);
            mostrarMaterias();
        } else {
            alert(`Error: ${data.error}`);
            console.log('Error:', data.error);
        }
    })
    .catch(error => console.error('Error en la petición:', error));
});
//Mostrar las Materias
function mostrarMaterias() {
    fetch(`/api/materias`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const listaMaterias = document.getElementById('listaMaterias');
        listaMaterias.innerHTML = '';
        if(data.length === 0){
            listaMaterias.innerHTML = '<p>No hay materias disponibles.</p>';
        }else {
        data.forEach(materia => {
            const li = document.createElement('li');
            li.textContent = `ID: ${materia.id}, Nombre: ${materia.nombre}, Alumnos: ${materia.alumnos}`;
            listaMaterias.appendChild(li);
            
            });
        }
    })
    .catch(error => console.error('Error:', error));
}
//Ver las Materias desde el boton
document.getElementById('verMateriasBtn').addEventListener('click', function() {
    mostrarMaterias();
});

//Eliminar todas las Materias
document.getElementById('eliminarMateriasBtn').addEventListener('click', function() {
    const confirmar = confirm("¿Estás seguro de eliminar todas las materias?");
    if (confirmar) {
        fetch('/api/delete/materias', { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.error){
                alert('Error: No hay materias para eliminar.');
            }else{
            alert('Todas las materias fueron eliminadas.');
            const listaMaterias = document.getElementById('listaMaterias');
            listaMaterias.innerHTML = '<p>No hay materias disponibles.</p>';
            } 
        })
        .catch(error => {
            console.error('Error al eliminar las materias:', error);
        });
    }
});
//Buscar la Materia por ID
document.getElementById('buscarMateriaPorIDForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const idMateriaABuscar = document.getElementById('idMateriaABuscar').value;

    fetch(`/api/materias/${idMateriaABuscar}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const mostrarMateriaID = document.getElementById('mostrarMateriaID');
        mostrarMateriaID.innerHTML = ''; 
        if (data.error) {
            mostrarMateriaID.innerHTML = `<li>${data.error}</li>`;
        } else {
            mostrarMateriaID.innerHTML = 
               `<li>ID: ${data.id}, Nombre: ${data.nombre}, Alumnos: ${data.alumnos}</li>`;
        }
    })
    .catch(error => console.error('Error en la petición:', error));
});
