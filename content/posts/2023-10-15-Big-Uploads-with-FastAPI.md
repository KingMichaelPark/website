+++
title = "Big Uploads and Checksum Validation"
date = 2023-10-04

[taxonomies]
tags = ["python", "fastapi"]
categories = ["programming"]
+++

Ever wanted to upload big files without storing
them in memory as they are being written with FastAPI?

<!-- more -->

### FastAPI Uploads

A simple post on streaming uploads.
To get started simply:

```python
@router.post(
    path="/api/v1/{sid}/file",
    tags=["Upload"],
    summary="Upload a file",
    description="Upload a file",
    status_code=status_code.HTTP_201_CREATED,
)
async def upload_file(
    sid: UUID,
    file: UploadFile,
):
    """Write a file.

    Args:
        sid (UUID): The parent folder to save it in
        file (UploadFile): The file to upload
    """
    save_path = build_upload_path(UPLOAD_BUCKET, sid, file.filename)

    # Write the File
    async with await FileWriteStream.from_path(save_path) as stream:
        while data := await file.read(2**20):
            await stream.send(data)

```

