import { TaskAttachment } from '../types/task';

const DB_NAME = 'HOD_Department_Task_Files_DB';
const DB_VERSION = 1;
const STORE_NAME = 'attachments_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Stores file blob persistently into browser IndexedDB
 */
export async function saveAttachmentFile(id: string, file: Blob | File): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(file, id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieves file blob from IndexedDB by attachment ID
 */
export async function getAttachmentFile(id: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    req.onsuccess = () => {
      resolve(req.result || null);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Removes file from IndexedDB
 */
export async function deleteAttachmentFile(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Triggers browser download of the stored attachment
 */
export async function downloadAttachment(attachment: TaskAttachment): Promise<void> {
  try {
    const blob = await getAttachmentFile(attachment.id);
    if (!blob) {
      // If sample demo or file not in indexedDB, create a fallback placeholder document
      const fallbackBlob = new Blob(
        [
          `DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING\nHEAD OF DEPARTMENT ARCHIVES\n\nFile: ${attachment.name}\nUploaded: ${attachment.uploadedAt}\n\nThis document is archived for official institutional reference.`,
        ],
        { type: attachment.type || 'text/plain' }
      );
      triggerBlobDownload(fallbackBlob, attachment.name);
      return;
    }
    triggerBlobDownload(blob, attachment.name);
  } catch (error) {
    console.error('Error downloading attachment:', error);
    alert('Could not download the file.');
  }
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
