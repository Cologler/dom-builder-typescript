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
        append(node: DomNode<any> | string): this;
        get(): DocumentFragment;
    }
    class DomElement<K extends keyof HTMLElementTagNameMap> implements DomNode<HTMLElementTagNameMap[K]> {
        private _tagName;
        private _id;
        private _classNames;
        private _childs;
        private _attrs;
        constructor(tagName: K);
        append(node: DomNode<any> | string): this;
        get(): HTMLElementTagNameMap[K];
        id(id: string): this;
        class(...classNames: string[]): this;
        attr(name: string, value: string): this;
    }
    function el<K extends keyof HTMLElementTagNameMap>(tagName: K, childs?: (DomNode<any> | string)[] | string | null): DomElement<K>;
    function text(value: string): DomText;
    function fragment(childs: (DomNode<any> | string)[]): DomFragment;
}
declare const db: typeof DomBuilder;
