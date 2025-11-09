The frontend requires some changes to provide the CAPTCHA on-screen for the user. Turnstile can be used with any JavaScript framework but we'll use React and the Turnstile React component for this example.

Install @marsidev/react-turnstile in your project as a dependency.

npm install @marsidev/react-turnstile
Now import the Turnstile component from the @marsidev/react-turnstile library.

import { Turnstile } from '@marsidev/react-turnstile'
Let's create an empty state to store our captchaToken

const [captchaToken, setCaptchaToken] = useState()
Now lets add the Cloudflare Turnstile component to the JSX section of our code:

<Turnstile />
We will pass it the sitekey we copied from the Cloudflare website as a property along with a onSuccess property which takes a callback function. This callback function will have a token as one of its properties. Let's set the token in the state using setCaptchaToken:

<Turnstile
  siteKey="your-sitekey"
  onSuccess={(token) => {
    setCaptchaToken(token)
  }}
/>
We can now use the captchaToken we receive in our Supabase signUp function.

await supabase.auth.signUp({
  email,
  password,
  options: { captchaToken },
})
To test locally, you will need to add localhost to the domain allowlist as per the Cloudflare docs

Run the application and you should now be provided with a CAPTCHA challenge.