# MiniMax Hailuo 02 [Standard] (Image to Video)

> MiniMax Hailuo-02 Image To Video API (Standard, 768p, 512p): Advanced image-to-video generation model with 768p and 512p resolutions


## Overview

- **Endpoint**: `https://fal.run/fal-ai/minimax/hailuo-02/standard/image-to-video`
- **Model ID**: `fal-ai/minimax/hailuo-02/standard/image-to-video`
- **Category**: image-to-video
- **Kind**: inference


## API Information

This model can be used via our HTTP API or more conveniently via our client libraries.
See the input and output schema below, as well as the usage examples.


### Input Schema

The API accepts the following input parameters:


- **`prompt`** (`string`, _required_)
  - Examples: "Man walked into winter cave with polar bear"

- **`image_url`** (`string`, _required_)
  - Examples: "https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png"

- **`duration`** (`DurationEnum`, _optional_):
  The duration of the video in seconds. 10 seconds videos are not supported for 1080p resolution. Default value: `"6"`
  - Default: `"6"`
  - Options: `"6"`, `"10"`

- **`prompt_optimizer`** (`boolean`, _optional_):
  Whether to use the model's prompt optimizer Default value: `true`
  - Default: `true`

- **`resolution`** (`ResolutionEnum`, _optional_):
  The resolution of the generated video. Default value: `"768P"`
  - Default: `"768P"`
  - Options: `"512P"`, `"768P"`

- **`end_image_url`** (`string`, _optional_):
  Optional URL of the image to use as the last frame of the video



**Required Parameters Example**:

```json
{
  "prompt": "Man walked into winter cave with polar bear",
  "image_url": "https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png"
}
```

**Full Example**:

```json
{
  "prompt": "Man walked into winter cave with polar bear",
  "image_url": "https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png",
  "duration": "6",
  "prompt_optimizer": true,
  "resolution": "768P"
}
```


### Output Schema

The API returns the following output format:

- **`video`** (`File`, _required_):
  The generated video
  - Examples: {"url":"https://v3.fal.media/files/monkey/xF9OsLwGjjNURyAxD8RM1_output.mp4"}



**Example Response**:

```json
{
  "video": {
    "url": "https://v3.fal.media/files/monkey/xF9OsLwGjjNURyAxD8RM1_output.mp4"
  }
}
```


## Usage Examples

### cURL

```bash
curl --request POST \
  --url https://fal.run/fal-ai/minimax/hailuo-02/standard/image-to-video \
  --header "Authorization: Key $FAL_KEY" \
  --header "Content-Type: application/json" \
  --data '{
     "prompt": "Man walked into winter cave with polar bear",
     "image_url": "https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png"
   }'
```

### Python

Ensure you have the Python client installed:

```bash
pip install fal-client
```

Then use the API client to make requests:

```python
import fal_client

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

result = fal_client.subscribe(
    "fal-ai/minimax/hailuo-02/standard/image-to-video",
    arguments={
        "prompt": "Man walked into winter cave with polar bear",
        "image_url": "https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png"
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
```

### JavaScript

Ensure you have the JavaScript client installed:

```bash
npm install --save @fal-ai/client
```

Then use the API client to make requests:

```javascript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/image-to-video", {
  input: {
    prompt: "Man walked into winter cave with polar bear",
    image_url: "https://storage.googleapis.com/falserverless/model_tests/minimax/1749891352437225630-389852416840474630_1749891352.png"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
```


## Additional Resources

### Documentation

- [Model Playground](https://fal.ai/models/fal-ai/minimax/hailuo-02/standard/image-to-video)
- [API Documentation](https://fal.ai/models/fal-ai/minimax/hailuo-02/standard/image-to-video/api)
- [OpenAPI Schema](https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/minimax/hailuo-02/standard/image-to-video)

### fal.ai Platform

- [Platform Documentation](https://docs.fal.ai)
- [Python Client](https://docs.fal.ai/clients/python)
- [JavaScript Client](https://docs.fal.ai/clients/javascript)