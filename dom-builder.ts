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

        constructor(tagName: K) {
            this._tagName = tagName;
        }

        append(node: DomNode<any> | string) {
            if (typeof node === 'string') {
                node = text(node);
            }
            this._childs = this._childs || [];
            this._childs.push(node);
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
    }

    class DomAnchor extends DomElement<'a'> {
        constructor() {
            super('a');
        }

        href(value: string) {
            return this.attr('href', value);
        }
    }

    export function el<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        childs: (DomNode<any>|string)[]|string|null = null) {

        let de: DomElement<K>;
        switch (tagName.toLowerCase()) {
            case 'a':
                de = new DomAnchor();
                break;
            default:
                de = new DomElement(tagName);
                break
        }
        if (typeof childs === 'string') {
            de.append(childs);
        } else if (Array.isArray(childs)) {
            for (const n of childs) {
                de.append(n);
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

const db = DomBuilder;
db.el('p', [
    '12',
    db.el('p', 'p_value'),
    "11"
]).get();

