# Cloudinary Configuration for Auntie Araba Shop

## Overview
This document provides instructions for setting up Cloudinary to handle payment screenshot uploads for mobile money orders.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address
4. Access your dashboard

## Step 2: Get Your Cloudinary Credentials

1. In your Cloudinary dashboard, go to **Settings** → **Account**
2. Note down your:
   - **Cloud name**
   - **API Key**
   - **API Secret** (keep this secure)

## Step 3: Create an Upload Preset

**⚠️ Important: You need to access the Settings section, not the Media Library!**

### Method 1: Direct Settings Access
1. Look for **Settings** in the left sidebar (gear icon ⚙️)
2. Click on **Settings**
3. In the Settings menu, click on **Upload**
4. Click **Add upload preset**

### Method 2: Alternative Navigation
1. Click on your account name/avatar in the top-right corner
2. Look for **Settings** or **Account Settings**
3. Navigate to **Upload** section
4. Click **Add upload preset**

### Configure the Upload Preset:
1. **Preset name**: `auntie_araba_orders` (exactly this name)
2. **Signing mode**: Select `Unsigned`
3. **Folder**: `payment-screenshots`
4. **Allowed formats**: Check `jpg`, `png`, `gif`
5. **Max file size**: `5MB`
6. **Auto-optimize**: `Enabled`
7. **Format conversion**: `Auto`
8. **Access mode**: `Public`

### If you still can't find it:
- Try refreshing the page
- Check if you're logged into the correct Cloudinary account
- Look for a "hamburger menu" (☰) icon that might contain additional options
- The Settings section should have multiple subsections including Upload, Account, Security, etc.

## Step 4: Update Configuration

1. Open `checkout.html`
2. Find the Cloudinary configuration section (around line 546):

```javascript
// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'auntie_araba_orders'; // Your preset name
const CLOUDINARY_CLOUD_NAME = 'dzngjsqpe'; // Your actual cloud name
```

3. The cloud name is already configured with your actual cloud name: `dzngjsqpe`
4. Make sure your upload preset name is: `auntie_araba_orders`

## Step 5: Test the Integration

1. Open the checkout page
2. Select "Mobile Money" payment
3. Click "I've completed payment, Upload payment screenshot"
4. Try uploading an image to verify it works

## Security Notes

- Keep your API Secret secure and never expose it in client-side code
- Use unsigned presets for client-side uploads
- Consider implementing server-side validation for production use
- Monitor your Cloudinary usage and set up billing alerts if needed

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your domain is added to Cloudinary's allowed domains
2. **Upload Failures**: Check that the preset name matches exactly
3. **File Size Issues**: Verify the preset allows the file size you're testing

### File Type Validation:
The code currently validates:
- Image files only (jpg, png, gif)
- Maximum file size: 5MB
- MIME type checking

## Production Considerations

1. **Server-side validation**: Consider adding server-side validation for uploaded files
2. **Image processing**: Implement automatic image compression and optimization
3. **Backup storage**: Consider storing screenshots in multiple locations
4. **Access control**: Implement proper access controls for viewing screenshots
5. **File cleanup**: Set up automatic deletion of old screenshots

## Cost Optimization

- Free tier: 25GB storage, 25GB bandwidth per month
- Monitor usage to avoid unexpected charges
- Implement image optimization to reduce bandwidth usage
- Consider using WebP format for better compression

## Support

For Cloudinary support:
- Documentation: https://cloudinary.com/documentation
- Community Forum: https://support.cloudinary.com/
- Support tickets available for paid plans