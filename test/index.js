var expect = require('chai').expect
var convert = require('..')

describe('convert', function () {
  it('converts strings, images, arguments, placeholders, and symbols', function () {
    var example = 'open ![](img/clipboard.png)[*clipboard*](clipboard url) in [](application)'
    var html = convert(example)
    expect(html).to.equal('<div class="example"><span class="string">open </span><img class="image" src="img/clipboard.png" /><span class="argumentSegment argument-clipboard-url"><span class="argument">clipboard url</span><span class="content"><span class="category-symbol"><span class="string">clipboard</span></span></span></span><span class="string"> in </span><span class="placeholder argument-application">application</span></div>')
  })

  it('converts with imageRoot', function () {
    var example = 'open ![](img/clipboard.png)[*clipboard*](clipboard url) in [](application)'
    var html = convert(example, '/tmp')
    expect(html).to.equal('<div class="example"><span class="string">open </span><img class="image" src="/tmp/img/clipboard.png" /><span class="argumentSegment argument-clipboard-url"><span class="argument">clipboard url</span><span class="content"><span class="category-symbol"><span class="string">clipboard</span></span></span></span><span class="string"> in </span><span class="placeholder argument-application">application</span></div>')
  })
})