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
        append(...nodes) {
            for (let node of nodes) {
                if (typeof node === 'string') {
                    node = text(node);
                }
                this._childs.push(node);
            }
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
        loadOptions(options) {
            if (options.id) {
                this.id(options.id);
            }
            if (options.class) {
                if (typeof options.class === 'string') {
                    this.class(options.class);
                }
                else {
                    this.class(...options.class);
                }
            }
            if (options.attrs) {
                for (const attr in options.attrs) {
                    this.attr(attr, options.attrs[attr]);
                }
            }
            if (options.on) {
                for (const type in options.on) {
                    const val = options.on[type];
                    if (Array.isArray(val)) {
                        for (const cb of val) {
                            this.on(type, cb);
                        }
                    }
                    else {
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
                    }
                    else {
                        this.once(type, val);
                    }
                }
            }
            return this;
        }
        append(...nodes) {
            this._childs = this._childs || [];
            for (let node of nodes) {
                if (typeof node === 'string') {
                    node = text(node);
                }
                this._childs.push(node);
            }
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
                    el.addEventListener(listener.type, listener.cb, listener.options);
                }
            }
            return el;
        }
        /**
         * set id of element.
         *
         * @param {string} id
         * @returns
         * @memberof DomElement
         */
        id(id) {
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
        class(...classNames) {
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
        attr(name, value) {
            (this._attrs = this._attrs || []).push({ name, value });
            return this;
        }
        on(type, cb) {
            return this.addListener(type, cb, { once: false });
        }
        once(type, cb) {
            return this.addListener(type, cb, { once: true });
        }
        addListener(type, cb, options) {
            (this._listeners = this._listeners || []).push({
                type, cb, options: options
            });
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
    class DomImage extends DomElement {
        constructor() {
            super('img');
        }
        src(value) {
            return this.attr('src', value);
        }
        alt(value) {
            return this.attr('alt', value);
        }
    }
    const DomElementTagNameMap = {
        'a': DomAnchor,
        'img': DomImage,
    };
    function make(de, arg1, arg2) {
        let options;
        let childs;
        if (typeof arg1 === 'object') {
            if (Array.isArray(arg1)) {
                childs = arg1;
            }
            else {
                options = arg1;
                if (arg2) {
                    childs = arg2;
                }
            }
        }
        else if (typeof arg1 === 'string') {
            childs = arg1;
        }
        if (options) {
            de.loadOptions(options);
        }
        if (childs) {
            if (typeof childs === 'string') {
                de.append(childs);
            }
            else {
                de.append(...childs);
            }
        }
        return de;
    }
    function el2(tagName, arg1, arg2) {
        const de = new DomElementTagNameMap[tagName]();
        return make(de, arg1, arg2);
    }
    DomBuilder.el2 = el2;
    function el(tagName, arg1, arg2) {
        const de = new DomElement(tagName);
        return make(de, arg1, arg2);
    }
    DomBuilder.el = el;
    function text(value) {
        const dn = new DomText(value);
        return dn;
    }
    DomBuilder.text = text;
    function fragment(childs = null) {
        const df = new DomFragment();
        childs && df.append(...childs);
        return df;
    }
    DomBuilder.fragment = fragment;
})(DomBuilder || (DomBuilder = {}));
