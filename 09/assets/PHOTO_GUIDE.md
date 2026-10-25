npm# How to Add & Replace Your Profile Photo

This guide explains how to add your own real photograph to your Student Profile Web Page.

---

## Method 1: Instant Upload from Browser (Easiest)

1. Open `index.html` in your web browser.
2. Click on the **Camera Icon** located on the bottom-right of the profile photo.
3. In the popup modal, under **Option 1**, click **"Select Image File..."**.
4. Choose any photo from your computer (`.jpg`, `.png`, `.webp`).
5. Your photo will update immediately on the profile page!

---

## Method 2: Permanent Folder Replacement

If you want your photo to remain saved automatically every time you open `index.html`:

1. Copy your photograph into the `assets/` directory of this project:
   ```
   assignment/
   └── assets/
       └── my_photo.png   <-- Place your photo here
   ```

2. Open `index.html` in a text editor (VS Code, Notepad, etc.).
3. Find the `<img>` tag around **Line 37**:
   ```html
   <img src="assets/profile_avatar.png" alt="Anjitha V Profile Photo" class="avatar-img" id="profileAvatarImg">
   ```
4. Change `assets/profile_avatar.png` to your photo filename (for example `assets/my_photo.png`):
   ```html
   <img src="assets/my_photo.png" alt="Anjitha V Profile Photo" class="avatar-img" id="profileAvatarImg">
   ```
5. Save the file and refresh your browser!

---

### Tips for Best Results
- **Recommended Ratio:** Square photo (1:1 ratio, e.g., 400x400 pixels or 600x600 pixels).
- **Format:** PNG or JPEG.
- **Style:** Clean, professional headshot or formal portrait.
