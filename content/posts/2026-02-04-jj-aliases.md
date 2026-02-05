+++
title = "Two useful aliases for use with JJ"
date = 2026-02-04

[taxonomies]
tags = []
categories = ["programming", "jj", "git"]
+++

Everyone will have the `jj tug` alias defined in their list of aliases in
their [jj config](https://github.com/KingMichaelPark/dotfiles/blob/main/jj/.config/jj/config.toml).
I would like to share two that I think are quite nifty and useful!

<!-- more -->

## JJ Aliases

I wanted to share two aliased that I have found useful that I found necessary
to automate based on my month's use of JJ. The one thing that I do quite often
is checkout other people's branches (bookmarks sorry 😉) to help them out or do
code reviews.

So my usual flow would have been to run something like...

```bash
jj bookmark list --all
# Read the results and then run
jj bookmark track --remote=origin <The bookmark I want to track>
# Do the review
jj bookmark forget <The bookmark I want to forget>
# or
jj bookmark untrack --remote=origin <The bookmark I want to untrack>
```

That is a bit of a faff so I just aliased these.

> Note: You do need [fzf](https://junegunn.github.io/fzf/installation/)
> installed in my version so I can quickly fuzzy find the bookmark name.
> But who doesn't have `fzf` installed by now?!

```toml
[aliases]
bt = ["util", "exec", "--", 'sh', '-euc', '''
  B=$(jj bookmark list --all -T 'name ++ "\n"' | sort | uniq | fzf)
  if [ -n "$B" ]; then
    jj b track --remote=origin "$B" > /dev/null 2>&1
    echo "Tracking: $B"
    jj b l --tracked
  fi
''' ]
bu = ["util", "exec", "--", 'sh', '-euc', '''
  B=$(jj b l --tracked -T 'name ++ "\n"' | sort | uniq | fzf)
  if [ -n "$B" ]; then
    jj b untrack --remote=origin "$B" > /dev/null 2>&1
    echo "Untracked: $B"
    jj b l --tracked
  fi
''' ]
bf = ["util", "exec", "--", 'sh', '-euc', '''
  B=$(jj b l --tracked -T 'name ++ "\n"' | sort | uniq | fzf)
  if [ -n "$B" ]; then
    jj b forget "$B" > /dev/null 2>&1
    echo "Forgot: $B"
    jj b l --tracked
  fi
''' ]
```

These aliases will run the first command, sort the output, remove duplicates, pipe it to `fzf`
for you to select from, and then run the second command with your selection.

Good luck on your [jj](https://docs.jj-vcs.dev/latest/) Journey!
