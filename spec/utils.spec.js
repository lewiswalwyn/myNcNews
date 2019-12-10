const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an array', () => {
    const input = [{ body: "Oh", created_by: 'butter_bridge', votes: 16,
      created_at: 1511354163389 }];
    expect(formatDates(input)).to.be.an('array');
  });
  it('reformats the created_at property of each obj in array', () => {
    const input = [{ body: "Oh", created_by: 'butter_bridge', votes: 16,
      created_at: 1511354163389 },
        { body: "No", created_by: 'butters_bridges', votes: 16000,
      created_at: 1479818163389 }];
    const expected = [{ body: "Oh", created_by: 'butter_bridge', votes: 16,
    created_at: new Date(1511354163389) },
      { body: "No", created_by: 'butters_bridges', votes: 16000,
    created_at: new Date (1479818163389) }];
    expect(formatDates(input)).to.eql(expected);
    expect(formatDates(input)[0].created_at).to.be.a('Date')
  })
  it('does not mutate OG data', () => {
    const input = [{ body: "Oh", created_by: 'butter_bridge', votes: 16,created_at: 1511354163389 }];
    const processed = formatDates(input);
    expect(input).to.deep.equal([{ body: "Oh", created_by: 'butter_bridge', votes: 16, created_at: 1511354163389 }]);
    expect(input).not.to.deep.equal(processed);
  });
});

describe('makeRefObj', () => {
  it('returns an object', () => {
    expect(makeRefObj([{}])).to.be.an('object')
  });
  it('Returns a reference object with key from title and value from article_id', () => {
    const input = [{ article_id: 1, title: 'A' }];
    const expected = { A: 1 };
    expect(makeRefObj(input)).to.deep.equal(expected)
  });
});

describe('formatComments', () => {
  it('returns an array', () => {
    expect(formatComments([])).to.be.an('array')
    const input = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      belongs_to: 'A',
      created_by: 'tickle122',
      votes: -1,
      created_at: 1468087638932,
    }];
    const ref = {A:1}
    expect(formatComments(input, ref)).to.be.an('array')
  });
  it('Changes data and keys into correct format', () => {
    const input = [{
      body: 'bag',
      belongs_to: 'canal',
      created_by: 'tickle122',
      votes: -1,
      created_at: 1468087638932,
    }, {
      body: 'high',
      belongs_to: 'blessed',
      created_by: 'chump',
      votes: 9000,
      created_at: 1478813209256,
    }];
    const refObj = {canal: 1, blessed: 2}
    expect(formatComments(input, refObj)[0]).to.have.keys("author", "article_id", "body", "created_at", "votes")
    expect(formatComments(input, refObj)[0]['author']).to.equal(input[0]['created_by'])
    expect(formatComments(input, refObj)[0]['article_id']).to.equal(refObj['canal'])
    expect(formatComments(input, refObj)[0]['body']).to.equal(input[0]['body'])
    expect(formatComments(input, refObj)[0]['created_at']).to.be.a("Date")
    expect(formatComments(input, refObj)[0]['votes']).to.equal(input[0]['votes'])
    console.log(formatComments(input, refObj)[0]['author'])
  });
});
