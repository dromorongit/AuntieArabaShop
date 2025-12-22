# Cloudinary Upload Preset - Step by Step Visual Guide

## 🎯 What You're Looking For

You need to find the **Upload Presets** section in Cloudinary settings. Here's exactly where to look:

## 📍 Navigation Path

### Option 1: Left Sidebar Method
1. **Look at the LEFT SIDEBAR** of your Cloudinary dashboard
2. Find an icon that looks like a **gear/settings icon** (⚙️) or the word "Settings"
3. Click on **Settings**
4. Look for **"Upload"** in the settings menu
5. Click on **"Upload"**
6. You should see a section called **"Upload presets"**
7. Click **"Add upload preset"**

### Option 2: Top Menu Method
1. Look at the **TOP RIGHT** of your dashboard
2. Click on your **account name** or **profile picture**
3. Look for **"Settings"** or **"Account Settings"**
4. Navigate to **"Upload"** section
5. Find **"Upload presets"**
6. Click **"Add upload preset"**

## 🔍 What Upload Presets Look Like

**Upload Presets** is a different section from:
- ❌ **Media Library** (where you see your uploaded files)
- ❌ **Assets** (your folders and files)
- ❌ **Transformations** (image editing options)

**Upload Presets** is for **configuring how files are uploaded**, not for viewing uploaded files.

## 🔍 Interface Variations

**Note: Cloudinary has different interfaces for different account types. You might be on a Business/Enterprise interface.**

### Your Current Interface Settings:
- My Profile
- Account  
- Product Environments
- User Management
- Account Security

### Alternative Locations for Upload Presets:

**Option A: Look in "Account" Section**
1. Click on **Account** in your settings
2. Look for **Upload**, **Media**, or **Storage** subsections
3. Or look for **API** or **Developer** settings

**Option B: Look in "Product Environments"**
1. Click on **Product Environments**
2. Look for upload-related settings
3. Check for media upload configurations

**Option C: Left Sidebar Navigation**
1. Look at the **LEFT SIDEBAR** of your dashboard
2. Look for icons like:
   - Upload icon (⬆️)
   - Media icon (📁)
   - Settings gear (⚙️)
   - Cloud icon (☁️)

**Option D: Search Function**
1. Use **Ctrl+F** (or **Cmd+F** on Mac)
2. Search for: `upload preset`
3. Or search for: `unsigned`
4. Or search for: `preset`

## 🎯 What to Look For

Instead of "Upload" section, look for:
- **Media Settings**
- **Upload Settings** 
- **API Settings**
- **Developer Settings**
- **Storage Settings**
- **Media Library Settings**

## 📍 Alternative Navigation Paths

## ❌ Important: Collections ≠ Upload Presets

**Collections** and **Upload Presets** are DIFFERENT things:

### 📁 Collections (What You Found)
- **Purpose**: Organizing and grouping your uploaded files
- **Location**: Media Library section
- **Function**: Like folders to categorize your images/videos
- **Example**: "Product Images", "Payment Screenshots", "Logos"
- **This is NOT what you need for uploads**

### ⚙️ Upload Presets (What You Need)
- **Purpose**: Configuring HOW files are uploaded
- **Location**: Settings/Configuration section
- **Function**: Define upload rules (file size, formats, transformations)
- **Example**: "Max 5MB", "JPG/PNG only", "Auto-optimize"
- **This is what you need for your website**

### 🔍 Continue Looking for Upload Presets

Since you found Collections, you're in the Media Library area. Look for:

**Option A: Settings in Left Sidebar**
1. Look for **Settings icon** (⚙️) in left sidebar
2. Click Settings
3. Look for **Upload** or **Media** or **API** section

**Option B: Account Settings**
1. Go back to **Account** section
2. Scroll through all subsections
3. Look for: Upload, Media Settings, API, Developer, or Storage

**Option C: Search Function**
1. Use **Ctrl+F** (Cmd+F on Mac)
2. Search for: `upload preset` or `unsigned` or `preset`
3. The page should highlight where this setting exists

### 💡 Quick Decision

