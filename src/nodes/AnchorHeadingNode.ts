import {HeadingNode, SerializedHeadingNode} from "@lexical/rich-text";
import {EditorConfig} from "lexical";
import {slugify} from "@johannesschaffer/utils/net"

export class AnchorHeadingNode extends HeadingNode {
    static getType() {
        return 'anchor-heading';
    }
    
    static clone(node: HeadingNode) {
        return HeadingNode.clone(node)
    }
    
    static importJSON(serializedNode: SerializedHeadingNode) {
        return HeadingNode.importJSON(serializedNode)
    }
    
    createDOM(config: EditorConfig): HTMLElement {
        const element = super.createDOM(config)
        this.setId(element)
        return element
    }
    
    updateDOM(prevNode: HeadingNode, dom: HTMLElement): boolean {
        this.setId(dom)
        return false
    }
    
    exportJSON() {
        return super.exportJSON()
    }
    
    private setId(elem: HTMLElement) {
        const text = this
            .getAllTextNodes()
            .reduce((prev, curr) => prev + curr.getTextContent(), '')
        elem.setAttribute('id', slugify(text))
    }
}