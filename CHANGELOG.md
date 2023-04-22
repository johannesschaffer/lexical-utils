# CHANGELOG

## v4.0.0
- feat!: serialize() - pass jsx element itself to onNode callback instead of its children
- feat!: inline config options
- feat!: serialize() - change params structure & export config interface
- feat!: serialize() - takes object as argument instead of multiple arguments
- feat: serialize() - add onNode param & improve null-safety
- feat: serialize() - option to pass custom elements
- fix: serialize() - make options parameter optional
- refactor: serialize() - textNode() - use switch instead of if
- refactor: serialize() - miscNode to elemNode
- refactor: serialize - use === instead of binary &
- build: add dev script
- docs: serialize()

## v3.3.0
- feat: add getText()

## v3.2.0
- feat: export ThemeClasses
- fix: don't use escapeHTML since it replaces apostrohpes

## v3.1.1
- fix: Link & AutoLink nodes: because of wrong typings I used .url instead of .attributes.url

## v3.1.0
- feat: add AutoLink node

## v3.0.1
- chore: add repository to package.json

## v3.0.0
- doc: add serialize() documentation
- feat!: change findHeadings() api & refine implementation & doc it
- feat!: improve getHeadingText()
- feat: export nodeGuards

## v2.0.0
- feat!: custom lexical serializer instead of using @lexical/headless, added README, added CHANGELOG, renamed files to camelcase

## v1.0.0
- feat: serializeToHTML(), findHeadings(), AnchorHeading