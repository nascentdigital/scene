// types

export enum SelectorType {
    FLOW = "flow",
    PAGE = "page",
    COMPONENT = "comp",
    ELEMENT = "elem"
}

// helper
export class Selector {

    private constructor() {
    }

    static for(name: string, type: SelectorType = SelectorType.COMPONENT, id?: string) {

        // create base selector
        let selector = `*[data-scene-${type}="${name}"]`;

        // add id selector if provided
        if (id) {
            selector += `[data-scene-id="${id}"]`;
        }

        // return selector
        return new SelectorBuilder(selector);
    }
}

class SelectorBuilder {

    private contextSelector?: string;


    constructor(private readonly baseSelector: string) {
    }

    in(name: string, type: SelectorType = SelectorType.COMPONENT, id?: string) {

        // create context selector
        const referenceId = id
            ? `${type}:${name}:${id}`
            : `${type}:${name}`;
        this.contextSelector = `[data-scene-ref="${referenceId}"]`;

        // return builder
        return this;
    }

    build(): string {

        // create base
        let selector = `css=${this.baseSelector}`;

        // add context (if available)
        if (this.contextSelector) {
            selector += this.contextSelector;
        }

        // return selector
        return selector;
    }
}
