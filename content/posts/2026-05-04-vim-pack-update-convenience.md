+++
title = "Convenient auto-command for vim.pack.update"
date = 2026-05-04

[taxonomies]
tags = []
categories = ["programming", "neovim"]
+++

Neovim 0.12's new built-in package management is a breath of fresh air, but the
default confirmation buffer is a bit bare-bones when it comes to quick
interactions. If you're like me and want to just hit a key to sync everything
up instead of using the code action `ca` and selecting update on each package...

<!-- more -->

This short `autocommand` adds a couple of "convenience" mappings to that
`nvim-pack://confirm` buffer. It sets up `U` to force an update and `q` to
quickly bail out, making the whole workflow feel a lot snappier.

```lua
vim.api.nvim_create_autocmd("BufEnter", {
    group = augroup("nvim_pack_confirm"),
    pattern = "*nvim-pack://confirm*",
    callback = function(event)
        vim.keymap.set("n", "U", function()
            vim.pack.update(nil, { force = true })
        end, { buffer = event.buf, desc = "Force update packages" })
        vim.keymap.set("n", "q", "<cmd>tabclose<cr>", { buffer = event.buf, desc = "Close tab" })
    end,
})
```
