declare namespace DomBuilder {
    interface DomNode<T extends Node> {
        get(): T;
    }
    class DomText implements DomNode<Text> {
        private _text;
        constructor(text: string);
        get(): Text;
    }
    class DomFragment implements DomNode<DocumentFragment> {
        private _childs;
        append(...nodes: (DomNode<any> | string)[]): this;
        get(): DocumentFragment;
    }
    interface ElementOptions {
        id?: string;
        class?: string[] | string;
        attrs?: {
            [attr: string]: string;
        };
        on?: {
            [type: string]: EventListener | EventListener[];
        };
        once?: {
            [type: string]: EventListener | EventListener[];
        };
    }
    class DomElement<E extends HTMLElement> implements DomNode<E> {
        private _tagName;
        private _id;
        private _classNames;
        private _childs;
        private _attrs;
        private _listeners;
        constructor(tagName: string);
        loadOptions(options: ElementOptions): this;
        append(...nodes: (DomNode<any> | string)[]): this;
        get(): E;
        /**
         * set id of element.
         *
         * @param {string} id
         * @returns
         * @memberof DomElement
         */
        id(id: string): this;
        /**
         * set class of element.
         *
         * @param {...string[]} classNames
         * @returns
         * @memberof DomElement
         */
        class(...classNames: string[]): this;
        /**
         * set attr of element.
         *
         * @param {string} name
         * @param {string} value
         * @returns
         * @memberof DomElement
         */
        attr(name: string, value: string): this;
        on(type: string, cb: EventListener): this;
        once(type: string, cb: EventListener): this;
    }
    class DomAnchor extends DomElement<HTMLAnchorElement> {
        constructor();
        href(value: string): this;
    }
    class DomImage extends DomElement<HTMLImageElement> {
        constructor();
        src(value: string): this;
        alt(value: string): this;
    }
    const DomElementTagNameMap: {
        'a': typeof DomAnchor;
        'img': typeof DomImage;
    };
    interface DomElementTagNameMap {
        'a': DomAnchor;
        'img': DomImage;
    }
    function el2<K extends keyof DomElementTagNameMap>(tagName: K): DomElementTagNameMap[K];
    function el2<K extends keyof DomElementTagNameMap>(tagName: K, options: ElementOptions | null): DomElementTagNameMap[K];
    function el2<K extends keyof DomElementTagNameMap>(tagName: K, childs: (DomNode<any> | string)[] | string): DomElementTagNameMap[K];
    function el2<K extends keyof DomElementTagNameMap>(tagName: K, options: ElementOptions, childs: (DomNode<any> | string)[] | string): DomElementTagNameMap[K];
    function el<K extends keyof HTMLElementTagNameMap>(tagName: K): DomElement<HTMLElementTagNameMap[K]>;
    function el<K extends keyof HTMLElementTagNameMap>(tagName: K, options: ElementOptions | null): DomElement<HTMLElementTagNameMap[K]>;
    function el<K extends keyof HTMLElementTagNameMap>(tagName: K, childs: (DomNode<any> | string)[] | string): DomElement<HTMLElementTagNameMap[K]>;
    function el<K extends keyof HTMLElementTagNameMap>(tagName: K, options: ElementOptions, childs: (DomNode<any> | string)[] | string): DomElement<HTMLElementTagNameMap[K]>;
    function text(value: string): DomText;
    function fragment(childs?: (DomNode<any> | string)[] | null): DomFragment;
}
