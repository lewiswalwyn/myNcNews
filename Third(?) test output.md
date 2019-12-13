## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

### GET `/api/articles?author=lurker`

Assertion: expected undefined to deeply equal []

Hints:
- give a 200 status and an empty array when articles for a topic that does exist, but has no articles is requested
- use a separate model to check whether the user exists


### GET `/api/articles?sort_by=not-a-column`

Assertion: expected 404 to be one of [ 200, 400 ]

Hints:
- filter out invalid `sort_by` queries _OR_ handle in the error handling middleware
- pick a consistent approach: ignore the invalid query, and use a 200 to serve up the articles with the default sort _OR_ use a 400 and provide a useful message to the client


### GET `/api/articles/1/comments?sort_by=not-a-valid-column`

Assertion: expected 404 to be one of [ 200, 400 ]

Hints:
- filter out invalid `sort_by` queries _OR_ handle in the error handling middleware
- pick a consistent approach: ignore the invalid query, and use a 200 to serve up the articles with the default sort _OR_ use a 400 and provide a useful message to the client