+++
title = "Python Logging"
date = 2024-01-24

[taxonomies]
tags = []
categories = ["programming"]
+++

Just a very quick post/memo to myself about an awesome
way to configure logging in python based on an excellent
Github [repo](https://github.com/mCodingLLC/VideosSampleCode/) I stumbled across via a YouTube video.

<!-- more -->

## JSON Logging

This is going to be a quick dump of code that I can always come
back to and copy paste into projects when I need logging in
the application.

```py
import atexit
import json
import logging
import logging.config
import logging.handlers
import os
from datetime import UTC, datetime
from typing import override

# Credit for a great config: https://github.com/mCodingLLC/VideosSampleCode/

CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"no_errors": {"()": "mlog.NonErrorFilter"}},
    "formatters": {
        "simple": {
            "format": "[%(levelname)s|%(module)s|L%(lineno)d] %(asctime)s: %(message)s",
            "datefmt": "%Y-%m-%dT%H:%M:%S%z",
        },
        "json": {
            "()": "mlog.JSONFormatter",
            "fmt_keys": {
                "level": "levelname",
                "message": "message",
                "timestamp": "timestamp",
                "logger": "name",
                "module": "module",
                "function": "funcName",
                "line": "lineno",
            },
        },
    },
    "handlers": {
        "stderr": {
            "class": "logging.StreamHandler",
            "level": "WARNING",
            "formatter": "json",
            "stream": "ext://sys.stderr",
        },
        "stdout": {
            "class": "logging.StreamHandler",
            "level": os.environ.get("LOG_LEVEL", "DEBUG"),
            "formatter": "json",
            "stream": "ext://sys.stdout",
            "filters": ["no_errors"],
        },
        "queue_handler": {
            "class": "logging.handlers.QueueHandler",
            "handlers": ["stderr", "stdout"],
            "respect_handler_level": True,
        },
    },
    "loggers": {"root": {"level": "DEBUG", "handlers": ["queue_handler"]}},
}


LOG_RECORD_BUILTIN_ATTRS = {
    "args",
    "asctime",
    "created",
    "exc_info",
    "exc_text",
    "filename",
    "funcName",
    "levelname",
    "levelno",
    "lineno",
    "module",
    "msecs",
    "message",
    "msg",
    "name",
    "pathname",
    "process",
    "processName",
    "relativeCreated",
    "stack_info",
    "thread",
    "threadName",
    "taskName",
}


class JSONFormatter(logging.Formatter):
    def __init__(
        self,
        *,
        fmt_keys: dict[str, str] | None = None,
    ):
        super().__init__()
        self.fmt_keys = fmt_keys if fmt_keys is not None else {}

    @override
    def format(self, record: logging.LogRecord) -> str:
        message = self._prepare_log_dict(record)
        return json.dumps(message, default=str)

    def _prepare_log_dict(self, record: logging.LogRecord):
        fields = {
            "message": record.getMessage(),
            "timestamp": datetime.fromtimestamp(record.created, tz=UTC).isoformat(),
        }
        if record.exc_info:
            fields["exc_info"] = self.formatException(record.exc_info)

        if record.stack_info:
            fields["stack_info"] = self.formatStack(record.stack_info)

        message = {
            key: msg_val
            if (msg_val := fields.pop(val, None)) is not None
            else getattr(record, val)
            for key, val in self.fmt_keys.items()
        }
        message.update(fields)

        for key, val in record.__dict__.items():
            if key not in LOG_RECORD_BUILTIN_ATTRS:
                message[key] = val

        return message


class NonErrorFilter(logging.Filter):
    @override
    def filter(self, record: logging.LogRecord) -> bool | logging.LogRecord:
        return record.levelno <= logging.INFO


def setup_logging():
    logging.config.dictConfig(CONFIG)
    queue_handler = logging.getHandlerByName("queue_handler")
    if queue_handler is not None:
        queue_handler.listener.start()
        atexit.register(queue_handler.listener.stop)


def main():
    setup_logging()
    logging.basicConfig(level="INFO")
    logger = logging.getLogger(__name__)
    logger.debug("debug message", extra={"x": "hello"})
    logger.info("info message")
    logger.warning("warning message")
    logger.error("error message")
    logger.critical("critical message")
    try:
        print(1 / 0)
    except ZeroDivisionError as e:
        logger.exception(f"{e}")


if __name__ == "__main__":
    main()
```

The end!
