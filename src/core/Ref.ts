// imports
import { InvalidOperationError } from "@nascentdigital/errors";


// class definition
export class Ref<T> {

    public current?: T;


    public constructor(initialValue?: T) {
        this.current = initialValue;
    }

    public get hasValue(): boolean {
        return this.current !== undefined;
    }

    /**
     * Dereferences the value, assuming that
     */
    public get value(): T {

        // throw if not set
        if (this.current === undefined) {
            throw new InvalidOperationError("Attempt to dereference unset value.");
        }

        // return reference
        return this.current;
    }
}
