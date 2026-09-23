import os
import sys
import argparse
import mimetypes
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

# If modifying these scopes, delete the file token.json.
# Using 'drive.file' scope to limit permissions to files created or opened by the app.
# If you need broader access, you can add 'https://www.googleapis.com/auth/drive'.
SCOPES = ["https://www.googleapis.com/auth/drive.file"]


def authenticate():
    """Authenticates the user and returns the credentials.

    Looks for 'token.json' first, then falls back to 'credentials.json'
    to run the local server auth flow.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists("credentials.json"):
                print(
                    "Error: 'credentials.json' file not found.\n"
                    "Please download your OAuth 2.0 Desktop client credentials from "
                    "the Google Cloud Console and save them as 'credentials.json' in this directory."
                )
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    return creds


def upload_file(file_path, drive_filename=None, folder_id=None, convert_to_docs=False):
    """Uploads a local file to Google Drive.

    Args:
        file_path (str): Path to the local file to upload.
        drive_filename (str, optional): The name of the file on Google Drive.
        folder_id (str, optional): The ID of the folder to upload to.
        convert_to_docs (bool, optional): Whether to convert the file to Google Docs/Sheets/Slides format.
    """
    if not os.path.exists(file_path):
        print(f"Error: Local file '{file_path}' does not exist.")
        return None

    # Determine filename on Drive
    if not drive_filename:
        drive_filename = os.path.basename(file_path)

    # Detect MIME type
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type:
        mime_type = "application/octet-stream"

    print(f"Detected MIME type for local file: {mime_type}")

    # Authenticate and build service
    creds = authenticate()
    try:
        service = build("drive", "v3", credentials=creds)

        # File metadata
        file_metadata = {"name": drive_filename}

        # Handle uploading to a specific folder
        if folder_id:
            file_metadata["parents"] = [folder_id]

        # Handle document format conversion (e.g., CSV to Sheets, docx to Docs)
        if convert_to_docs:
            # Common conversions
            conversion_map = {
                "text/csv": "application/vnd.google-apps.spreadsheet",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "application/vnd.google-apps.spreadsheet",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "application/vnd.google-apps.document",
                "text/plain": "application/vnd.google-apps.document",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": "application/vnd.google-apps.presentation",
            }
            target_mime = conversion_map.get(mime_type)
            if target_mime:
                file_metadata["mimeType"] = target_mime
                print(f"Converting to Google Workspace format: {target_mime}")
            else:
                print(
                    f"Warning: No Google Workspace format conversion mapping found for {mime_type}."
                )

        # Upload media setup
        media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)

        print(f"Uploading '{file_path}' to Google Drive...")

        # Perform the upload
        file = (
            service.files()
            .create(body=file_metadata, media_body=media, fields="id, name, webViewLink")
            .execute()
        )

        print(f"\nSuccess! File uploaded successfully.")
        print(f"File Name: {file.get('name')}")
        print(f"File ID: {file.get('id')}")
        print(f"Web View Link: {file.get('webViewLink')}")
        return file.get("id")

    except HttpError as error:
        print(f"An error occurred: {error}")
        return None


def main():
    parser = argparse.ArgumentParser(
        description="Upload a local file to Google Drive using Google Drive API v3."
    )
    parser.add_argument("file", help="Path to the local file to upload")
    parser.add_argument(
        "-n", "--name", help="Name to display on Google Drive (defaults to local filename)"
    )
    parser.add_argument(
        "-f", "--folder", help="Optional Google Drive Folder ID to upload into"
    )
    parser.add_argument(
        "-c",
        "--convert",
        action="store_true",
        help="Convert to Google Workspace format (e.g. CSV to Google Sheets)",
    )

    args = parser.parse_args()
    upload_file(
        file_path=args.file,
        drive_filename=args.name,
        folder_id=args.folder,
        convert_to_docs=args.convert,
    )


if __name__ == "__main__":
    main()
