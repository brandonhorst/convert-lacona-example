var _ = require('lodash')
var markdownToAST = require('markdown-to-ast').parse
var escapeHTML = require('escape-html')
var join = require('path').join

module.exports = function convert (example, imageRoot) {
  var trueImageRoot = imageRoot || ''
  var ast = markdownToAST(example)
  return parseNode(ast, trueImageRoot)
}

function mapParseNode (children, imageRoot) {
  return _.chain(children).map(function () {
    parseNode(child, imageRoot)
  }).join('').value()
}

function parseNode (node, imageRoot) {
  switch (node.type) {
    case 'Str':
      return '<span class="string">' + escapeHTML(node.value) + '</span>'
    case 'Image':
      return '<img class="image" src="' + escapeHTML(join(imageRoot, node.url)) + '" />'
    case 'Emphasis':
      return '<span class="category-symbol">' + mapParseNode(node.children, imageRoot) + '</span>'
    case 'Link':
      const urlClass = escapeHTML(_.kebabCase(node.url))
      if (node.children.length) {
        return (
          '<span class="argumentSegment argument-' + urlClass + '">' + 
            '<span class="argument">' + escapeHTML(node.url) + '</span>' +
            '<span class="content">' + mapParseNode(node.children, imageRoot) + '</span>' +
          '</span>'
        )
      } else {
        return '<span class="placeholder argument-' + urlClass + '">' + escapeHTML(node.url) + '</span>'
      }
    case 'Paragraph':
      return '<div class="example">' + mapParseNode(node.children, imageRoot) + '</div>'
    case 'Document':
    default:
      return mapParseNode(node.children, imageRoot)
  }
}