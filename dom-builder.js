"use strict";
var DomBuilder;
(function (DomBuilder) {
    const _EmptyArray = [];
    class DomText {
        constructor(text) {
            this._text = text;
        }
        get() {
            const tn = document.createTextNode(this._text);
            return tn;
        }
    }
    class DomFragment {
        constructor() {
            this._childs = [];
        }
        append(node) {
            if (typeof node === 'string') {
                node = text(node);
            }
            this._childs.push(node);
            return this;
        }
        get() {
            const df = document.createDocumentFragment();
            for (const n of this._childs) {
                df.appendChild(n.get());
            }
            return df;
        }
    }
    class DomElement {
        constructor(tagName) {
            this._tagName = tagName;
        }
        append(node) {
            if (typeof node === 'string') {
                node = text(node);
            }
            this._childs = this._childs || [];
            this._childs.push(node);
            return this;
        }
        get() {
            const el = document.createElement(this._tagName);
            if (this._id !== undefined) {
                el.id = this._id;
            }
            if (this._classNames) {
                el.classList.add(...this._classNames);
            }
            for (const n of this._childs || _EmptyArray) {
                el.appendChild(n.get());
            }
            for (const attr of this._attrs || _EmptyArray) {
                el.setAttribute(attr.name, attr.value);
            }
            if (this._listeners) {
                for (const listener of this._listeners) {
                    if (listener.once) {
                        const cb = function (...args) {
                            el.removeEventListener(listener.type, cb);
                            listener.cb.apply(this, args);
                        };
                        el.addEventListener(listener.type, cb);
                    }
                    else {
                        el.addEventListener(listener.type, listener.cb);
                    }
                }
            }
            return el;
        }
        id(id) {
            this._id = id;
            return this;
        }
        class(...classNames) {
            (this._classNames = this._classNames || []).push(...classNames);
            return this;
        }
        attr(name, value) {
            (this._attrs = this._attrs || []).push({ name, value });
            return this;
        }
        on(type, cb) {
            (this._listeners = this._listeners || []).push({ type, cb, once: false });
            return this;
        }
        once(type, cb) {
            (this._listeners = this._listeners || []).push({ type, cb, once: true });
            return this;
        }
    }
    class DomAnchor extends DomElement {
        constructor() {
            super('a');
        }
        href(value) {
            return this.attr('href', value);
        }
    }
    function el(tagName, childs = null) {
        let de;
        switch (tagName.toLowerCase()) {
            case 'a':
                de = new DomAnchor();
                break;
            default:
                de = new DomElement(tagName);
                break;
        }
        if (typeof childs === 'string') {
            de.append(childs);
        }
        else if (Array.isArray(childs)) {
            for (const n of childs) {
                de.append(n);
            }
        }
        return de;
    }
    DomBuilder.el = el;
    function text(value) {
        const dn = new DomText(value);
        return dn;
    }
    DomBuilder.text = text;
    function fragment(childs) {
        const df = new DomFragment();
        for (const n of childs) {
            df.append(n);
        }
        return df;
    }
    DomBuilder.fragment = fragment;
})(DomBuilder || (DomBuilder = {}));
const db = DomBuilder;
db.el('p', [
    '12',
    db.el('p', 'p_value'),
    "11"
]).get();
