# Client protocol

To send results back up the server we need an api to describe the
state of the test run...

## Assumptions

1. There must only be one (single) test per browser
2. A "test" is defined as an html page which can be loaded
   and returns an appropriate response per the client protocol
   indicating success/failure and progress.

## Endpoint

Each test (given it's just an html file) is given an endpoint in the
form of a query parameter:

```
http://localhost:3000/?endpoint=http://localhost:3000/..../
```

The endpoint will expose a http (RESTish) api which can be used to
report status back to the CLI.

POST <endppoint>/test/


