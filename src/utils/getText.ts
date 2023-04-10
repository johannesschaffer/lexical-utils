import {isElementNode, isTextNode} from "./nodeGuards";
import {SerializedLexicalNode} from "lexical";

export const getText = (node: SerializedLexicalNode): string => {
    if (!isElementNode(node)) return ''
    return node.children
        .map(node => isTextNode(node) ? node.text : getText(node))
        .join(' ')
}