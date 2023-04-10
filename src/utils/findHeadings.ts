import type {SerializedTextNode, SerializedRootNode} from "lexical";
import type {SerializedHeadingNode} from "@lexical/rich-text";
import {isHeadingNode} from "../helpers/nodeGuards";

const getHeadingText = (heading: SerializedHeadingNode) => (
    // Multiple children when headings has multiple lines (Shift + Enter)
    (heading.children as SerializedTextNode[])
        .reduce((prev, curr) => prev + curr.text, '')
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