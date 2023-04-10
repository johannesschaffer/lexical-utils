import {SerializedEditorState, SerializedTextNode} from "lexical";
import {SerializedHeadingNode} from "@lexical/rich-text";

const getHeadingText = (heading: SerializedHeadingNode) => (
    // Multiple children when headings has multiple lines (Shift + Enter)
    (heading.children as SerializedTextNode[])
        .reduce((prev, curr) => prev + curr.text, '')
)

export const findHeadings = (state: string, tag: SerializedHeadingNode['tag'] = 'h1') => {
    const serialized: SerializedEditorState = JSON.parse(state)
    return serialized.root.children.map(child => {
        if (child.type == 'heading' && (child as SerializedHeadingNode).tag == tag) {
            return getHeadingText(child as SerializedHeadingNode)
        }
    }).filter(entry => !!entry)
}