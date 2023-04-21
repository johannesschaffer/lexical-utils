import {
    IS_BOLD,
    IS_CODE,
    IS_ITALIC,
    IS_STRIKETHROUGH, IS_SUBSCRIPT, IS_SUPERSCRIPT,
    IS_UNDERLINE
} from "../helpers/LexicalConstants";
import {
    isAutoLinkNode,
    isElementNode, isHeadingNode,
    isLineBreakNode,
    isLinkNode,
    isListItemNode,
    isListNode,
    isParagraphNode, isQuoteNode, isTextNode
} from "./nodeGuards";
import type {SerializedLexicalNode, SerializedRootNode, SerializedTextNode} from 'lexical';
import {cssToJSX} from "../helpers/cssToJSX";
import {ComponentType, createElement, CSSProperties, Fragment, ReactNode} from "react";

// Inspired by EditorThemeClasses from lexical -> Potentially easier to migrate to lexical/headless serializer
// Based on Lexical Node types rather than HTML tags
export interface ThemeClasses {
    text?: {
        base?: string
        bold?: string
        italic?: string
        underline?: string
        strikethrough?: string
        code?: string
        subscript?: string
        superscript?: string
    }
    linebreak?: string
    paragraph?: string
    link?: string
    heading?: {
        h1?: string
        h2?: string
        h3?: string
        h4?: string
        h5?: string
        h6?: string
    }
    list?: {
        bullet?: string
        number?: string
        check?: string
        listitem?: string
    }
    quote?: string
}

interface Config {
    openLinkInSameTab?: boolean
}

interface ElemProps {children?: ReactNode, className?: string | undefined}
interface TextElemProps extends ElemProps {style?: CSSProperties}
interface LinkProps extends ElemProps {href: string, target?: string}
// Same names as ThemeConfig
interface Elems {
    Base?: ComponentType<TextElemProps>
    Bold?: ComponentType<TextElemProps>
    Italic?: ComponentType<TextElemProps>
    Underline?: ComponentType<TextElemProps>
    Strikethrough?: ComponentType<TextElemProps>
    Code?: ComponentType<TextElemProps>
    Subscript?: ComponentType<TextElemProps>
    Superscript?: ComponentType<TextElemProps>
    LineBreak?: ComponentType<ElemProps>
    Paragraph?: ComponentType<ElemProps>
    Link?: ComponentType<LinkProps>
    H1?: ComponentType<ElemProps>
    H2?: ComponentType<ElemProps>
    H3?: ComponentType<ElemProps>
    H4?: ComponentType<ElemProps>
    H5?: ComponentType<ElemProps>
    H6?: ComponentType<ElemProps>
    BulletList?: ComponentType<ElemProps>
    NumberList?: ComponentType<ElemProps>
    CheckList?: ComponentType<ElemProps>
    ListItem?: ComponentType<ElemProps>
    Quote?: ComponentType<ElemProps>
}

interface Props {
    root: SerializedRootNode
    theme?: ThemeClasses
    config?: Config
    elems?: Elems
}
/**
 * Serialize the lexical editor state to JSX
 * @param root The root node of the editor state. A Javascript object, not stringified JSON
 * @param theme CSS classes - Multiple classes can be supplied (e.g. to use Tailwind)
 * @param config Options by default falsy
 * @param elems*/
export const serialize = ({root, theme = {}, config = {}, elems = {}}: Props) => {
    const textNode = (node: SerializedTextNode) => {
        const children = node.text
        const style = cssToJSX(node.style) // color, background-color, font-size
        
        switch (node.format) {
            case IS_BOLD: return createElement(elems.Bold ?? "strong", {children, style, className: theme.text?.bold})
            case IS_ITALIC: return createElement(elems.Italic ?? "em", {children, style, className: theme.text?.italic})
            case IS_UNDERLINE: return createElement(elems.Underline ?? "u", {children, style, className: theme.text?.underline})
            case IS_STRIKETHROUGH: return createElement(elems.Strikethrough ?? "s", {children, style, className: theme.text?.strikethrough})
            case IS_CODE: return createElement(elems.Code ?? "code", {children, style, className: theme.text?.code})
            case IS_SUBSCRIPT: return createElement(elems.Subscript ?? "sub", {children, style, className: theme.text?.subscript})
            case IS_SUPERSCRIPT: return createElement(elems.Superscript ?? "sup", {children, style, className: theme.text?.superscript})
            default: return createElement(elems.Base ?? "span", {children, style, className: theme.text?.base})
        }
    }
    
    const elemNode = (node: SerializedLexicalNode) => {
        const children = serializeToJSX(node)
    
        if (isLineBreakNode(node)) return createElement(elems.LineBreak ?? "br", {className: theme.linebreak})
        if (isParagraphNode(node)) return createElement(elems.Paragraph ?? "p", {children, className: theme.paragraph})
        // TODO: Lexicals typings are wrong for link. It's .attributes.url, not just .url
        if (isLinkNode(node) || isAutoLinkNode(node)) return createElement(elems.Link ?? "a", {children, className: theme.link, href: (node as any).attributes.url, target: !config.openLinkInSameTab ? '_blank' : ''})
        if (isHeadingNode(node)) {
            switch (node.tag) {
                case "h1": return createElement(elems.H1 ?? 'h1', {children, className: theme.heading?.h1})
                case "h2": return createElement(elems.H2 ?? 'h2', {children, className: theme.heading?.h2})
                case "h3": return createElement(elems.H3 ?? 'h3', {children, className: theme.heading?.h3})
                case "h4": return createElement(elems.H4 ?? 'h4', {children, className: theme.heading?.h4})
                case "h5": return createElement(elems.H5 ?? 'h5', {children, className: theme.heading?.h5})
                case "h6": return createElement(elems.H6 ?? 'h6', {children, className: theme.heading?.h6})
            }
        }
        if (isListNode(node)) {
            switch (node.listType) {
                case "bullet": return createElement(elems.BulletList ?? "ul", {children, className: theme.list?.bullet})
                case "number": return createElement(elems.NumberList ?? "ol", {children, className: theme.list?.number})
                case "check": return createElement(elems.CheckList ?? "ul", {children, className: theme.list?.check}) // Playground implementation
            }
        }
        if (isListItemNode(node)) return createElement(elems.ListItem ?? "li", {children, className: theme.list?.listitem})
        if (isQuoteNode(node)) return createElement(elems.Quote ?? '"blockquote', {children, className: theme.quote})
        throw new Error(`Serializer: Node of type ${node.type} isn't implemented yet`)
    }
    
    const serializeToJSX = (node: SerializedLexicalNode): JSX.Element[] => {
        if (!isElementNode(node)) return [<></>]
        return node.children.map((node, key) => (
            <Fragment key={key}>
                {isTextNode(node) ? textNode(node) : elemNode(node)}
            </Fragment>
        ))
    }
    
    return serializeToJSX(root)
}