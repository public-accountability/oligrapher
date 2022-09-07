import textLines from '../../app/util/textLines'

describe('textLines()', function() {
  it("splits short names", function() {
    expect(textLines('short name')).toEqual(['short name'])
  })

  it("splits names over 18 characters", function() {
    expect(textLines('node name that is over 18 chars!'))
      .toEqual(['node name that is', 'over 18 chars!'])
  })


  it("handles names without spaces", function() {
    expect(textLines('JustInCaseSomeoneUsesANameLikeThis'))
      .toEqual(['JustInCaseSomeoneUsesANameLikeThis'])
  })

  it("splits names over 40 characters", function() {
    expect(textLines('a node name that is over 40 characters long'))
      .toEqual(['a node name that is over', '40 characters long'])
  })
})
