# Browser Test

Browser test is in alpha phase... the intent is to provide the best possible out
of the box testing experience for browsers (just firefox right now) with
minimal magic and easy client interface so everyone can use their
existing framework.

The basic workflow should look like this:

```sh
$ browser-test file.js

1..2
ok 1 start one
ok 2 start two
# PASSED: 2
# PENDING: 0
# FAILED: 0

```

A fresh browser is created for each test (and currently only one test
per invocation).

## Usage

```sh
browser-test <file.js>
```

To be super useful you usually need an entrypoint html file which will
glue the harness to your existing test framework for a complete
entrypoint see /test/browser/entrypoint.html.

```sh
browser-test --entrypoint entrypoint.html test.js
```

For ease of use command line flags can be added to `browser-test.opts`
and will be used for every invocation of browser-test in that directory.


## Why this exists

The `browser-test` package is an early prototype of concepts I thought
of as `test-agent 2` (test-agent is the unit test runner used by
FirefoxOS's gaia project).

The original test-agent had many features and used many levels of
indirection to facilitate _domain_ (as in foobar.com) level isolation of
tests. Tests within the same domain (app) could effect another tests
causing many intermittent test problems as our apps grew larger (and due
to poorly written/leaky tests).

"Browser Test" handles things very differently:

  - One process for one file testing

    * While this model slows down a single test run modestly it does not
      greatly effect productivitity (500ms overhead or less) the
      overhead is offset by the garuentee that test can run in parallel.

    * The current implementation runs one-test per command _only_ passing
      multiple tests will be ignored.

  - Loose "client" reporting instead of coupled adapters

      * really easy to write adapters for other frameworks but none
        intended to be directly bundled into the framework.
