export class Entorno {

    /**
        * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.padre = padre;
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     */
    setVariable(nombre, {tipo, valor}) {
        // TODO: si algo ya está definido, lanzar error
        if(this.valores.hasOwnProperty(nombre)){
            throw new Error(`Variable ${nombre} ya definida`);
        }
        this.valores[nombre] = {tipo, valor};
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) return valorActual;

        if (!valorActual && this.padre) {
            return this.padre.getVariable(nombre);
        }

        throw new Error(`Variable ${nombre} no definida`); 
    }

    /**
   * @param {string} nombre
   * @param {any} valor
   */
    assignVariable(nombre, valor) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) {
            this.valores[nombre] = valor;
            return;
        }

        if (!valorActual && this.padre) {
            this.padre.assignVariable(nombre, valor);
            return;
        }

        throw new Error(`Variable ${nombre} no definida`);
    }
}