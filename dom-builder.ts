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

        append(node: DomNode<any> | string) {
            if (typeof node === 'string') {
                node = text(node);
            }
            this._childs.push(node);
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

    class DomElement<K extends keyof HTMLElementTagNameMap> implements DomNode<HTMLElementTagNameMap[K]> {
        private _tagName: string;
        private _id: string|undefined;
        private _classNames: string[]|undefined;
        private _childs: DomNode<any>[]|undefined;
        private _attrs: ({name: string, value: string})[]|undefined;
        private _listeners: { type: string, cb: EventListener, once: boolean }[]|undefined;

        constructor(tagName: K) {
            this._tagName = tagName;
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

        get(): HTMLElementTagNameMap[K] {
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
                    if (listener.once) {
                        const cb = function(this: any, ...args: any[]) {
                            el.removeEventListener(listener.type, cb);
                            listener.cb.apply(this, args);
                        }
                        el.addEventListener(listener.type, cb);
                    } else {
                        el.addEventListener(listener.type, listener.cb);
                    }
                }
            }
            return el;
        }

        id(id: string) {
            this._id = id;
            return this;
        }

        class(...classNames: string[]) {
            (this._classNames = this._classNames || []).push(...classNames);
            return this;
        }

        attr(name: string, value: string) {
            (this._attrs = this._attrs || []).push({ name, value });
            return this;
        }

        on(type: string, cb: EventListener) {
            (this._listeners = this._listeners || []).push({ type, cb, once: false });
            return this;
        }

        once(type: string, cb: EventListener) {
            (this._listeners = this._listeners || []).push({ type, cb, once: true });
            return this;
        }
    }

    class DomAnchor extends DomElement<'a'> {
        constructor() {
            super('a');
        }

        href(value: string) {
            return this.attr('href', value);
        }
    }

    class DomImage extends DomElement<'img'> {
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

    export function el2<K extends keyof DomElementTagNameMap>(
        tagName: K,
        childs: (DomNode<any>|string)[]|string|null = null) {

        const de = new DomElementTagNameMap[tagName]();
        if (childs) {
            if (typeof childs === 'string') {
                de.append(childs);
            } else {
                de.append(...childs);
            }
        }
        return de;
    }

    export function el<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        childs: (DomNode<any>|string)[]|string|null = null) {

        const de = new DomElement(tagName);
        if (childs) {
            if (typeof childs === 'string') {
                de.append(childs);
            } else {
                de.append(...childs);
            }
        }
        return de;
    }

    export function text(value: string) {
        const dn = new DomText(value);
        return dn;
    }

    export function fragment(childs: (DomNode<any>|string)[]) {
        const df = new DomFragment();
        for (const n of childs) {
            df.append(n);
        }
        return df;
    }
}
