import type {SerializedRootNode} from "lexical";
import type {SerializedHeadingNode} from "@lexical/rich-text";
import {isHeadingNode, isTextNode} from "./nodeGuards";

const getHeadingText = (heading: SerializedHeadingNode) => (
    // Multiple children when headings has multiple lines (Shift + Enter)
    heading.children.reduce((text, node) => {
        if (isTextNode(node)) return text + node.text
        throw new Error(`Find headings: Node of type ${node.type} isn't yet supported as a child of a heading`)
    }, '')
)

/**
 * @return List of all heading texts, matching the specified tag*/
export const findHeadings = (root: SerializedRootNode, tag: SerializedHeadingNode['tag'] = 'h1') => (
    root.children
        .map(node =>
            isHeadingNode(node) &&
            node.tag == tag &&
            getHeadingText(node)
        )
        .filter(entry => !!entry)
)