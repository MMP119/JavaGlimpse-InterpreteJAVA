
let errores = [];

export function registrarError(tipo,mensaje, linea, columna) {
    errores.push({tipo,mensaje, linea, columna });
}

export function obtenerErrores() {
    return errores;
}


export function limpiarErrores() {
    errores = [];
}

export function obtenerErroresHTML() {
    let html = "<table border='1'>";
    html += "<tr>";
    html += "<th>Mensaje</th>";
    html += "<th>Línea</th>";
    html += "<th>Columna</th>";
    html += "</tr>";

    errores.forEach(error => {
        html += "<tr>";
        html += `<td>${error.tipo}</td>`;
        html += `<td>${error.mensaje}</td>`;
        html += `<td>${error.linea}</td>`;
        html += `<td>${error.columna}</td>`;
        html += "</tr>";
    });

    html += "</table>";

    return html;
}