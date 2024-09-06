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
    
    html +=("<!DOCTYPE html>");
    html +=("<html lang=\"es\">");
    html +=("<head>");
    html +=("<meta charset=\"UTF-8\">");
    html +=("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
    html +=("<title>Errores</title>");
    html +=("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
    html +=("<style>");
    html +=("body { background-color: #343a40; color: white; }");
    html +=("h1 { text-align: center; color: white; }");
    html +=("table { background-color: #343a40; }");
    html +=("th, td { border: 1px solid #dee2e6; }");
    html +=("th { background-color: #6c757d; }");
    html +=("tr:nth-child(even) { background-color: #495057; }");
    html +=("</style>");
    html +=("</head>");
    html +=("<body>");
    html +=("<div class=\"container mt-5\">");
    html +=("<h1>Reporte de Errores</h1>");
    html +=("<table class=\"table table-dark table-striped mt-3\">");
    html +=("<thead>");
    html +=("<tr>");
    html +=("<th>#</th>");
    html +=("<th>Tipo</th>");
    html +=("<th>Descripción</th>");
    html +=("<th>Fila</th>");
    html +=("<th>Columna</th>");
    html +=("</tr>");
    html +=("</thead>");
    html +=("<tbody>");

    let contador = 1;
    errores.forEach(error => {
        html += "<tr>";
        html += `<td>${contador++}</td>`;
        html += `<td>${error.tipo}</td>`;
        html += `<td>${error.mensaje}</td>`;
        html += `<td>${error.linea}</td>`;
        html += `<td>${error.columna}</td>`;
        html += "</tr>";
    });

    html +=("</tbody>");
    html +=("</table>");
    html +=("</div>");
    html +=("</body>");
    html +=("</html>");

    // Crear un blob con el contenido HTML
    const blob = new Blob([html], { type: 'text/html' });

    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reporte_errores.html';  // Nombre del archivo que se descargará
    link.click();  // Simular el click para descargar el archivo
    
}