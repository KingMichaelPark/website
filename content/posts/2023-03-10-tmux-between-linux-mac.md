+++
title = "Tmux in Linux and Mac With Wezterm"
date = 2023-03-10

[taxonomies]
tags = ["tmux", "wezterm", "brew"]
categories = ["programming", "help"]
+++

After struggling to get `tmux` to run seamlessly between Mac (on ARM i.e. M1/M2)
and linux due to the fact that `brew` installs packages to `/opt/homebrew/bin/`
and it isn't on the path before the shell loads, I have finally worked out how to
get tmux to launch/attach to existing sessions when launching a new terminal both
in linux and on MacOS.

<!-- more -->

I use [wezterm](https://wezfurlong.org/wezterm/) as my terminal emulator as I can
maintain the same settings for the terminal between my linux and mac (sorry
iterm peeps).

I won't get into why I love it, but it is fast, has a very nice dev, and supports
ligatures in fonts which - while divisive to some - I like so I use this.

Long story short. Here is the `wezterm.lua` config that you can store in your
`~/.config/wezterm/wezterm.lua`.

```lua
local wezterm = require("wezterm")

local tmux = {}
if wezterm.target_triple == "aarch64-apple-darwin" then
    tmux = {"/opt/homebrew/bin/tmux", "new", "-As0"}
else
    tmux = { "tmux", "new", "-As0" }
end

return {
    color_scheme = "Catppuccin Mocha",
    default_prog = tmux,
    font = wezterm.font({ family = "IosevkaTerm Nerd Font", stretch = "Normal" }),
    font_dirs = { "~/.local/share/fonts" },
    font_size = 13,
    hide_tab_bar_if_only_one_tab = true,
    initial_cols = 150,
    initial_rows = 35,
    tab_bar_at_bottom = true,
    warn_about_missing_glyphs = false,
    window_background_opacity = 1.0,
}
```

They key lines is the local `tmux` path. Wezterm won't launch
if you don't pass it explicitly as the path is not known by default
to wezterm.

The second thing you need to change is to get your tmux config to append
that brew path to the **$PATH** as well.

`.tmux.conf` :

```config
set -g mouse on
set -s set-clipboard on
set-environment -g PATH "/opt/homebrew/bin:/bin:/usr/bin"
# ADD THIS LINE ^^^

set-window-option -g mode-keys vi

bind / split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
unbind '"'
unbind %

bind -r ^ last-window
bind -r k select-pane -U
bind -r j select-pane -D
bind -r h select-pane -L
bind -r l select-pane -R
bind C new-window -c "#{pane_current_path}"

# Current projects
bind-key -r f run-shell "tmux neww ~/.local/bin/tmux-sessionizer"

# set -g default-terminal "tmux-256color"
set -ga terminal-overrides ",xterm-256color:Tc"
set-option -sa terminal-overrides ',screen-256color:RGB'

# # List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'catppuccin/tmux'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -sg escape-time 5

set-option -g focus-events on
set-option -g default-shell /bin/zsh
bind r source-file ~/.tmux.conf

# Initialize TMUX plugin manager (keep this line at the very bottom of tmux.conf)
run '~/.tmux/plugins/tpm/tpm'
```

All of this can be seen in my [dotfiles](https://gitlab.com/of_jorts/dotfiles).
