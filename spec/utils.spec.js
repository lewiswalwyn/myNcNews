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

// describe('makeRefObj', () => {
//   it('returns an object', () => {
//     expect([{}]).to.be.an('object')
//   });
// });

describe('formatComments', () => {});
