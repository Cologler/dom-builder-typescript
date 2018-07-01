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
    class DomElement<K extends keyof HTMLElementTagNameMap> implements DomNode<HTMLElementTagNameMap[K]> {
        private _tagName;
        private _id;
        private _classNames;
        private _childs;
        private _attrs;
        private _listeners;
        constructor(tagName: K);
        append(...nodes: (DomNode<any> | string)[]): this;
        get(): HTMLElementTagNameMap[K];
        id(id: string): this;
        class(...classNames: string[]): this;
        attr(name: string, value: string): this;
        on(type: string, cb: EventListener): this;
        once(type: string, cb: EventListener): this;
    }
    class DomAnchor extends DomElement<'a'> {
        constructor();
        href(value: string): this;
    }
    class DomImage extends DomElement<'img'> {
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
    function el2<K extends keyof DomElementTagNameMap>(tagName: K, childs?: (DomNode<any> | string)[] | string | null): DomAnchor | DomImage;
    function el<K extends keyof HTMLElementTagNameMap>(tagName: K, childs?: (DomNode<any> | string)[] | string | null): DomElement<K>;
    function text(value: string): DomText;
    function fragment(childs?: (DomNode<any> | string)[] | null): DomFragment;
}
