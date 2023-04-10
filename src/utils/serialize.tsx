import {
    IS_BOLD,
    IS_CODE,
    IS_ITALIC,
    IS_STRIKETHROUGH, IS_SUBSCRIPT, IS_SUPERSCRIPT,
    IS_UNDERLINE
} from "../helpers/LexicalConstants";
import {
    isElementNode, isHeadingNode,
    isLineBreakNode,
    isLinkNode,
    isListItemNode,
    isListNode,
    isParagraphNode, isQuoteNode, isTextNode
} from "../helpers/nodeGuards";
import escapeHTML from 'escape-html';
import type {SerializedLexicalNode, SerializedRootNode, SerializedTextNode} from 'lexical';
import {cssToJSX} from "../helpers/cssToJSX";
import {Fragment} from "react";

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
export const serialize = (root: SerializedRootNode, theme: ThemeClasses = {}, config: Config = {}) => {
    const textNode = (node: SerializedTextNode) => {
        const text = escapeHTML(node.text)
        const style = cssToJSX(node.style)
        
        if (node.format & IS_BOLD) return <strong style={style} className={theme.text?.bold}>{text}</strong>
        if (node.format & IS_ITALIC) return <em style={style} className={theme.text?.italic}>{text}</em>
        if (node.format & IS_UNDERLINE) return <u style={style} className={theme.text?.underline}>{text}</u>
        if (node.format & IS_STRIKETHROUGH) return <s style={style} className={theme.text?.strikethrough}>{text}</s>
        if (node.format & IS_CODE) return <code style={style} className={theme.text?.code}>{text}</code>
        if (node.format & IS_SUBSCRIPT) return <sub style={style} className={theme.text?.subscript}>{text}</sub>
        if (node.format & IS_SUPERSCRIPT) return <sup style={style} className={theme.text?.superscript}>{text}</sup>
        return <span style={style} className={theme.text?.base}>{text}</span>
    }
    
    const miscNode = (node: SerializedLexicalNode) => {
        const children = serializeToJSX(node)
    
        if (isLineBreakNode(node)) return <br className={theme.linebreak}/>
        if (isParagraphNode(node)) return <p className={theme.paragraph}>{children}</p>
        if (isLinkNode(node)) return <a href={node.url} target={!config.openLinkInSameTab ? '_blank' : ''} className={theme.link}>{children}</a>
        if (isHeadingNode(node)) {
            switch (node.tag) {
                case "h1": return <h1 className={theme.heading?.h1}>{children}</h1>
                case "h2": return <h2 className={theme.heading?.h2}>{children}</h2>
                case "h3": return <h3 className={theme.heading?.h3}>{children}</h3>
                case "h4": return <h4 className={theme.heading?.h4}>{children}</h4>
                case "h5": return <h5 className={theme.heading?.h5}>{children}</h5>
                case "h6": return <h6 className={theme.heading?.h6}>{children}</h6>
            
            }
        }
        if (isListNode(node)) {
            switch (node.listType) {
                case "bullet": return <ul className={theme.list?.bullet}>{children}</ul>
                case "number": return <ol className={theme.list?.number}>{children}</ol>
                case "check": return <ul className={theme.list?.check}>{children}</ul> // Playground implementation
            }
        }
        if (isListItemNode(node)) return <li className={theme.list?.listitem}>{children}</li>
        if (isQuoteNode(node)) return <blockquote className={theme.quote}>{children}</blockquote>
        throw new Error(`Serializer: Node of type ${node.type} isn't implemented yet`)
    }
    
    const serializeToJSX = (node: SerializedLexicalNode): JSX.Element[] => {
        if (!isElementNode(node)) return [<></>]
        return node.children.map((node, key) => (
            <Fragment key={key}>
                {isTextNode(node) ? textNode(node) : miscNode(node)}
            </Fragment>
        ))
    }
    
    return serializeToJSX(root)
}