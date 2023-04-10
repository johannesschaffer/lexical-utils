import type {
    SerializedElementNode,
    SerializedLexicalNode,
    SerializedLineBreakNode,
    SerializedParagraphNode,
    SerializedTextNode
} from "lexical";
import type {SerializedLinkNode} from "@lexical/link";
import type {SerializedListItemNode, SerializedListNode} from "@lexical/list";
import type {SerializedHeadingNode, SerializedQuoteNode} from "@lexical/rich-text";

export const isElementNode = (node: SerializedLexicalNode & {children?: SerializedLexicalNode[]}): node is SerializedElementNode => !!node?.children

export const isTextNode = (node: SerializedLexicalNode): node is SerializedTextNode => node.type == 'text'
export const isParagraphNode = (node: SerializedLexicalNode): node is SerializedParagraphNode => node.type == 'paragraph'
export const isLineBreakNode = (node: SerializedLexicalNode): node is SerializedLineBreakNode => node.type == 'linebreak'
export const isLinkNode = (node: SerializedLexicalNode): node is SerializedLinkNode => node.type == 'link'
export const isListNode = (node: SerializedLexicalNode): node is SerializedListNode => node.type == 'list'
export const isListItemNode = (node: SerializedLexicalNode): node is SerializedListItemNode => node.type == 'listitem'
export const isHeadingNode = (node: SerializedLexicalNode): node is SerializedHeadingNode => node.type == 'heading'
export const isQuoteNode = (node: SerializedLexicalNode): node is SerializedQuoteNode => node.type == 'quote'