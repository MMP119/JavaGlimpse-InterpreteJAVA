export class ExcepcionBrake extends Error {
    constructor() {
        super('Break');
    }
}

export class ExcepcionContinue extends Error {
    constructor() {
        super('Continue');
    }
}

export class ExcepcionReturn extends Error {
    /**
     * @param {any} value
     */
    constructor(value) {
        super('Return');
        console.log(value);
        this.value = value;
    }
}