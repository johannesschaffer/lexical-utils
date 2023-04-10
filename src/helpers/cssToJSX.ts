// @ts-expect-error No ESM version
import camelcase from "camelcase";

export const cssToJSX = (css: string) => {
    const array = css
        .split(';')
        .filter(entries => !!entries)
        .map(entries => {
            const keyValue = entries.split(':').map(it => it.trimStart())
            const key = camelcase(keyValue[0])
            const value = keyValue[1]
            return {[key]: value}
        })
    return Object.assign({}, ...array)
}