import textLines from '../../app/util/textLines'
import { expect } from 'chai'

describe('textLines()', function() {
  it("splits short names", function() {
    expect(textLines('short name')).to.eql(['short name'])
  })

  it("splits names over 18 characters", function() {
    expect(textLines('node name that is over 18 chars!'))
      .to.eql(['node name that is', 'over 18 chars!'])
  })


  it("handles names without spaces", function() {
    expect(textLines('JustInCaseSomeoneUsesANameLikeThis'))
      .to.eql(['JustInCaseSomeoneUsesANameLikeThis'])
  })

  it("splits names over 40 characters", function() {
    expect(textLines('a node name that is over 40 characters long'))
      .to.eql(['a node name that is over', '40 characters long'])
  })
})
