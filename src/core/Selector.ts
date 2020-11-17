// types

export enum SceneMarker {
    /**
     * An HTML element that represents a UI web flow.
     */
    FLOW = 'flow',

    /**
     * An HTML element that represents a logical web page.
     */
    PAGE = 'page',

    /**
     * An HTML element that represents a web component (interactive or non-interactive).
     */
    COMPONENT = 'comp',

    /**
     * An HTML element that represents an atomic web element / widget.
     */
    ELEMENT = 'elem'
}

// helper
export class Selector {

    private constructor() {
    }

    static for(name: string, type: SceneMarker = SceneMarker.COMPONENT, id?: string) {

        // create base selector
        let selector = `*[data-scene-${type}="${name}"]`;

        // add id selector if provided
        if (id) {
            selector += `[data-scene-id="${id}"]`;
        }

        // return selector
        return new SelectorBuilder(selector);
    }

    /**
     * Creates an HTML data attribute that is intended to be attached to an HTML element, thereby "tagging" it with metadata
     * to support automated testing using [Scene](https://github.com/nascentdigital/scene).
     *
     * @param name - An name of the flow / page / component / element.
     * @param [markerType] - The type of the marker (defaults to [component]{@link SceneMarker.COMPONENT}).
     * @param [id] - The identifier of the element (should be unique within its name + type).
     * @returns An attribute key / value that can be attached to an HTML element.
     */
    static createMarker(name: string, markerType = SceneMarker.COMPONENT, id?: string) {

        // create attributes
        const attributes: any = {};

        // apply marker (if not testing)
        attributes[`data-scene-${markerType}`] = name;
        if (id) {
            attributes['data-scene-id'] = id;
        }

        // return attributes
        return attributes;
    }

    /**
     * Creates an HTML data attribute that adds an attribute which identifies the parent that this component + element is
     * a part of.  This marker should be used in conjunction with {@link createSceneMarker}.
     *
     * @param {string} name - The name of the parent [component]{@link SceneMarker.COMPONENT} or
     *      [element]{@link SceneMarker.ELEMENT} that this HTML element belongs to.
     * @param {SceneMarker} [markerType] - The type of the parent (defaults to [component]{@link SceneMarker.COMPONENT}).
     * @param {SceneMarker} [id] - The identifier of the parent (should be unique within its name + type).
     * @returns {object} an attribute key / value that can be attached to an HTML element reference.
     */
    static createMarkerRef(name: string, markerType = SceneMarker.COMPONENT, id: string) {

        // create attributes
        const attributes: any = {};

        // apply marker (if not testing)
        attributes['data-scene-ref'] = id
            ? `${markerType}:${name}:${id}`
            : `${markerType}:${name}`;

        // return attributes
        return attributes;
    }
}

class SelectorBuilder {

    private contextSelector?: string;


    constructor(private readonly baseSelector: string) {
    }

    in(name: string, type: SceneMarker = SceneMarker.COMPONENT, id?: string) {

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
