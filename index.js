var _ = require('lodash')
var markdownToAST = require('markdown-to-ast').parse
var escapeHTML = require('escape-html')

module.exports = function convert (example) {
  var ast = markdownToAST(example)
  return parseNode(ast)
}

function mapParseNode (children) {
  return _.chain(children).map(parseNode).join('').value()
}

function parseNode (node) {
  switch (node.type) {
    case 'Str':
      return '<span class="string">' + escapeHTML(node.value) + '</span>'
    case 'Image':
      return '<img class="image" src="' + escapeHTML(node.url) + '" />'
    case 'Emphasis':
      return '<span class="category-symbol">' + mapParseNode(node.children) + '</span>'
    // case 'Strong':
    //   return '<span class="placeholder ">' + mapParseNode(node.children) + '</span>'
    case 'Link':
      const urlClass = escapeHTML(_.kebabCase(node.url))
      if (node.children.length) {
        return (
          '<span class="argumentSegment argument-' + urlClass + '">' + 
            '<span class="argument">' + escapeHTML(node.url) + '</span>' +
            '<span class="content">' + mapParseNode(node.children) + '</span>' +
          '</span>'
        )
      } else {
        return '<span class="placeholder argument-' + urlClass + '">' + escapeHTML(node.url) + '</span>'
      }
    case 'Paragraph':
      return '<div class="example">' + mapParseNode(node.children) + '</div>'
    case 'Document':
    default:
      return mapParseNode(node.children)
  }
}