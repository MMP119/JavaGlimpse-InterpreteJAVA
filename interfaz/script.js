import { parse } from '../analizador/analizador.js';
import { InterpreterVisitor} from '../patron/interprete.js';
import { obtenerErrores, limpiarErrores, obtenerErroresHTML } from '../global/errores.js';
import { obtenerSimbolos, limpiarSimbolos, obtenerSimbolosHTML } from '../global/simbolos.js';

// Inicializa CodeMirror en el textarea con id 'codeInput'
var editor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
    lineNumbers: true,
    mode: 'text/x-java', // Modo Java
    theme: "dracula",
    viewportMargin: Infinity, // asegura que todo el contenido sea visible
});

// Inicializa CodeMirror en el textarea con id 'consoleOutput'
var consoleEditor = CodeMirror.fromTextArea(document.getElementById('consoleOutput'), {
    lineNumbers: false,
    mode: "text/plain",
    theme: "dracula",
    readOnly: true,
    viewportMargin: Infinity,
});


//funcion para el boton 'open', abre un archivo
document.getElementById('openButton').addEventListener('click', function() {
    var input = document.createElement('input'); //crea un input
    input.type = 'file';    //tipo file
    input.onchange = e => { //cuando cambia el input
        var file = e.target.files[0]; //obtiene el archivo
        var reader = new FileReader(); //crea un lector de archivos
        reader.readAsText(file,'UTF-8'); //lee el archivo
        reader.onload = readerEvent => { //cuando termina de leer
            var content = readerEvent.target.result; //obtiene el contenido
            editor.setValue(content); //pone el contenido en el editor
        }
    }
    input.click(); //hace click en el input
});


// función para el botón 'Run'
document.getElementById('runButton').addEventListener('click', () => {

    limpiarErrores(); // Limpiar errores anteriores
    limpiarSimbolos(); // Limpiar tabla de símbolos
    const code = editor.getValue();

    try {
        const ast = parse(code); // analizar el código

        const interpretacion = new InterpreterVisitor(); // crear un visitante

        // Verificar si el AST es un arreglo o un solo nodo
        if (Array.isArray(ast)) {
            ast.forEach(nodo => nodo.accept(interpretacion));
        } else {
            ast.accept(interpretacion); // Si es un solo nodo
        }

        let output = interpretacion.salida;

        const erroes = obtenerErrores();
        if(erroes.length > 0){
            output += '\n\n============================== ERRORES ==============================\n';
            erroes.forEach(error => {
                output += `Error: ${error.mensaje}\nLínea: ${error.linea}, Columna: ${error.columna}\n`;
            });
        }

        // Mostrar la salida en la consola
        consoleEditor.setValue(output);        

    } catch (e) {
        if (e.name === 'SyntaxError') {
            // Mostrar el error de sintaxis en la consola
            consoleEditor.setValue(
                `Error de sintaxis: ${e.message}\nLínea: ${e.location.start.line}, Columna: ${e.location.start.column}`
            );
        } else {
            // Manejar otros posibles errores
            const errorMessage = e.location 
            ? `Error: ${e.message}\nLínea: ${e.location.start.line}, Columna: ${e.location.start.column}`
            : `Error: ${e.message}`;

            consoleEditor.setValue(errorMessage);

            consoleEditor.setValue(
                `Error: ${e.message}\n`+
                `lase/Error: ${e.name}\n`+
                `Stack: ${e.stack}`
            );

        }
    }
});

// función para el botón 'Clear'
document.getElementById('clearButton').addEventListener('click', function() {
    editor.setValue('');
    consoleEditor.setValue('');
});


// funcion para el boton 'save', guarda el archivo
document.getElementById('saveButton').addEventListener('click', function() {
    // Solicitar al usuario el nombre del archivo
    let fileName = window.prompt('Ingrese el nombre del archivo:', '');
    
    // Si el usuario cancela o no ingresa un nombre, salir de la función
    if (fileName === null || fileName === '') {
        return; // No hacer nada si el usuario cancela
    }
    
    // Obtener el contenido del editor
    const codeContent = editor.getValue();

    // Asegurar que el archivo tenga una extensión
    if (!fileName.endsWith('.aok')) {
        fileName += '.aok';
    }

    // Crear un blob con el contenido del editor
    const blob = new Blob([codeContent], { type: 'text/plain' });

    // Crear un enlace de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);

    // Asignar el nombre ingresado por el usuario al archivo
    downloadLink.download = fileName;

    // Simular un clic en el enlace para iniciar la descarga
    downloadLink.click();
});

//para el erroresButton
document.getElementById('erroresButton').addEventListener('click', function() {
    obtenerErroresHTML();
});


//para el botón de tabla de simbolos
document.getElementById('simbolosButton').addEventListener('click', function() {
    obtenerSimbolosHTML();
});