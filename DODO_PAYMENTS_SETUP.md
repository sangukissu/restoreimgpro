# DodoPayments Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# DodoPayments Configuration
DODO_PAYMENTS_API_KEY=your_dodo_payments_api_key_here
DODO_PRODUCT_ID=your_dodo_product_id_here
DODO_WEBHOOK_SECRET=your_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## DodoPayments Configuration

### 1. Create a Product
- Log into your DodoPayments dashboard
- Create a new product with:
  - **Name**: Basic Plan
  - **Price**: $2.00
  - **Product ID**: Use this as your `DODO_PRODUCT_ID`

### 2. Get API Key
- In DodoPayments dashboard, go to API settings
- Copy your API key to `DODO_PAYMENTS_API_KEY`

### 3. Configure Webhook
- Set webhook URL to: `https://bringback.pro/api/webhooks/dodopayments`
- Copy webhook secret to `DODO_WEBHOOK_SECRET`

## How It Works

### Payment Flow:
1. User clicks "Get Started - $2"
2. App creates payment via DodoPayments API
3. User is redirected to DodoPayments checkout
4. After payment, webhook updates user credits (+5)
5. User can restore 5 images

### Credit System:
- **Purchase**: $2 for 5 credits
- **Usage**: 1 credit per image restoration
- **Deduction**: Automatic via `/api/deduct-credits` endpoint

## Testing

### Local Development:
- Use DodoPayments test mode
- Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Test webhook with ngrok or similar

### Production:
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Ensure webhook URL is publicly accessible
- Use DodoPayments live mode

## Database Tables

The system uses these tables (already created):
- `payments` - Payment records
- `user_profiles` - User credits
- `webhook_events` - Webhook tracking

## Troubleshooting

### Common Issues:
1. **Webhook not working**: Check webhook URL and secret
2. **Credits not added**: Verify webhook is processing
3. **Payment creation fails**: Check API key and product ID

### Logs:
- Check browser console for frontend errors
- Check server logs for API errors
- Check webhook processing in database
