## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.


### GET `/api/articles?sort_by=not-a-column`

Assertion: expected 404 to be one of [ 200, 400 ]

Hints:
- filter out invalid `sort_by` queries _OR_ handle in the error handling middleware
- pick a consistent approach: ignore the invalid query, and use a 200 to serve up the articles with the default sort _OR_ use a 400 and provide a useful message to the client


### GET `/api/articles/1000`

Assertion: expected 500 to equal 404

Hints:
- if an article is not found with a valid `article_id`, use a 404: Not Found status code


### GET `/api/articles/dog`

Assertion: expected 500 to equal 400

Hints:
- if send an invalid `article_id`, use a 400: Bad Request status code


### PATCH `/api/articles/1`

Assertion: expected 101 to equal 100

Hints:
- ignore a `patch` request with no information in the request body, and send the unchanged article to the client
- provide a default argument of `0` to the `increment` method, otherwise it will automatically increment by 1


### PATCH `/api/articles/1`

Assertion: expected 200 to equal 400

Hints:
- use a 400: Bad Request status code when sent an invalid `inc_votes` value


### GET `/api/articles/1000/comments`

Assertion: expected 200 to equal 404

Hints:
- return 404: Not Found when given a valid `article_id` that does not exist


### GET `/api/articles/not-a-valid-id/comments`

Assertion: expected 500 to equal 400

Hints:
- return 400: Bad Request when given an invalid `article_id`


### GET `/api/articles/1/comments?sort_by=not-a-valid-column`

Assertion: expected 404 to be one of [ 200, 400 ]

Hints:
- filter out invalid `sort_by` queries _OR_ handle in the error handling middleware
- pick a consistent approach: ignore the invalid query, and use a 200 to serve up the articles with the default sort _OR_ use a 400 and provide a useful message to the client


### POST `/api/articles/1/comments`

Assertion: expected 201 to equal 400

Hints:
- use a 400: Bad Request status code when `POST` request does not include all the required keys
- use `notNullable` in migrations for required columns


### POST `/api/articles/10000/comments`

Assertion: expected 500 to be one of [ 404, 422 ]

Hints:
- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid article ID that does not exist


### POST `/api/articles/not-a-valid-id/comments`

Assertion: expected 500 to equal 400

Hints:
- use a 400: Bad Request when `POST` contains an invalid article_id


### PATCH `/api/comments/1`

Assertion: expected 200 to equal 400

Hints:
- use a 400: Bad Request status code when sent an invalid `inc_votes` value


### PATCH `/api/comments/1`

Assertion: expected 17 to equal 16

Hints:
- use 200: OK status code when sent a body with no `inc_votes` property
- send an unchanged comment when no `inc_votes` is provided in the request body


### PATCH `/api/comments/1000`

Assertion: expected 200 to equal 404

Hints:
- use a 404: Not Found when `PATCH` contains a valid comment_id that does not exist


### PATCH `/api/comments/not-a-valid-id`

Assertion: expected 500 to equal 400

Hints:
- use a 400: Bad Request when `PATCH` contains an invalid comment_id


### PATCH `/api/comments/1`

Assertion: expected 200 to equal 400

Hints:
- use a 400: Bad Request status code when sent an invalid `inc_votes` value


### DELETE `/api/comments/1000`

Assertion: expected 204 to equal 404

Hints:
- use a 404: Not Found when `DELETE` contains a valid comment_id that does not exist


### DELETE `/api/comments/not-a-number`

Assertion: expected 500 to equal 400

Hints:
- use a 400: Bad Request when `DELETE` contains an invalid comment_id


### DELETE `/api`

Assertion: expected 404 to equal 405

Hints:
- use `.all()` on each route, to serve a 405: Method Not Found status code

