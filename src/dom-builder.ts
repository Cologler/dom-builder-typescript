namespace DomBuilder {

    interface DomNode<T extends Node> {
        get(): T;
    }

    const _EmptyArray: any[] = [];

    class DomText implements DomNode<Text> {
        private _text: string;

        constructor(text: string) {
            this._text = text;
        }

        get() {
            const tn = document.createTextNode(this._text);
            return tn;
        }
    }

    class DomFragment implements DomNode<DocumentFragment> {
        private _childs: DomNode<any>[] = [];

        append(...nodes: (DomNode<any> | string)[]) {
            for (let node of nodes) {
                if (typeof node === 'string') {
                    node = text(node);
                }
                this._childs.push(node);
            }
            return this;
        }

        get(): DocumentFragment {
            const df = document.createDocumentFragment();
            for (const n of this._childs) {
                df.appendChild(n.get());
            }
            return df;
        }
    }

    interface ElementOptions {
        id?: string,
        class?: string[]|string,
        attrs?: { [attr: string]: string }
        on?: { [type: string]: EventListener|EventListener[] },
        once?: { [type: string]: EventListener|EventListener[] },
    }

    interface Listener {
        type: string;
        cb: EventListener;
        options?: boolean | AddEventListenerOptions;
    }

    class DomElement<E extends HTMLElement> implements DomNode<E> {
        private _tagName: string;
        private _id?: string;
        private _classNames?: string[];
        private _childs?: DomNode<any>[];
        private _attrs?: ({name: string, value: string})[];
        private _listeners?: Listener[];

        constructor(tagName: string) {
            this._tagName = tagName;
        }

        loadOptions(options: ElementOptions) {
            if (options.id) {
                this.id(options.id);
            }
            if (options.class) {
                if (typeof options.class === 'string') {
                    this.class(options.class);
                } else {
                    this.class(...options.class);
                }
            }
            if (options.attrs) {
                for (const attr in options.attrs) {
                    this.attr(attr, options.attrs[attr])
                }
            }
            if (options.on) {
                for (const type in options.on) {
                    const val = options.on[type];
                    if (Array.isArray(val)) {
                        for (const cb of val) {
                            this.on(type, cb);
                        }
                    } else {
                        this.on(type, val);
                    }
                }
            }
            if (options.once) {
                for (const type in options.once) {
                    const val = options.once[type];
                    if (Array.isArray(val)) {
                        for (const cb of val) {
                            this.once(type, cb);
                        }
                    } else {
                        this.once(type, val);
                    }
                }
            }
            return this;
        }

        append(...nodes: (DomNode<any> | string)[]) {
            this._childs = this._childs || [];
            for (let node of nodes) {
                if (typeof node === 'string') {
                    node = text(node);
                }
                this._childs.push(node);
            }
            return this;
        }

        get(): E {
            const el = document.createElement(this._tagName);
            if (this._id !== undefined) {
                el.id = this._id;
            }
            if (this._classNames) {
                el.classList.add(...this._classNames);
            }
            for (const n of this._childs || _EmptyArray as DomNode<any>[]) {
                el.appendChild(n.get());
            }
            for (const attr of this._attrs || _EmptyArray as ({name: string, value: string})[]) {
                el.setAttribute(attr.name, attr.value);
            }
            if (this._listeners) {
                for (const listener of this._listeners) {
                    el.addEventListener(listener.type, listener.cb, listener.options);
                }
            }
            return el as E;
        }

        /**
         * set id of element.
         *
         * @param {string} id
         * @returns
         * @memberof DomElement
         */
        id(id: string) {
            this._id = id;
            return this;
        }

        /**
         * set class of element.
         *
         * @param {...string[]} classNames
         * @returns
         * @memberof DomElement
         */
        class(...classNames: string[]) {
            (this._classNames = this._classNames || []).push(...classNames);
            return this;
        }

        /**
         * set attr of element.
         *
         * @param {string} name
         * @param {string} value
         * @returns
         * @memberof DomElement
         */
        attr(name: string, value: string) {
            (this._attrs = this._attrs || []).push({ name, value });
            return this;
        }

        on(type: string, cb: EventListener) {
            return this.addListener(type, cb, { once: false });
        }

        once(type: string, cb: EventListener) {
            return this.addListener(type, cb, { once: true });
        }

        addListener(type: string, cb: EventListener, options: AddEventListenerOptions) {
            (this._listeners = this._listeners || []).push({
                type, cb, options: options
            });
            return this;
        }
    }

    class DomAnchor extends DomElement<HTMLAnchorElement> {
        constructor() {
            super('a');
        }

        href(value: string) {
            return this.attr('href', value);
        }
    }

    class DomImage extends DomElement<HTMLImageElement> {
        constructor() {
            super('img');
        }

        src(value: string) {
            return this.attr('src', value);
        }

        alt(value: string) {
            return this.attr('alt', value);
        }
    }

    const DomElementTagNameMap = {
        'a': DomAnchor,
        'img': DomImage,
    };

    interface DomElementTagNameMap {
        'a': DomAnchor,
        'img': DomImage,
    }

    function make<E extends HTMLElement, D extends DomElement<E>>(de: D): D;
    function make<E extends HTMLElement, D extends DomElement<E>>(de: D,
        options: ElementOptions): D;
    function make<E extends HTMLElement, D extends DomElement<E>>(de: D,
        childs: (DomNode<any>|string)[]|string): D;
    function make<E extends HTMLElement, D extends DomElement<E>>(de: D,
        options: ElementOptions, childs: (DomNode<any>|string)[]|string): D;
    function make<E extends HTMLElement, D extends DomElement<E>>(de: D,
        arg1?: ElementOptions|(DomNode<any>|string)[]|string, arg2?: (DomNode<any>|string)[]|string
    ) {
        let options: ElementOptions|undefined;
        let childs: (DomNode<any>|string)[]|string|undefined;

        if (typeof arg1 === 'object') {
            if (Array.isArray(arg1)) {
                childs = arg1;
            } else {
                options = arg1;
                if (arg2) {
                    childs = arg2;
                }
            }
        } else if (typeof arg1 === 'string') {
            childs = arg1;
        }

        if (options) {
            de.loadOptions(options);
        }

        if (childs) {
            if (typeof childs === 'string') {
                de.append(childs);
            } else {
                de.append(...childs);
            }
        }

        return de;
    }

    export function el2<K extends keyof DomElementTagNameMap>(tagName: K) : DomElementTagNameMap[K];
    export function el2<K extends keyof DomElementTagNameMap>(tagName: K,
        options: ElementOptions|null) : DomElementTagNameMap[K];
    export function el2<K extends keyof DomElementTagNameMap>(tagName: K,
        childs: (DomNode<any>|string)[]|string) : DomElementTagNameMap[K];
    export function el2<K extends keyof DomElementTagNameMap>(tagName: K,
        options: ElementOptions, childs: (DomNode<any>|string)[]|string) : DomElementTagNameMap[K];

    export function el2<K extends keyof DomElementTagNameMap>(
        tagName: K, arg1?: any, arg2?: any) : DomElementTagNameMap[K] {
        const de = new DomElementTagNameMap[tagName]();
        return make(de, arg1, arg2);
    }

    export function el<K extends keyof HTMLElementTagNameMap>(tagName: K): DomElement<HTMLElementTagNameMap[K]>;
    export function el<K extends keyof HTMLElementTagNameMap>(tagName: K,
        options: ElementOptions|null) : DomElement<HTMLElementTagNameMap[K]>;
    export function el<K extends keyof HTMLElementTagNameMap>(tagName: K,
        childs: (DomNode<any>|string)[]|string) : DomElement<HTMLElementTagNameMap[K]>;
    export function el<K extends keyof HTMLElementTagNameMap>(tagName: K,
        options: ElementOptions, childs: (DomNode<any>|string)[]|string) : DomElement<HTMLElementTagNameMap[K]>;

    export function el<E extends HTMLElement>(tagName: string): DomElement<E>;
    export function el<E extends HTMLElement>(tagName: string,
        options: ElementOptions|null) : DomElement<E>;
    export function el<E extends HTMLElement>(tagName: string,
        childs: (DomNode<any>|string)[]|string) : DomElement<E>;
    export function el<E extends HTMLElement>(tagName: string,
        options: ElementOptions, childs: (DomNode<any>|string)[]|string) : DomElement<E>;

    export function el<E extends HTMLElement>(tagName: string, arg1?: any, arg2?: any) : DomElement<E> {
        const de = new DomElement<E>(tagName);
        return make(de, arg1, arg2);
    }

    export function text(value: string) {
        const dn = new DomText(value);
        return dn;
    }

    export function fragment(childs?: (DomNode<any>|string)[]) {
        const df = new DomFragment();
        childs && df.append(...childs);
        return df;
    }
}
