


Queue
#
Long-running requests
For long-running requests, such as training jobs or models with slower inference times, it is recommended to check the Queue status and rely on Webhooks instead of blocking while waiting for the result.

Submit a request
#
The client API provides a convenient way to submit requests to the model.


import { fal } from "@fal-ai/client";

const { request_id } = await fal.queue.submit("fal-ai/kling-video/v2.5-turbo/pro/image-to-video", {
  input: {
    prompt: "A stark starting line divides two powerful cars, engines revving for the challenge ahead. They surge forward in the heat of competition, a blur of speed and chrome. The finish line looms as they vie for victory.",
    image_url: "https://v3.fal.media/files/panda/HnY2yf-BbzlrVQxR-qP6m_9912d0932988453aadf3912fc1901f52.jpg"
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});
Fetch request status
#
You can fetch the status of a request to check if it is completed or still in progress.


import { fal } from "@fal-ai/client";

const status = await fal.queue.status("fal-ai/kling-video/v2.5-turbo/pro/image-to-video", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});
Get the result
#
Once the request is completed, you can fetch the result. See the Output Schema for the expected result format.


import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/kling-video/v2.5-turbo/pro/image-to-video", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});
console.log(result.data);
console.log(result.requestId);
4. Files
#
Some attributes in the API accept file URLs as input. Whenever that's the case you can pass your own URL or a Base64 data URI.

Data URI (base64)
#
You can pass a Base64 data URI as a file input. The API will handle the file decoding for you. Keep in mind that for large files, this alternative although convenient can impact the request performance.

Hosted files (URL)
#
You can also pass your own URLs as long as they are publicly accessible. Be aware that some hosts might block cross-site requests, rate-limit, or consider the request as a bot.

Uploading files
#
We provide a convenient file storage that allows you to upload files and use them in your requests. You can upload files using the client API and use the returned URL in your requests.


import { fal } from "@fal-ai/client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
Auto uploads
The client will auto-upload the file for you if you pass a binary object (e.g. File, Data).

Read more about file handling in our file upload guide.

5. Schema
#
Input
#
prompt string
image_url string
URL of the image to be used for the video

duration DurationEnum
The duration of the generated video in seconds Default value: "5"

Possible enum values: 5, 10

negative_prompt string
Default value: "blur, distort, and low quality"

cfg_scale float
The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt. Default value: 0.5


{
  "prompt": "A stark starting line divides two powerful cars, engines revving for the challenge ahead. They surge forward in the heat of competition, a blur of speed and chrome. The finish line looms as they vie for victory.",
  "image_url": "https://v3.fal.media/files/panda/HnY2yf-BbzlrVQxR-qP6m_9912d0932988453aadf3912fc1901f52.jpg",
  "duration": "5",
  "negative_prompt": "blur, distort, and low quality",
  "cfg_scale": 0.5
}
Output
#
video File
The generated video


{
  "video": {
    "url": "https://storage.googleapis.com/falserverless/model_tests/kling/kling-v2.5-turbo-pro-image-to-video-output.mp4"
  }
}

Webhooks API | fal.ai Reference
Webhooks work in tandem with the queue system explained above, it is another way to interact with our queue. By providing us a webhook endpoint you get notified when the request is done as opposed to polling it.

Here is how this works in practice, it is very similar to submitting something to the queue but we require you to pass an extra fal_webhook query parameter.

To utilize webhooks, your requests should be directed to the queue.fal.run endpoint, instead of the standard fal.run. This distinction is crucial for enabling webhook functionality, as it ensures your request is handled by the queue system designed to support asynchronous operations and notifications.

Terminal window
curl --request POST \
  --url 'https://queue.fal.run/fal-ai/flux/dev?fal_webhook=https://url.to.your.app/api/fal/webhook' \
  --header "Authorization: Key $FAL_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
  "prompt": "Photo of a cute dog"
}'

The request will be queued and you will get a response with the request_id and gateway_request_id:

{
  "request_id": "024ca5b1-45d3-4afd-883e-ad3abe2a1c4d",
  "gateway_request_id": "024ca5b1-45d3-4afd-883e-ad3abe2a1c4d"
}

