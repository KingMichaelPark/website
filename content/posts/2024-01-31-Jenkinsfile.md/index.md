+++
title = "Treesitter Highlights for Jenkinsfile"
date = 2024-01-31

[taxonomies]
tags = ["tips"]
categories = ["programming", "neovim"]
+++

Ever wanted syntax in neovim for `Jenkinsfiles`?
Let's create an autocommand to do just that!
<!-- more -->

## Treesitter

Ensure `treesitter` plugin is installed and you have the `groovy`
language installed.

You can install it via `:TSInstall groovy`

## Autocommand

Add this somewhere to your neovim config. You can see it in mine
[here](https://github.com/KingMichaelPark/dotfiles/blob/main/nvim/.config/nvim/lua/config/autocommands.lua)

```lua
vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
    group = augroup("jenkinsfile_detect"),
    pattern = { "Jenkinsfile" },
    callback = function()
        vim.cmd("set filetype=groovy")
    end
})
```

### Bonus terraform

`.tfvars` files are never detected properly either so you can
add this too.

```lua
vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
    group = augroup("terraform_detect"),
    pattern = { "*.tfvars" },
    callback = function()
        vim.cmd("set filetype=terraform")
    end
})
```
