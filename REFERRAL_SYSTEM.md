# Customer Referral System

## Overview
The customer referral system allows existing users to refer friends and earn credits when their referrals make their first purchase. This system is designed for low-ticket products ($2.49 and $4.99) and focuses on customer-to-customer referrals rather than affiliate marketing.

## Features

### For Referrers
- **Unique Referral Code**: Each user gets a unique 8-character referral code
- **Share Links**: Easy sharing via social media, email, or direct link
- **Earnings**: Earn 1 credit for each successful referral (when referred user makes first purchase)
- **Analytics**: Track total referrals, successful conversions, and credits earned
- **Dashboard**: Dedicated referrals page at `/dashboard/referrals`

### For New Users
- **Referral Input**: Enter referral codes during signup/login
- **URL Support**: Referral codes can be passed via URL parameter `?ref=CODE123`
- **Automatic Processing**: Referral relationships are created automatically upon first purchase

## Database Schema

### Tables Created
1. **referral_codes**: Stores unique referral codes for each user
2. **referrals**: Tracks referral relationships and their status
3. **referral_settings**: Global settings for the referral program
4. **referral_analytics**: Aggregated analytics data

### Key Functions
- `generate_referral_code()`: Creates unique 8-character codes
- `create_referral_code_for_user()`: Auto-creates codes for new users
- `process_referral_reward()`: Processes rewards when referrals make purchases
- `create_referral_relationship()`: Links referrers with referred users

## API Endpoints

### `/api/referrals/my-code`
- **Method**: GET
- **Purpose**: Fetch user's referral code and statistics
- **Returns**: Referral code, total referrals, successful referrals, credits earned

### `/api/referrals/apply`
- **Method**: POST
- **Purpose**: Apply a referral code for a new user
- **Body**: `{ "referral_code": "ABC12345" }`
- **Returns**: Success/error status

### `/api/referrals/settings`
- **Method**: GET
- **Purpose**: Get referral program settings
- **Returns**: Reward amount, program status, terms

## Components

### ReferralDashboard
- Location: `/components/referral-dashboard.tsx`
- Purpose: Main dashboard showing referral code, share options, and statistics
- Features: Copy to clipboard, social sharing, analytics display

### ReferralInput
- Location: `/components/referral-input.tsx`
- Purpose: Input field for entering referral codes during signup
- Features: Code validation, error handling, success feedback

### ReferralHandler
- Location: `/components/referral-handler.tsx`
- Purpose: Processes referral codes from URL parameters
- Features: Auto-applies codes, handles unauthenticated users

## Hooks

### useReferrals
- Location: `/hooks/use-referrals.ts`
- Purpose: Manages referral data and API interactions
- Functions: `fetchReferralData()`, `applyReferralCode()`, `shareReferralLink()`

## Integration Points

### Webhook Integration
- **File**: `/app/api/webhooks/dodopayments/route.ts`
- **Purpose**: Processes referral rewards when payments succeed
- **Function**: Calls `processReferralReward()` on successful payments

### Navigation
- **File**: `/components/dashboard-header.tsx`
- **Purpose**: Adds referrals link to dashboard navigation
- **Location**: Both desktop and mobile dropdown menus

### URL Processing
- **File**: `/app/layout.tsx`
- **Purpose**: Includes ReferralHandler to process URL parameters
- **Behavior**: Automatically handles `?ref=CODE123` parameters

## Settings & Configuration

### Default Settings
- **Reward Amount**: 1 credit per successful referral
- **Program Status**: Active
- **Terms**: "Earn 1 credit for each friend who makes their first purchase"

### Customization
Settings can be modified in the `referral_settings` table:
```sql
UPDATE referral_settings SET 
  reward_amount = 2,  -- Change reward amount
  is_active = false   -- Disable program
WHERE id = 1;
```

## Security Features

### Row Level Security (RLS)
- All tables have RLS policies enabled
- Users can only access their own referral data
- Service role has full access for webhook processing

### Code Generation
- Uses cryptographically secure random generation
- Ensures uniqueness across all codes
- 8-character length for easy sharing

## Usage Examples

### Sharing a Referral
```javascript
const shareUrl = `https://bringback.pro/?ref=${referralCode}`;
// Share via social media, email, or messaging
```

### Processing URL Parameters
```javascript
// Automatic processing via ReferralHandler component
// No manual intervention required
```

### Checking Referral Status
```javascript
const { data } = await useReferrals();
console.log(`Total referrals: ${data.total_referrals}`);
console.log(`Credits earned: ${data.credits_earned}`);
```

## Future Enhancements

### Potential Features
1. **Tiered Rewards**: Different rewards based on referral volume
2. **Time-Limited Bonuses**: Special promotions for referrers
3. **Referral Contests**: Leaderboards and competitions
4. **Advanced Analytics**: Detailed conversion tracking
5. **Custom Codes**: Allow users to create custom referral codes
6. **Expiration Dates**: Set expiration for referral codes

### Analytics Expansion
- Conversion rates by referrer
- Geographic distribution of referrals
- Time-based referral patterns
- Most effective sharing channels

## Troubleshooting

### Common Issues
1. **Referral code not working**: Check if code exists and is active
2. **Reward not processed**: Verify webhook is functioning correctly
3. **Duplicate codes**: Regenerate code if collision occurs
4. **Missing navigation**: Ensure dashboard header is updated

### Database Queries for Debugging
```sql
-- Check referral code status
SELECT * FROM referral_codes WHERE user_id = 'user-uuid';

-- View referral relationships
SELECT * FROM referrals WHERE referrer_id = 'user-uuid';

-- Check reward processing
SELECT * FROM referral_analytics WHERE user_id = 'user-uuid';
```