These two will be mostly the same, but if the request failed and was retried, gateway_request_id will have the value of the last tried request, while request_id will be the value used in the queue API.

Once the request is done processing in the queue, a POST request is made to the webhook URL, passing the request info and the resulting payload. The status indicates whether the request was successful or not.

When to use it?

Webhooks are particularly useful for requests that can take a while to process and/or the result is not needed immediately. For example, if you are training a model, which is a process than can take several minutes or even hours, webhooks could be the perfect tool for the job.

Successful result
The following is an example of a successful request:

{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "gateway_request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "OK",
  "payload": {
    "images": [
      {
        "url": "https://url.to/image.png",
        "content_type": "image/png",
        "file_name": "image.png",
        "file_size": 1824075,
        "width": 1024,
        "height": 1024
      }
    ],
    "seed": 196619188014358660
  }
}

Response errors
When an error happens, the status will be ERROR. The error property will contain a message and the payload will provide the error details. For example, if you forget to pass the required model_name parameter, you will get the following response:

{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "gateway_request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "ERROR",
  "error": "Invalid status code: 422",
  "payload": {
    "detail": [
      {
        "loc": ["body", "prompt"],
        "msg": "field required",
        "type": "value_error.missing"
      }
    ]
  }
}

Payload errors
For the webhook to include the payload, it must be valid JSON. So if there is an error serializing it, payload is set to null and a payload_error will include details about the error.

{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "gateway_request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "OK",
  "payload": null,
  "payload_error": "Response payload is not JSON serializable. Either return a JSON serializable object or use the queue endpoint to retrieve the response."
}

Retry policy
If the webhook fails to deliver the payload, it will retry 10 times in the span of 2 hours.

Verifying Your Webhook
To ensure the security and integrity of incoming webhook requests, you must verify that they originate from the expected source. This involves validating a cryptographic signature included in the request using a set of public keys. Below is a step-by-step guide to the verification process, followed by example implementations in Python and JavaScript.

Verification Process
Fetch the JSON Web Key Set (JWKS):

Retrieve the public keys from the JWKS endpoint: https://rest.alpha.fal.ai/.well-known/jwks.json.
The JWKS contains a list of public keys in JSON format, each with an x field holding a base64url-encoded ED25519 public key.
Note: The JWKS is cacheable to reduce network requests. Ensure your implementation caches the keys and refreshes them after the cache duration expires. Do not cache longer than 24 hours since they can change.
Extract Required Headers:

Obtain the following headers from the incoming webhook request:
X-Fal-Webhook-Request-Id: The unique request ID.
X-Fal-Webhook-User-Id: Your user ID.
X-Fal-Webhook-Timestamp: The timestamp when the request was generated (in Unix epoch seconds).
X-Fal-Webhook-Signature: The cryptographic signature in hexadecimal format.
If any header is missing, the request is invalid.
Verify the Timestamp:

Compare the X-Fal-Webhook-Timestamp with the current Unix timestamp.
Allow a leeway of ±5 minutes (300 seconds) to account for clock skew and network delays.
If the timestamp differs by more than 300 seconds, reject the request to prevent replay attacks.
Construct the Message:

Compute the SHA-256 hash of the request body (raw bytes, not JSON-parsed).
Concatenate the following in strict order, separated by newline characters (\n):
X-Fal-Webhook-Request-Id
X-Fal-Webhook-User-Id
X-Fal-Webhook-Timestamp
Hex-encoded SHA-256 hash of the request body
Encode the resulting string as UTF-8 bytes to form the message to verify.
Verify the Signature:

Decode the X-Fal-Webhook-Signature from hexadecimal to bytes.
For each public key in the JWKS:
Decode the x field from base64url to bytes.
Use an ED25519 verification function (e.g., from PyNaCl in Python or libsodium in JavaScript) to verify the signature against the constructed message.
If any key successfully verifies the signature, the request is valid.
If no key verifies the signature, the request is invalid.
Example Implementations
Below are simplified functions to verify webhook signatures by passing the header values and request body directly. These examples handle the verification process as described above and include JWKS caching.


