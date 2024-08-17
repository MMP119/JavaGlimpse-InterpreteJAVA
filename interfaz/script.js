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
document.getElementById('runButton').addEventListener('click', function() {
    var code = editor.getValue();
    // poner el código en la consola de salida
    consoleEditor.setValue(code);
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


});


//para el botón de tabla de simbolos
document.getElementById('simbolosButton').addEventListener('click', function() {
});