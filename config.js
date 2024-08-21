module.exports = {
    format: 'es',
    input: './analizador/analizador.pegjs',
    dependencies:{
        'nodos': '../patron/nodos.js'
    }
}

// corre con el comando npx peggy -c ./config.js