Install dependencies:

Terminal window
npm install libsodium-wrappers node-fetch


Verification function:

const crypto = require('crypto');
const sodium = require('libsodium-wrappers');
const fetch = require('node-fetch');

const JWKS_URL = 'https://rest.alpha.fal.ai/.well-known/jwks.json';
const JWKS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
let jwksCache = null;
let jwksCacheTime = 0;

async function fetchJwks() {
    const currentTime = Date.now();
    if (!jwksCache || (currentTime - jwksCacheTime) > JWKS_CACHE_DURATION) {
        const response = await fetch(JWKS_URL, { timeout: 10000 });
        if (!response.ok) throw new Error(`JWKS fetch failed: ${response.status}`);
        jwksCache = (await response.json()).keys || [];
        jwksCacheTime = currentTime;
    }
    return jwksCache;
}

async function verifyWebhookSignature(requestId, userId, timestamp, signatureHex, body) {
    /*
     * Verify a webhook signature using provided headers and body.
     *
     * @param {string} requestId - Value of x-fal-webhook-request-id header.
     * @param {string} userId - Value of x-fal-webhook-user-id header.
     * @param {string} timestamp - Value of x-fal-webhook-timestamp header.
     * @param {string} signatureHex - Value of x-fal-webhook-signature header (hex-encoded).
     * @param {Buffer} body - Raw request body as a Buffer.
     * @returns {Promise<boolean>} True if the signature is valid, false otherwise.
     */
    await sodium.ready;

    // Validate timestamp (within ±5 minutes)
    try {
        const timestampInt = parseInt(timestamp, 10);
        const currentTime = Math.floor(Date.now() / 1000);
        if (Math.abs(currentTime - timestampInt) > 300) {
            console.error('Timestamp is too old or in the future.');
            return false;
        }
    } catch (e) {
        console.error('Invalid timestamp format:', e);
        return false;
    }

    // Construct the message to verify
    try {
        const messageParts = [
            requestId,
            userId,
            timestamp,
            crypto.createHash('sha256').update(body).digest('hex')
        ];
        if (messageParts.some(part => part == null)) {
            console.error('Missing required header value.');
            return false;
        }
        const messageToVerify = messageParts.join('\n');
        const messageBytes = Buffer.from(messageToVerify, 'utf-8');

        // Decode signature
        let signatureBytes;
        try {
            signatureBytes = Buffer.from(signatureHex, 'hex');
        } catch (e) {
            console.error('Invalid signature format (not hexadecimal).');
            return false;
        }

        // Fetch public keys
        let publicKeysInfo;
        try {
            publicKeysInfo = await fetchJwks();
            if (!publicKeysInfo.length) {
                console.error('No public keys found in JWKS.');
                return false;
            }
        } catch (e) {
            console.error('Error fetching JWKS:', e);
            return false;
        }

        // Verify signature with each public key
        for (const keyInfo of publicKeysInfo) {
            try {
                const publicKeyB64Url = keyInfo.x;
                if (typeof publicKeyB64Url !== 'string') continue;
                const publicKeyBytes = Buffer.from(publicKeyB64Url, 'base64url');
                const isValid = sodium.crypto_sign_verify_detached(signatureBytes, messageBytes, publicKeyBytes);
                if (isValid) return true;
            } catch (e) {
                console.error('Verification failed with a key:', e);
                continue;
            }
        }

        console.error('Signature verification failed with all keys.');
        return false;
    } catch (e) {
        console.error('Error constructing message:', e);
        return false;
    }
}


Usage Notes
Caching the JWKS: The JWKS can be cached for 24 hours to minimize network requests. The example implementations include basic in-memory caching.
Timestamp Validation: The ±5-minute leeway ensures robustness against minor clock differences. Adjust this value if your use case requires stricter or looser validation.
Error Handling: The examples include comprehensive error handling for missing headers, invalid signatures, and network issues. Log errors appropriately for debugging.
Framework Integration: For frameworks like FastAPI (Python) or Express (JavaScript), ensure the raw request body is accessible. For Express, use express.raw({ type: 'application/json' }) middleware before JSON parsing.