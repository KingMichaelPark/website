+++
title = "2023 - A Tech Year in Review"
date = 2023-12-10

[taxonomies]
tags = ["2023"]
categories = ["programming"]
+++

2023 gave me the ability to experience a lot of different
tools, languages, and technologies, many did not make the
cut long-term but I would like to put together a list of
the core tooling that I use day to day with an example or two
along the way.

<!-- more -->

## CLI

This section involves tools that I use on the CLI on any given day. Mostly
everything that I talk about will be available with my settings/install
instructions in my [dotfiles](https://github.com/KingMichaelPark/dotfiles).

This will also apply to the neovim section as well.

### Shell

This sections is strictly about tools that I am calling from zsh. Mostly
everything discussed here will be available for bash and whatever other
shell you use.

#### Age & SOPS

One of the best revelations for me this year has been that I am able to
finally get rid of GPG by replacing it with SSH and with Age. For the
SSH level signing please read this [post](../2023-10-05-ssh-signing-and-auth-with-git.md).

Age is a fast and cryptographically secure encryption library that can
be used as a replacement for asymmetric encryption of secrets and files.
It follows a similar pattern to GPG but the commands are fewer, defaults
are secure, and the subcommands make sense. This example below is taken
from the project's [README](https://github.com/FiloSottile/age).

```bash
$ age-keygen -o key.txt
Public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
$ tar cvz ~/data | age -r age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p > data.tar.gz.age
$ age --decrypt -i key.txt data.tar.gz.age > data.tar.gz
```

You'll see a private key on the homepage of this site that you can use to send
secrets (I can't think what you'd possibly send). But the principal is the same
in that you simply can share your public key and people can encrypt files to
you, or... you can store secrets to yourself in your dotfiles - like I have for
saving my OpenAI api token - and simply decrypt it when using it Neovim with
[chatgpt.nvim](https://github.com/jackMort/ChatGPT.nvim) by decrypting it by
using my plugin (age.nvim)

The best part however, is to get everyone on your team to generate one
and use for with [SOPS](https://github.com/getsops/sops) to manage
project secrets. You can use this in conjunction with cloud keys like
Vault, KMS, etc... so your dev, staging and prod environments can be
managed strictly with the KMS key to encrypt and decrypt, while your
local environment (or even dev) has secrets easily available to the team.
Just set up another age key pair for GitHub in it's secrets section and
add it as a recipient to your env files. --add-age <GITHUB-Age-Identity.txt>
so all your Actions can decrypt whatever you need too. I've used
this successfully across projects.

#### The Old Boys

This section is a list of tools I have been using for years and
have no plans on stopping. I use these every day.

- [Bat](https://github.com/sharkdp/bat) - Cat replacement with syntax
  highlighting written in 🦀
- [Eza](https://eza.rocks/) - A modern, maintained replacement for ls
- [Fd](https://github.com/sharkdp/fd) - A rust find replacement with a simpler
  syntax
- [Fzf](https://github.com/junegunn/fzf) - Command line fuzzy finder. It also
  let's you fuzzy find files `<ctrl+t>`, change directories `<Alt+c>`, and most
  useful, searching your command history interactively for that one git command
  you can't remember `<ctrl+r>`.
- [Starship](https://starship.rs) - Useful shell theme for tooling and
  environment settings
- [LazyGit](https://github.com/jesseduffield/lazydocker) - Git some superpowers
  🐐
- [Ripgrep](https://github.com/BurntSushi/ripgrep) - 🦀 grep replacement.
- [Zoxide](https://github.com/ajeetdsouza/zoxide) - Super fast cd with a
  memory. Instead of typing `cd dir1/client1/project1/submodule1` after you've
  done it once, you can then just type `z d1c1s1` and it will take you there.

#### Mise

[Mise](https://github.com/jdx/mise) is an asdf replacement written in, you
guessed it 🦀 that allows you to install and manage multiple versions of your
project. Let's say a repo needs `python` 3.12, `terraform` 1.6, and `go` 1.21
and you need to make sure that your aws cli runs in `eu-west-2` it might be
daunting getting all those tools, making sure you're using that tool in this
project and don't break other projects using different versions of the same
languages. It's as simple as...

```bash
mise p install python terraform go
mise install python@3.12 terraform@1.6 go@1.21
mise use python@3.12 terraform@1.6 go@1.21
```

This will make a file in your project called `.mise.toml`

Open that up and you'll see...

```toml
[tools]
python = "3.12"
terraform = "1.6"
go = "1.21"

## Let's make sure we are deploying in the same region and profile
[env]
AWS_PROFILE="profile_name"
AWS_REGION="eu-west-2"
```

Save and close, and run `mise trust`. And now you will see that those
two environment variables have been set and your tools will be the versions
that you have specified in this file.

### Neovim

For people who use neovim, this section might be of interest to you but if not
feel free to skip ahead. Here is a list of plugins that I use. These are all
on GitHub so just search for them. I will add a tiny note over ones that are
slightly more niche.

    ○ ChatGPT.nvim
    ○ LuaSnip
    ○ age.nvim
    ○ cmp-buffer
    ○ cmp-cmdline
    ○ cmp-nvim-lsp
    ○ cmp-path
    ○ cmp_luasnip
    ○ conform.nvim
    ○ diffview.nvim
    ○ friendly-snippets
    ○ gitsigns.nvim
    ○ harpoon
    ○ leap.nvim
    ○ mason-lspconfig.nvim
    ○ mason.nvim
    ○ mini.trailspace
    ○ nui.nvim
    ○ nvim-cmp
    ○ nvim-dap
    ○ nvim-dap-python
    ○ nvim-dap-ui
    ○ nvim-dap-virtual-text
    ○ nvim-lspconfig
    ○ nvim-nio
    ○ nvim-spectre
    ○ nvim-treesitter
    ○ nvim-treesitter-context
    ○ nvim-treesitter-refactor
    ○ nvim-treesitter-textobjects
    ○ oil.nvim
    ○ telescope-fzf-native.nvim
    ○ telescope-ui-select.nvim
    ○ telescope.nvim
    ○ todo-comments.nvim
    ○ undotree
    ○ vim-dadbod
    ○ vim-dadbod-completion
    ○ vim-dadbod-ui
    ● alpha-nvim
    ● catppuccin
    ● lazy.nvim
    ● lualine.nvim
    ● nvim-lint
    ● nvim-surround
    ● nvim-web-devicons
    ● plenary.nvim
    ● toggleterm.nvim
    ● ts-comments.nvim
    ● which-key.nvim

## Colour Themes

Very quickly on colour themes. I have tried many colour schemes over the
years, if you can name it, I have probably tried it. I have settled on
[catppuccin](https://github.com/catppuccin) due to its availability across
many tools and software. I will list my top 5 so if you hate it, you can
look at some others instead.

1. Catppuccin
2. Gruvbox
3. Rose Pine
4. Tokyo Night
5. Everforest

## Programming

### Frameworks

#### Python

FastAPI - with the inclusion of pydantic 2.0 has been really great to build
API's in. I don't particularly like JS/TS frameworks so using `FastAPI` + Jinja
to template out API first websites with automatically generated redoc and
`openapi.json`. Here come the haters to say that I am ten years behind the time
and you need interactivity and fancy animations. Guess what? Animations just
use some css or animated svgs. And for just updating parts of a page there is a
simpler way... [htmx](https://htmx.org/). All the interactivity you need
without needing to manage two projects. Use your templates and stick some htmx
attributes on your html and you can update those live status icons without
needing to write any javascript.

I'd like to try the same pattern with Go or Rust as the backend and `htmx` and
`html` with the front-end. I am a simple man who likes simple tools and simple
maintainable solutions. JS and TS frameworks have their place, but that's not my
area of work.

#### Elixir

This philosophy extends even further than the `htmx` reactivity when it comes
to resiliance and efficiency of data being transferred over websockets with the
minimal payload required with the beauty that is [Phoenix
Liveview](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html). I am
anxiously awaiting a long running project that will allow me to take my
learnings from private testing to full blown projects. Changes of objects are
passed simply over the websocket with the minimal amount of info required to
update. So while `htmx` or a JS request needs to send your API token, header,
cookies and minimal data response, with Phoenix, if we change a row in a 50
column 100 row table from yes -> no the resulting network traffic looks similar
to.

```json
{1: "no"}
```

Which is... 11 whole bytes!

```bash
echo '{1: "no"} ' | wc
    1       2      11
```

Oh yeah...and `tailwind.css` comes pre-bundled so you can even avoid the css if you want 😉.

<iframe
    width="560"
    height="315"
    src="https://www.youtube-nocookie.com/embed/x1rx4-AAcMQ?si=GYJzlGGAo-H282DB"
    title="Phoenix Liveview Demo"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
</iframe>

### Packages/Tools

#### DuckDB

[DuckDB](https://duckdb.org/) is a really great tool that has replaced my need
to use `jq` for cutting down big json files and has let me also search and
filter csvs from the command line with nearly no issues. Not only is it a
performant local database, but it can also read, query and write json, csv and
parquet files.

Here are some examples:

Reading `csv` from the command line:

```bash
 ❯ titanic="https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
 ❯ duckdb -c "select Pclass, Survived, PassengerId  from read_csv_auto('$titanic') where Fare <= 15 limit 10"

┌────────┬──────────┬─────────────┐
│ Pclass │ Survived │ PassengerId │
│ int64  │  int64   │    int64    │
├────────┼──────────┼─────────────┤
│      3 │        0 │           1 │
│      3 │        1 │           3 │
│      3 │        0 │           5 │
│      3 │        0 │           6 │
│      3 │        1 │           9 │
│      3 │        0 │          13 │
│      3 │        0 │          15 │
│      2 │        1 │          18 │
│      3 │        1 │          20 │
│      2 │        1 │          22 │
├────────┴──────────┴─────────────┤
│ 10 rows               3 columns │
└─────────────────────────────────┘
```

From `json`:

```bash
❯ iris="https://raw.githubusercontent.com/domoritz/maps/master/data/iris.json"
❯ duckdb -c "from read_json_auto('$iris') where sepalWidth <= 3 limit 10"

┌─────────────┬────────────┬─────────────┬────────────┬────────────┐
│ sepalLength │ sepalWidth │ petalLength │ petalWidth │  species   │
│   double    │   double   │   double    │   double   │  varchar   │
├─────────────┼────────────┼─────────────┼────────────┼────────────┤
│         4.9 │        3.0 │         1.4 │        0.2 │ setosa     │
│         4.4 │        2.9 │         1.4 │        0.2 │ setosa     │
│         4.8 │        3.0 │         1.4 │        0.1 │ setosa     │
│         4.3 │        3.0 │         1.1 │        0.1 │ setosa     │
│         5.0 │        3.0 │         1.6 │        0.2 │ setosa     │
│         4.4 │        3.0 │         1.3 │        0.2 │ setosa     │
│         4.5 │        2.3 │         1.3 │        0.3 │ setosa     │
│         4.8 │        3.0 │         1.4 │        0.3 │ setosa     │
│         5.5 │        2.3 │         4.0 │        1.3 │ versicolor │
│         6.5 │        2.8 │         4.6 │        1.5 │ versicolor │
├─────────────┴────────────┴─────────────┴────────────┴────────────┤
│ 10 rows                                                5 columns │
└──────────────────────────────────────────────────────────────────┘
```

#### Formatters

- Python -> [Ruff](https://github.com/astral-sh/ruff)
- JSON, JS, TS -> [Biome](https://biomejs.dev/)
- SQL -> [SQLFluff](https://sqlfluff.com/)

Other languages tend to have built-in formatters or I don't
use those languages so sorry. The main point is... in python land
I no longer need Flake8, Black or iSort. And in JS land, biome
has replaced prettier and `eslint` for me.

## Grab Bag

This is just a grab bag of favourites I want to use as a point of
reflection on where my life was at the moment. Some of these things
are old, they are just things that I hadn't experienced until this year
and would recommend them.

### Some Favourites of the Year

#### Movies

- The Act of Killing
- Dark Waters
- The VVitch

#### TV

- Band of Brothers
- Jujustu Kaisen
- Succession

#### Books

- The Road - Cormac McCarthy
- The Meditations - Marcus Aurelius
- The Ministry for Future - Kim Stanley Robinson

#### Video Games

- The Outer Wilds - Echoes of the Eye
- Metroid Dread
- The Legend of Zelda - Tears of the Kingdom

