"""
Storage Service
Handles file uploads to Supabase Storage.
"""

import os
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    logger.warning("Supabase URL or Key is missing. Storage service is disabled.")

# Default bucket name
BUCKET_NAME = "attachments"

def ensure_bucket_exists():
    """Ensure the storage bucket exists, create it if not."""
    if not supabase:
        return
    try:
        buckets = supabase.storage.list_buckets()
        bucket_names = [b.name for b in buckets]
        if BUCKET_NAME not in bucket_names:
            supabase.storage.create_bucket(BUCKET_NAME, options={'public': True})
            logger.info(f"Created Supabase bucket: {BUCKET_NAME}")
    except Exception as e:
        logger.error(f"Error checking/creating bucket: {e}")

def upload_file(file_obj, filename: str) -> str:
    """
    Upload a file-like object to Supabase Storage.
    Returns the public URL of the uploaded file.
    """
    if not supabase:
        raise ValueError("Supabase client is not initialized. Cannot upload file.")
    
    try:
        ensure_bucket_exists()
        
        # Upload the file
        # file_obj should be read in binary mode.
        file_bytes = file_obj.read()
        
        # If it's a werkzeug FileStorage, we can get the mimetype
        content_type = getattr(file_obj, 'content_type', 'application/octet-stream')
        if not content_type:
            content_type = 'application/octet-stream'

        res = supabase.storage.from_(BUCKET_NAME).upload(
            file=file_bytes,
            path=filename,
            file_options={"content-type": content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(filename)
        return public_url
    except Exception as e:
        logger.error(f"Failed to upload {filename} to Supabase: {e}")
        raise e
