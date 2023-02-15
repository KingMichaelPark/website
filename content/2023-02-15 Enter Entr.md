+++
title = "Testing in the Terminal"

[taxonomies]
tags = ["testing", "python", "entr"]
categories = ["programming", "help"]
+++

## Background

Find yourself running a pytest command repeatadly trying to work out
what a problem is and getting sick of clicking back on the terminal
window where the output is and pressing arrow up to re-run the test?
Or even running tests in an IDE and sick of re-running the test
time after time with your mouse?

<!-- more -->

This tip is short and sweet. I have been using this for ages and don't
see it listed too often. What you will need is [fd](https://github.com/sharkdp/fd)
 (or just `find` will do), [entr](https://eradman.com/entrproject/),
 if you are in a terminal with multiplexing/window splitting your're done. If not
 [tmux](https://github.com/tmux/tmux/wiki) will probably do fine.

When you are running your test suite and want to re-run tests as you iterate through
your changes, just run the following.

(The example is in python but this applies to anything)

```bash
fd -e py | entr -c pytest tests/
```

This basically equates to the following in plain english/behaviour testing language

_WHEN_ any file with the file extension `py` gets saved/modified.
_THEN_ clear the screen (clear, cls, or ctrl+l equivalent) and
_THEN_ re-run the supplied `pytest` command

This is a split with vim/neovim/whatever on the left and the test output on the right
is amazingly convenient when debugging, checking test coverage, etc...
Anything you run repeatedly in the terminal, just pipe those files to `entr` and 
let it do the work for you!