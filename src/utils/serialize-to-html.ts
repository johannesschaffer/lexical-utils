import {CreateEditorArgs, EditorThemeClasses} from "lexical";
import {createHeadlessEditor} from "@lexical/headless";
import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {ListItemNode, ListNode} from "@lexical/list";
import {$generateHtmlFromNodes} from "@lexical/html";
import {NonUndefined} from "utility-types";
import {AnchorHeadingNode} from "../nodes";

interface Nodes {
    disableReplacements?: {
        anchorHeading?: boolean
    },
    customNodes?: NonUndefined<CreateEditorArgs['nodes']>
}
/**
 * Uses the headless Lexical editor to serialize the HTML
 * Default nodes: Heading, List, ListItem, Quote
 * Replacements: Enabled by default, can be disabled indivudally*/
export const serializeToHTML = async (state: string, theme: EditorThemeClasses = {}, nodes: Nodes = {}) => {
    const editor = createHeadlessEditor({
        theme,
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            ...(nodes.disableReplacements?.anchorHeading ? [] : [
                AnchorHeadingNode,
                {
                    replace: HeadingNode,
                    with: (node: HeadingNode) => new AnchorHeadingNode(node.getTag())
                }
            ]),
            ...(nodes.customNodes ?? [])
        ]
    })
    editor.setEditorState(editor.parseEditorState(state))
    
    return await new Promise<string>(resolve => {
        editor.update(() => resolve(
            $generateHtmlFromNodes(editor)
        ))
    })
}