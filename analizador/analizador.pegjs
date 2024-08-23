
{
    const crearNodo = (tipoNodo, props) =>{
    const tipos = {
        'numero': nodos.Numero,
        'agrupacion': nodos.Agrupacion,
        'binaria': nodos.OperacionBinaria,
        'unaria': nodos.OperacionUnaria,
        'declaracionTipoVariable': nodos.DeclaracionTipoVariable,
        'referenciaVariable': nodos.ReferenciaVariable,
        'print': nodos.Print,
        'expresionStmt': nodos.ExpresionStmt,
        'asignacion': nodos.Asignacion,
        'bloque': nodos.Bloque,
        'if': nodos.If,
        'while': nodos.While,
        'cadena': nodos.Cadena,
        'booleano': nodos.Booleano
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
    }

    const reservedWords = new Set([
        'abstract', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 
        'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 
        'enum', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 
        'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 
        'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 
        'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 
        'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 
        'yield'
    ]);

    //funcion para verificar si un identificador es válido
    function isValidIdentificador(id) {
        const identificadorRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        return identificadorRegex.test(id) && !reservedWords.has(id);        
    }

}


programa = _ dcl:Declaracion* _ { return dcl }


Declaracion = dcl:DecVariable _ { return dcl }

            / stmt:Stmt _ { return stmt }


DecVariable = tipo:TiposDatosPrimitivos _ id:Identificador _  "=" _ exp:Expresion _ ";" { return crearNodo('declaracionTipoVariable', { tipo, id, exp }) }

            / tipo:TiposDatosPrimitivos _ id:Identificador _ ";" { const exp = null; return crearNodo('declaracionTipoVariable', { tipo, id, exp }) }


Stmt = "System.out.println(" _ exp:Expresion _ ")" _ ";" { return crearNodo('print', { exp }) }

    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

    / "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }

    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
        stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
        )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }

    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }



Expresion =  Booleano
            / Asignacion


Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('asignacion', { id, asgn }) }
            
            / Comparacion


Comparacion = izq:Suma expansion:(_ op:("<" / "<=" / ">=" / ">" ) _ der:Suma { return { tipo: op, der } })* 
{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual

        // verificar si es una operacion entre cadenas
        if(tipo ==="+" && typeof operacionAnterior.valor === 'string' && typeof der.valor === 'string'){
            return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
        }

        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
}


Suma = izq:Multiplicacion expansion:( _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } })* 

{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
}


Multiplicacion = izq:Unaria expansion:(_ op:("*" / "/" / "%") _ der:Unaria { return { tipo: op, der } })* 
{
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
        },
        izq
    )
}


Unaria = "-" _ num:Numero { return crearNodo('unaria', { op: '-', exp: num }) }

    / Booleano
    
    / Numero

    / Cadena



Numero = NumeroDecimal 
    
    / NumeroEntero
    
    / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }

    / "[" _ exp:Expresion _ "]" { return crearNodo('agrupacion', { exp }) }

    / id:Identificador { return crearNodo('referenciaVariable', { id }) }



NumeroEntero = [0-9]+//( "." [0-9]+ )? 
    {
    const valorNum = parseInt(text(),10);
    return crearNodo('numero', { tipo:'int',valor: valorNum});
    } 


NumeroDecimal = [0-9]+("." [0-9]+)
    {
    const valorNum = parseFloat(text(),10);
    return crearNodo('numero', { tipo:'float',valor:valorNum});
    } 


// nueva regla para cadenas de texcto con secuencias de escape
Cadena = "\"" chars: Caracteres* "\"" {return crearNodo('cadena', {tipo: 'string', valor: chars.join('')})} //el char.join es para unir los caracteres de la cadena
    
        / Caracter //para cadenas de un solo caracter


Caracter = "\'" chars: Caracteres "\'" {return crearNodo('cadena', {tipo: 'char', valor: chars})}


Caracteres = EscapeSequence 
    / [^\\"] // cualquier caracter que no sea una barra invertida o comillas dobles


EscapeSequence = "\\" esc:(["\\nrt"]) { 
    switch (esc) {
        case 'n': return '\n';
        case 't': return '\t';
        case 'r': return '\r';
        case '\\': return '\\';
        case '"': return '"';
    }
}


TiposDatosPrimitivos = "int" / "float" / "string" / "boolean" / "char" / "var"  { return text() }


// Ignorar espacios en blanco y comentarios, tanto de una línea como multilínea
_ = ([ \t\n\r] /comentarios / comentariosMultilinea )*


//Espresiones regulares para comentarios
comentarios = "//" [^\n]* "\n" { return null }
comentariosMultilinea = "/*" (!"*/" .)* "*/" { return null }

// expresion para identificadores
Identificador = [a-zA-Z_][a-zA-Z0-9_]* { const id = text(); if(!isValidIdentificador(id)) { throw new Error(`Identificador inválido: ${id}, es una palabra reservada del lenguaje`); return null;} return id; }

//expresion para los booleanos
Booleano = "true" { return crearNodo('booleano', {tipo: 'boolean', valor: true})}
        / "false" { return crearNodo('booleano', {tipo: 'boolean', valor: false})}