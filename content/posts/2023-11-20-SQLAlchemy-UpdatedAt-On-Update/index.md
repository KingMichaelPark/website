+++
title = "SQLAlchemy, OnUpdate & Datetime UTCNOW deprecation in 3.12"
date = 2023-11-20

[taxonomies]
tags = ["python"]
categories = ["programming"]
+++

This is a quick post about migrating your `utcnow()` to `now(tz=UTC)`
in SQLAlchemy for your `onupdate` function argument to your SQL Models.

<!-- more -->

## A World Without utcnow

With `datetime.utcnow` being deprecated you might see this pattern in your
project's code if you are using SQLAlchemy

```python
class Table(Base):
    updated_at: Mapped[timestamp] = mapped_column(
        TIMESTAMP(fsp=3),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
```

However, you might be wondering how to pass the new recommended
`datetime.now(tz=UTC)` to the function above, as invoking `datetime.now()` will
cause all the timestamps to be the time when the server or lambda started, not
when the function for updated is actually called. (It's effectively hard-coding
a single time stamp that will never change). The answer is `functools.partial`
where you can pass functions _with_arguments_ to another function as an
argument. So the above snippet will become:

```python
from functools import partial

class Table(Base):
    updated_at: Mapped[timestamp] = mapped_column(
        TIMESTAMP(fsp=3),
        default=partial(datetime.now, tz=UTC),
        onupdate=partial(datetime.now, tz=UTC),
        nullable=False
    )
```

The end.
