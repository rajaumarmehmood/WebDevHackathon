# Supabase Storage Setup Guide

## Create Resume Storage Bucket

### Step 1: Create the Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `Resume` (exactly as shown, case-sensitive)
   - **Public bucket**: ✅ Check this box (so resume PDFs can be accessed via public URLs)
   - **File size limit**: 10 MB (optional, for safety)
   - **Allowed MIME types**: `application/pdf` (optional, for validation)
5. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

After creating the bucket, set up Row Level Security (RLS) policies:

#### Policy 1: Allow Users to Upload Their Own Resumes

```sql
CREATE POLICY "Users can upload own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Resume' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Allow Users to Read Their Own Resumes

```sql
CREATE POLICY "Users can read own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'Resume' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Allow Users to Update Their Own Resumes

```sql
CREATE POLICY "Users can update own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'Resume' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 4: Allow Users to Delete Their Own Resumes

```sql
CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'Resume' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 5: Allow Public Read Access (for public URLs)

```sql
CREATE POLICY "Public can read resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'Resume');
```

### Step 3: Verify Setup

1. Go to **Storage** → **Resume** bucket
2. Click on **Policies** tab
3. Verify all 5 policies are listed and enabled

### Step 4: Test Upload

1. Run your application
2. Navigate to the upload resume page
3. Upload a PDF file
4. Check the Supabase Storage dashboard
5. You should see a folder with your user ID containing the uploaded PDF

## File Structure

Files are organized by user ID:

```
Resume/
├── user-id-1/
│   └── user-id-1-1234567890.pdf
├── user-id-2/
│   └── user-id-2-1234567891.pdf
└── ...
```

## Public URLs

After upload, files are accessible via public URLs:

```
https://[project-ref].supabase.co/storage/v1/object/public/Resume/[user-id]/[filename].pdf
```

These URLs are stored in the `resumes` table in the `file_url` column.

## Security Notes

1. **User Isolation**: Each user can only access files in their own folder (enforced by RLS)
2. **Public Access**: Files are publicly accessible via URL (needed for viewing/downloading)
3. **Authentication**: Upload/update/delete operations require authentication
4. **File Validation**: Only PDF files are accepted (enforced in API route)
5. **Size Limit**: 10MB maximum file size (enforced in API route)

## Troubleshooting

### Error: "new row violates row-level security policy"

**Solution**: Make sure the RLS policies are set up correctly. The user must be authenticated and the file path must start with their user ID.

### Error: "Bucket not found"

**Solution**: Verify the bucket name is exactly `Resume` (case-sensitive).

### Error: "Permission denied"

**Solution**: 
1. Check that the user is authenticated
2. Verify the RLS policies are enabled
3. Ensure the file path includes the user ID as the first folder

### Files Not Showing in Storage

**Solution**:
1. Check the browser console for errors
2. Verify the upload was successful (check API response)
3. Look in the correct user folder in Storage dashboard

### Public URLs Not Working

**Solution**:
1. Ensure the bucket is marked as "Public"
2. Verify the "Public can read resumes" policy is enabled
3. Check that the URL format is correct

## Migration from Old System

If you had resumes uploaded before this change:
- Old resumes were not stored in Supabase Storage
- Users will need to re-upload their resumes
- The new system will store both the PDF file and the analysis

## Benefits of Storage Integration

1. **Persistence**: PDF files are permanently stored
2. **Accessibility**: Users can download their original resume
3. **Backup**: Files are backed up by Supabase
4. **Scalability**: Can handle millions of files
5. **CDN**: Files are served via CDN for fast access
6. **Version Control**: Can implement versioning if needed

## Next Steps

1. Create the `Resume` bucket in Supabase
2. Set up the RLS policies
3. Test the upload functionality
4. Verify files appear in Storage dashboard
5. Test downloading files via public URLs
