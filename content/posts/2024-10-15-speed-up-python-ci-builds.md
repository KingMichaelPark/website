+++
title = "Speed up Python Github Actions"
date = 2024-10-15

[taxonomies]
tags = []
categories = ["programming", "python"]
+++

If you want to speed up your CI builds you can use this
setup on your GitHub actions. Doing this from the previous
method cut my build times from 2 minutes to 1 minute.

<!-- more -->

## Using UV + Python

Using [uv](https://docs.astral.sh/uv/) as part of your project already should
give you great performance benefits so why not include it as part of your CI
builds? It allows for faster package resolution, dependency resolution and can
cache your dependencies to your `uv.lock` file so that you don't need to worry
about hammering pypi every build.

As per usual here is the tweak.

### Migrating Your Requirements

Firstly, if you aren't using `uv` and are still using requirements.txt files
you can do the following.

1. Init a `pyproject.toml`

```bash
uv init
```

2. Add the current requirements to the project

```bash
uv add -r requirements.txt

# If you have separate dev requirements
uv add  --dev -r dev-requirements.txt
```

This should generate a `uv.lock` file which we will need
for the next section. This also means you can now just
install local dependencies with `uv sync` and install
pacakges without dev dependencies with `uv sync --no-dev`.


### Updating Github Actions

You likely have something to this effect in your `.github/workflows/test.yml`

```yaml
jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install Requirements
        run: |
          python -m venv venv
          source venv/bin/activate
          pip install -r requirements.txt
          pip install -r requirements.dev.txt

      - name: Run The Tests
        run: |
          source venv/bin/activate
          pytest
```

Simply update to this instead and enjoy shedding off 30 seconds to a minute off
your build times!

```yaml
jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - name: Install uv
        uses: astral-sh/setup-uv@v3
        with:
          enable-cache: true
          cache-dependency-glob: "uv.lock"

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install Requirements
        run: |
          uv sync --frozen

      - name: Run The Tests
        run: |
          source .venv/bin/activate
          pytest
```
