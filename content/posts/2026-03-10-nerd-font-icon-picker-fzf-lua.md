+++
title = "Finding Nerd Fonts in Neovim"
date = 2026-03-10

[taxonomies]
tags = []
categories = ["programming", "nerd", "fzf"]
+++

I have been writing quite a few presentations in [presenterm](https://mfontanini.github.io/presenterm/)
and was repeatedly going over to the nerd font website to search for the icon that I wanted to pick
copying it, then pasting it in neovim. Surely... there is a better way.

<!-- more -->

Searching through web-based cheat sheets annoyed me so much that I decided to
bring the search directly into Neovim using `fzf-lua`. There was an existing [nerdy.nvim](https://github.com/2KAbhishek/nerdy.nvim)
that looks like it does the same thing. _(thanks for the python utility script to get the icon names)_, but it used
`telescope` or `snacks.nvim` for the picker and I use [fzf.lua](https://github.com/ibhagwan/fzf-lua).

The benefit is pretty simple:

- hit a keymap
- fuzzy-search for an icon by name
- and drop that bad boy straight into the buffer.

To power this, I added a new utility module in my neovim
[config](https://github.com/KingMichaelPark/dotfiles/blob/main/nvim/.config/nvim/lua/utils/nerd_icons.lua),
which acts as a comprehensive dictionary of Nerd Font icons (VS Code codicons,
Devicons, Font Awesome, etc.). By piping this into fzf-lua, I get a
lightning-fast, searchable interface for thousands of symbols.

I hooked a new picker into my `fzf.lua` config under `<leader>fn` _(Find Nerd-font)_.

```lua
{
    "<leader>fn",
    function()
        local nerd_icons = require("utils.nerd_icons")
        local items = {}
        for _, item in ipairs(nerd_icons.list()) do
            table.insert(items, string.format("%s  %s", item.char, item.name))
        end
        require("fzf-lua").fzf_exec(items, {
            prompt = "Icons> ",
            multiselect = true,
            winopts = {
                height = 0.33,
                width = 0.33,
            },
            actions = {
                ["default"] = function(selected)
                    local icons = {}
                    for _, line in ipairs(selected) do
                        local icon = vim.fn.split(line, "  ")[1]
                        table.insert(icons, icon)
                    end
                    vim.api.nvim_put({ table.concat(icons, "") }, "c", true, true)
                end,
            },
        })
    end,
    desc = "Find Nerd Font Icon",
},
```

_and_ **bada-bing, bada-boom...**

{{ resize_image(path="images/nerd.webp", width=380, height=0, op="fit_width") }}
