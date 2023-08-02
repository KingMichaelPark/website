+++
title = "Mocking the Post Method on an Async HTTPX Post Request"
date = 2023-08-02

[taxonomies]
tags = ["python"]
categories = ["programming"]
+++

A quick snippet for mocking HTTP requests with an the async
[httpx](https://www.python-httpx.org/) context manager.

```py
async with httpx.AsyncClient() as client:
        signup_response = await client.post(
            f"https://{AUTH0_DOMAIN}/api/v2/users",
            data=signup_request_body,
            headers=signup_request_headers,
            timeout=30,
        )
```

<!-- more -->

Quick and simple post for getting at the method that you want to patch

```py
@patch("httpx.AsyncClient"). # The client to patch
async def test_auth0_post_request_example(
    mock_httpx_client,
):
    mock_httpx_client.return_value.__aenter__.return_value.post.return_value = Response(
        201,
        json={
            "user_id": "fake_user_id",
            "username": "fake_user_name",
            "email": "fake_email",
        },
    )
```  

1. mock_httpx_client (The patched uninitialised class of `httpx.AsyncClient`)
2. return_value (The class that is returned when initialised) this is the `()`
3. __aenter__ is the `async with` portion of the code.
4. return_value is the `as client:` portion
5. post (the `post` function)
6. return_value is the invoked return value from `post` so the `()` part of the function call.

Hopefully that makes sense!