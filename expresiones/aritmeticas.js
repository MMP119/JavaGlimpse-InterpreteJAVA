export class Aritmetica {

    constructor(izq, der, op) {
        this.izq = izq;
        this.der = der;
        this.op = op;
    }

    //para detectar que tipo de dato es el valor derecho e izquierdo
    detectarTipo(valor){
        if(typeof valor === 'string' && !String(valor).includes('.')){
            return 'string';
        }
        if(typeof valor === 'number' && String(valor).includes('.')){
            return 'float';
        }
        if(typeof valor === 'number'){
            return 'int';
        }
    }

    // Método para ejecutar la operación aritmética
    ejecutar() {

        switch (this.op) {
            case '+':

                if(this.detectarTipo(this.izq)=== 'int' && this.detectarTipo(this.der) === 'int'){
                    const resultado = parseInt(this.izq) + parseInt(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'int' && this.detectarTipo(this.der) === 'float'){
                    //pasar el valor izq y der a float y retornar dos decimales
                    const resultado = parseFloat(this.izq) + parseFloat(this.der);
                    return resultado
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'float'){
                    const resultado = parseFloat(this.izq) + parseFloat(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'int'){
                    const resultado = parseFloat(this.izq) + parseFloat(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'string' && this.detectarTipo(this.der) === 'string'){
                    const resultado = this.izq + this.der;
                    return resultado;
                }

                throw new Error("Operación no soportada en la suma");
                

            case '-':

                if(this.detectarTipo(this.izq)=== 'int' && this.detectarTipo(this.der) === 'int'){
                    const resultado = parseInt(this.izq) - parseInt(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'int' && this.detectarTipo(this.der) === 'float'){
                    //pasar el valor izq y der a float y retornar dos decimales
                    const resultado = parseFloat(this.izq) - parseFloat(this.der);
                    return resultado
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'float'){
                    const resultado = parseFloat(this.izq) - parseFloat(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'int'){
                    const resultado = parseFloat(this.izq) - parseFloat(this.der);
                    return resultado;
                }

                throw new Error("Operación no soportada en la resta");


            case '*':

                if(this.detectarTipo(this.izq)=== 'int' && this.detectarTipo(this.der) === 'int'){
                    const resultado = parseInt(this.izq) * parseInt(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'int' && this.detectarTipo(this.der) === 'float'){
                    //pasar el valor izq y der a float y retornar dos decimales
                    const resultado = parseFloat(this.izq) * parseFloat(this.der);
                    return resultado
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'float'){
                    const resultado = parseFloat(this.izq) * parseFloat(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'int'){
                    const resultado = parseFloat(this.izq) * parseFloat(this.der);
                    return resultado;
                }

                throw new Error("Operación no soportada en la multiplicación");


            case '/':
                if(this.detectarTipo(this.izq)=== 'int' && this.detectarTipo(this.der) === 'int'){

                    if(parseInt(this.der) === 0){
                        new Error("No se puede dividir entre 0");
                        return null
                    }

                    const resultado = parseInt(this.izq) / parseInt(this.der);
                    //retornar sin decimales ya que son enteros
                    return resultado.toFixed(0);
                }

                if(this.detectarTipo(this.izq) === 'int' && this.detectarTipo(this.der) === 'float'){

                    if(parseFloat(this.der) === 0){
                        new Error("No se puede dividir entre 0");
                        return null
                    }

                    //pasar el valor izq y der a float y retornar todos los decimales
                    const resultado = parseFloat(this.izq) / parseFloat(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'float'){

                    if(parseFloat(this.der) === 0){
                        new Error("No se puede dividir entre 0");
                        return null
                    }

                    const resultado = parseFloat(this.izq) / parseFloat(this.der);
                    return resultado;
                }

                if(this.detectarTipo(this.izq) === 'float' && this.detectarTipo(this.der) === 'int'){

                    if(parseInt(this.der) === 0){
                        new Error("No se puede dividir entre 0");
                        return null
                    }

                    const resultado = parseFloat(this.izq) / parseFloat(this.der);
                    return resultado;
                }

                throw new Error("Operación no soportada en la división");

            case '%':

                if(this.detectarTipo(this.izq)=== 'int' && this.detectarTipo(this.der) === 'int'){

                    if(parseInt(this.der) === 0){
                        new Error("No se puede dividir entre 0");
                        return null
                    }

                    const resultado = parseInt(this.izq) % parseInt(this.der);
                    return resultado;
                }

                throw new Error("Operación no soportada en el módulo");                

            default:
                throw new Error("Operación no soportada");
        }
    }
}