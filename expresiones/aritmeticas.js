export class Aritmetica {
    
    constructor(izq, der, op) {
        this.izq = izq;
        this.der = der;
        this.op = op;
    }

    // Método para verificar si un número es float (solo con tener algun decimal ya es float)
    esFloat(numero) {
        return numero % 1 !== 0;
    }

    // Método para ejecutar la operación aritmética
    ejecutar() {

        switch (this.op) {

            case '+':

                // Verificar si es de tipo int-int o float-float, retornar int o float
                if (typeof this.izq === 'number' && typeof this.der === 'number') {
                    const resultado = this.izq + this.der;

                    // Si cualquiera de los números es float, devuelve el resultado como float
                    if (this.esFloat(this.izq) || this.esFloat(this.der)) {
                        return parseFloat(resultado.toFixed(1));  // Mostrar con 1 decimal
                    }
                    return resultado;  // Si ambos son enteros, retorna entero
                }

                // Verificar si es de tipo string-string, retornar concatenación de strings
                if (typeof this.izq === 'string' && typeof this.der === 'string') {
                    return this.izq + this.der;
                }

                //si no es de los tipos anteriores, lanzar error
                throw new Error("Operación no soportada en la suma");

                break;

            case '-':

                // verificar si es de tipo int-int o float-float, retornar int o float
                if (typeof this.izq === 'number' && typeof this.der === 'number') {
                    const resultado = this.izq - this.der;

                    // Si cualquiera de los números es float, devuelve el resultado como float
                    if (this.esFloat(this.izq) || this.esFloat(this.der)) {
                        return parseFloat(resultado.toFixed(1));  // Mostrar con 1 decimal
                    }
                    return resultado;  // Si ambos son enteros, retorna entero
                }

                //si no es de los tipos anteriores, lanzar error
                throw new Error("Operación no soportada en la resta");

                break;
            
            
            case '*':

                // verificar si es de tipo int-int o float-float, retornar int o float
                if (typeof this.izq === 'number' && typeof this.der === 'number') {
                    const resultado = this.izq * this.der;

                    // Si cualquiera de los números es float, devuelve el resultado como float
                    if (this.esFloat(this.izq) || this.esFloat(this.der)) {
                        return parseFloat(resultado.toFixed(1));  // Mostrar con 1 decimal
                    }
                    return resultado;  // Si ambos son enteros, retorna entero
                }

                //si no es de los tipos anteriores, lanzar error
                throw new Error("Operación no soportada en la multiplicación");

                break;


            case '/':

                // verificar si es de tipo int-int o float-float, retornar int o float
                if (typeof this.izq === 'number' && typeof this.der === 'number') {

                    // Verificar si se está dividiendo por 0, mostar una advertencia y retornar null
                    if (this.der === 0) {
                        console.warn("División por 0");
                        return null;
                    }

                    const resultado = this.izq / this.der;

                    // Si cualquiera de los números es float, devuelve el resultado como float
                    if (this.esFloat(this.izq) || this.esFloat(this.der)) {

                        //si se está dividiendo por 0, mostrar advertencia y retornar null
                        if (this.der === 0) {
                            console.warn("División por 0");
                            return null;
                        }

                        return parseFloat(resultado.toFixed(1));  // Mostrar con 1 decimal
                    }

                    // si ambos son enteros, retornar entero, sin decimales, redondeando hacia abajo
                    return Math.floor(resultado);
                }

                //si no es de los tipos anteriores, lanzar error
                throw new Error("Operación no soportada en la división");

                break;

            
            case '%':

                // verificar si es de tipo int-int, retornar int
                if (typeof this.izq === 'number' && typeof this.der === 'number') {

                    // Verificar si se está dividiendo por 0, mostar una advertencia y retornar null
                    if (this.der === 0) {
                        console.warn("División por 0");
                        return null;
                    }
                    return this.izq % this.der;
                }
                
                //si no es de los tipos anteriores, lanzar error
                throw new Error("Operación no soportada en el módulo");

                break;

            default:
                throw new Error("Operación no soportada");
        }
    }
}