**If you can't find Upload Presets:**
- **Option 1**: Continue using Demo Mode (works perfectly for testing)
- **Option 2**: Contact Cloudinary support asking specifically about "Upload Presets in Settings"
- **Option 3**: Ask them about "unsigned client-side upload configuration"

**Remember**: Collections is for organizing files AFTER upload. Upload Presets is for configuring the upload process itself.

## 🆘 If You Still Can't Find It

### Try These Steps:

1. **Refresh your page** and look again
2. **Log out and log back in** to Cloudinary
3. **Clear your browser cache**
4. **Try a different browser**

### Alternative Search:
- Use **Ctrl+F** (or **Cmd+F** on Mac) to search for "upload preset" on the page
- Type "upload" in the search bar of your Cloudinary dashboard

### Check Your Account Type:
- Free accounts should have access to upload presets
- If you don't see Settings, you might need to upgrade your account
- Contact Cloudinary support if you still can't find it

## 📋 Configuration Details

Once you find the Upload Presets section, configure it exactly like this:

```
Preset name: auntie_araba_orders
Signing mode: Unsigned
Folder: payment-screenshots
Access mode: Public

Allowed formats:
☑️ jpg
☑️ jpeg  
☑️ png
☑️ gif

Max file size: 5MB
Auto-optimize: Enabled
Format conversion: Auto
```

## 🎯 After Creating the Preset

1. **Save the preset**
2. **Go back to your website**
3. **Test the upload functionality**
4. **Switch from demo mode to production mode** by changing `DEMO_MODE` to `false` in checkout.html

## 💡 Pro Tips

- The preset name must be **exactly** `auntie_araba_orders` (case sensitive)
- "Unsigned" mode allows client-side uploads without API keys
- The folder `payment-screenshots` will be created automatically
- You can always edit the preset later if needed

## 🆘 Alternative Solution - No Upload Preset Required

**If you can't find Upload Presets in your interface, try this alternative:**

### Method: Using Signed Uploads with API Key

Instead of creating an upload preset, we can modify the code to use your API key directly:

**Step 1: Get Your API Key**
1. Go to **Account** section in your settings
2. Look for **API Keys** or **Developer** section
3. Copy your **API Key** (not the secret)

**Step 2: Alternative Code Configuration**
Replace the Cloudinary configuration in `checkout.html` with this:

```javascript
// Alternative Cloudinary configuration (for interfaces without upload presets)
const CLOUDINARY_UPLOAD_PRESET = ''; // Leave empty
const CLOUDINARY_CLOUD_NAME = 'dzngjsqpe';
const CLOUDINARY_API_KEY = 'YOUR_API_KEY_HERE'; // Add your API key
const DEMO_MODE = false; // Set to false for real uploads

// Modified upload function for signed uploads
async function uploadToCloudinary() {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = await generateSignature(timestamp);
    
    const formData = new FormData();
    formData.append('file', screenshotFile);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', 'payment-screenshots');

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        document.getElementById('progress-fill').style.width = progress + '%';
    }, 200);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData
        }
    );

    clearInterval(progressInterval);
    document.getElementById('progress-fill').style.width = '100%';

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    const result = await response.json();
    uploadedScreenshotUrl = result.secure_url;
}

// Simple signature generation (you'll need to implement this on server-side)
async function generateSignature(timestamp) {
    // For now, let's keep using demo mode until you can set up upload presets
    return 'demo_signature';
}
```

**Step 3: Continue with Demo Mode for Now**
- Keep `DEMO_MODE = true` for immediate testing
- The upload interface will work perfectly
- Users can test the complete flow
- Later you can implement proper signed uploads

### 📨 Contact Cloudinary Support

If you still can't find upload settings:
1. Email: support@cloudinary.com
2. Include your account email
3. Ask: "How do I create upload presets in my Business/Enterprise account?"
4. Mention you need unsigned upload presets for client-side uploads

### 💡 Quick Test Without Cloudinary

You can test the entire user flow right now:
1. Open your checkout page
2. Select mobile money
3. Click upload button
4. Try uploading a file
5. The demo will simulate the entire process
6. Users will see professional upload interface
7. Orders will include demo screenshot URLs

This gives you a fully functional system for testing while you work on the Cloudinary setup!