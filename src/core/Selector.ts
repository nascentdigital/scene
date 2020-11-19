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

export interface ISelectable {
    dataAttributes: Record<string, string>;
    querySelector: string;
}
export type ISelectableKeys = keyof ISelectable;
export type ISelectableMap<T extends string> = Omit<Record<T, ISelectable>, ISelectableKeys>;


// builder
export class Selector<T extends string> implements ISelectable {

    static forPage(name: string, id?: string) {
        return new Selector(SceneMarker.PAGE, name, id);
    }

    static forComponent(name: string, id?: string) {
        return new Selector(SceneMarker.COMPONENT, name, id);
    }


    public readonly dataAttributes: Record<string, string>;
    public readonly querySelector: string;


    private constructor(
        private readonly type: SceneMarker,
        private readonly name: string,
        private readonly id?: string,
        public children: ISelectableMap<T> = {} as ISelectableMap<T>) {

        // initialize instance variables
        const { dataAttributes, querySelector } = Selector.createSelectable(type, name, id);
        this.dataAttributes = dataAttributes;
        this.querySelector = querySelector;
    }

    public withComponent<K extends string>(name: string, id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.COMPONENT, name, id);
    }

    public withButton<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "Button", id);
    }

    public withCheckbox<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "Checkbox", id);
    }

    public withTextField<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "TextField", id);
    }

    public withRadioButton<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "RadioButton", id);
    }

    public withLabel<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "Label", id);
    }

    public withText<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "Text", id, css);
    }

    public withImage<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "Image", id);
    }

    public withLink<K extends string>(id: K, css?: string): Selector<T | K> {
        return this.withChild(SceneMarker.ELEMENT, "Link", id);
    }

    public withChild<K extends string>(type: SceneMarker, name: string, id: K, css?: string): Selector<T | K> {

        // merge children
        Object.assign(
            this.children,
            { [id]: Selector.createSelectable(type, name, id, css, this) } as ISelectableMap<K>
        );

        // chain
        return this as Selector<T | K>;
    }

    private static createSelectable(type: SceneMarker, name: string, id?: string, css?: string, parent?: Selector<string>): ISelectable {

        // initialize data attributes
        const dataAttributes: Record<string, string> = {
            [`data-scene-${type}`]: name
        }

        // initialize query selector
        let querySelector = `css=*[data-scene-${type}="${name}"]`;

        // bind id, if provided
        if (id) {
            dataAttributes[`data-scene-id`] = id;
            querySelector += `[data-scene-id="${id}"]`;
        }

        // bind parent, if provided
        if (parent) {
            const parentIdentifier = parent.id
                ? `${parent.type}:${parent.name}:${parent.id}`
                : `${parent.type}:${parent.name}`;
            dataAttributes[`data-scene-ref`] = parentIdentifier;
            querySelector += `[data-scene-ref="${parentIdentifier}"]`;
        }

        // add additional CSS if any
        if (css) {
            querySelector += css
        }

        // return selectable
        return { dataAttributes, querySelector };
    }
}
