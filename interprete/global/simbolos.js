let TablaSimbolos = [];

export function agregarSimbolo(id, tipoSimbolo, tipoDato, ambito, fila, columna){
    TablaSimbolos.push({id, tipoSimbolo, tipoDato, ambito, fila, columna});
}


export function obtenerSimbolos(){
    return TablaSimbolos;
}

export function limpiarSimbolos(){
    TablaSimbolos = [];
}

export function obtenerSimbolosHTML(){
    let html = "<table border='1'>";
    
    html +=("<!DOCTYPE html>");
    html +=("<html lang=\"es\">");
    html +=("<head>");
    html +=("<meta charset=\"UTF-8\">");
    html +=("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
    html +=("<title>Tabla de Simbolos</title>");
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
    html +=("<h1>Tabla de Simbolos</h1>");
    html +=("<table class=\"table table-dark table-striped mt-3\">");
    html +=("<thead>");
    html +=("<tr>");
    html +=("<th>#</th>");
    html +=("<th>Id</th>");
    html +=("<th>Tipo</th>");
    html +=("<th>Tipo de Dato</th>");
    html +=("<th>Ambito</th>");
    html +=("<th>Fila</th>");
    html +=("<th>Columna</th>");
    html +=("</tr>");
    html +=("</thead>");
    html +=("<tbody>");

    let contador = 1;
    TablaSimbolos.forEach(simbolo => {
        html += "<tr>";
        html += `<td>${contador++}</td>`;
        html += `<td>${simbolo.id}</td>`;
        html += `<td>${simbolo.tipoSimbolo}</td>`;
        html += `<td>${simbolo.tipoDato}</td>`;
        html += `<td>${simbolo.ambito}</td>`;
        html += `<td>${simbolo.fila}</td>`;
        html += `<td>${simbolo.columna}</td>`;
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
    link.download = 'reporte_simbolos.html';  // Nombre del archivo que se descargará
    link.click();  // Simular el click para descargar el archivo
    
} 
