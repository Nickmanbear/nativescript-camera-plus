/**********************************************************************************
 * (c) 2017, nStudio, LLC & LiveShopper, LLC
 * Licensed under a Commercial license.
 *
 * Version 1.1.0                                       			   team@nStudio.io
 **********************************************************************************/
import { Application, ImageAsset, ImageSource } from '@nativescript/core';
export class SelectedAsset extends ImageAsset {
    constructor(uri) {
        super(SelectedAsset._calculateFileUri(uri));
        this._uri = uri;
        this._thumbRequested = false;
    }
    data() {
        return Promise.reject(new Error('Not implemented.'));
    }
    getImage(options) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.decodeUri(this._uri, options));
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    getImageData() {
        return new Promise((resolve, reject) => {
            try {
                if (!this._data) {
                    const bb = this.getByteBuffer(this._uri);
                    this._data = ArrayBuffer.from(bb);
                }
                resolve(this._data);
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    // [Deprecated. Please use thumbAsset instead.]
    get thumb() {
        if (!this._thumbRequested) {
            this.decodeThumbUri();
        }
        return this._thumb;
    }
    get thumbAsset() {
        return this._thumbAsset;
    }
    setThumbAsset(value) {
        this._thumbAsset = value;
        this.notifyPropertyChange('thumbAsset', value);
    }
    get uri() {
        return this._uri.toString();
    }
    get fileUri() {
        if (!this._fileUri) {
            this._fileUri = SelectedAsset._calculateFileUri(this._uri);
        }
        return this._fileUri;
    }
    static _calculateFileUri(uri) {
        const isKitKat = android.os.Build.VERSION.SDK_INT >= 19; // android.os.Build.VERSION_CODES.KITKAT
        if (isKitKat && android.provider.DocumentsContract && android.provider.DocumentsContract.isDocumentUri(Application.android.context, uri)) {
            // externalStorageProvider
            if (SelectedAsset.isExternalStorageDocument(uri)) {
                const docId = android.provider.DocumentsContract.getDocumentId(uri);
                const id = docId.split(':')[1];
                const type = docId.split(':')[0];
                if ('primary' === type.toLowerCase()) {
                    return android.os.Environment.getExternalStorageDirectory() + '/' + id;
                }
                // tODO handle non-primary volumes
            }
            else if (SelectedAsset.isDownloadsDocument(uri)) {
                // downloadsProvider
                const id = android.provider.DocumentsContract.getDocumentId(uri);
                const contentUri = android.content.ContentUris.withAppendedId(android.net.Uri.parse('content://downloads/public_downloads'), long(id));
                return SelectedAsset.getDataColumn(contentUri, null, null);
            }
            else if (SelectedAsset.isMediaDocument(uri)) {
                // mediaProvider
                const docId = android.provider.DocumentsContract.getDocumentId(uri);
                const split = docId.split(':');
                const type = split[0];
                const id = split[1];
                let contentUri = null;
                if ('image' === type) {
                    contentUri = android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                }
                else if ('video' === type) {
                    contentUri = android.provider.MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                }
                else if ('audio' === type) {
                    contentUri = android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }
                const selection = '_id=?';
                const selectionArgs = [id];
                return SelectedAsset.getDataColumn(contentUri, selection, selectionArgs);
            }
        }
        else {
            // mediaStore (and general)
            if ('content' === uri.getScheme()) {
                return SelectedAsset.getDataColumn(uri, null, null);
            }
            else if ('file' === uri.getScheme()) {
                // file
                return uri.getPath();
            }
        }
        return undefined;
    }
    static getDataColumn(uri, selection, selectionArgs) {
        let cursor = null;
        const columns = [android.provider.MediaStore.MediaColumns.DATA];
        let filePath;
        try {
            cursor = this.getContentResolver().query(uri, columns, selection, selectionArgs, null);
            if (cursor != null && cursor.moveToFirst()) {
                const column_index = cursor.getColumnIndexOrThrow(columns[0]);
                filePath = cursor.getString(column_index);
                if (filePath) {
                    return filePath;
                }
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {
            if (cursor) {
                cursor.close();
            }
        }
        return undefined;
    }
    static isExternalStorageDocument(uri) {
        return 'com.android.externalstorage.documents' === uri.getAuthority();
    }
    static isDownloadsDocument(uri) {
        return 'com.android.providers.downloads.documents' === uri.getAuthority();
    }
    static isMediaDocument(uri) {
        return 'com.android.providers.media.documents' === uri.getAuthority();
    }
    decodeThumbUri() {
        // decode image size
        const REQUIRED_SIZE = {
            maxWidth: 100,
            maxHeight: 100,
        };
        // decode with scale
        this._thumb = this.decodeUri(this._uri, REQUIRED_SIZE);
        this.notifyPropertyChange('thumb', this._thumb);
    }
    decodeThumbAssetUri() {
        // decode image size
        const REQUIRED_SIZE = {
            maxWidth: 100,
            maxHeight: 100,
        };
        // decode with scale
        this._thumbAsset = this.decodeUriForImageAsset(this._uri, REQUIRED_SIZE);
        this.notifyPropertyChange('thumbAsset', this._thumbAsset);
    }
    /**
     * Discovers the sample size that a BitmapFactory.Options object should have
     * to scale the retrieved image to the given max size.
     * @param uri The URI of the image that should be scaled.
     * @param options The options that should be used to produce the correct image scale.
     */
    getSampleSize(uri, options) {
        const boundsOptions = new android.graphics.BitmapFactory.Options();
        boundsOptions.inJustDecodeBounds = true;
        android.graphics.BitmapFactory.decodeStream(this.openInputStream(uri), null, boundsOptions);
        // find the correct scale value. It should be the power of 2.
        let outWidth = boundsOptions.outWidth;
        let outHeight = boundsOptions.outHeight;
        let scale = 1;
        if (options) {
            // tODO: Refactor to accomodate different scaling options
            //       right now, it just selects the smallest of the two sizes
            //       and scales the image proportionally to that.
            const targetSize = options.maxWidth < options.maxHeight ? options.maxWidth : options.maxHeight;
            while (!(this.matchesSize(targetSize, outWidth) || this.matchesSize(targetSize, outHeight))) {
                outWidth /= 2;
                outHeight /= 2;
                scale *= 2;
            }
        }
        return scale;
    }
    matchesSize(targetSize, actualSize) {
        return targetSize && actualSize / 2 < targetSize;
    }
    /**
     * Decodes the given URI using the given options.
     * @param uri The URI that should be decoded into an ImageSource.
     * @param options The options that should be used to decode the image.
     */
    decodeUri(uri, options) {
        const downsampleOptions = new android.graphics.BitmapFactory.Options();
        downsampleOptions.inSampleSize = this.getSampleSize(uri, options);
        const bitmap = android.graphics.BitmapFactory.decodeStream(this.openInputStream(uri), null, downsampleOptions);
        const image = new ImageSource();
        image.setNativeSource(bitmap);
        return image;
    }
    /**
     * Decodes the given URI using the given options.
     * @param uri The URI that should be decoded into an ImageAsset.
     * @param options The options that should be used to decode the image.
     */
    decodeUriForImageAsset(uri, options) {
        const downsampleOptions = new android.graphics.BitmapFactory.Options();
        downsampleOptions.inSampleSize = this.getSampleSize(uri, options);
        const bitmap = android.graphics.BitmapFactory.decodeStream(this.openInputStream(uri), null, downsampleOptions);
        return new ImageAsset(bitmap);
    }
    /**
     * Retrieves the raw data of the given file and exposes it as a byte buffer.
     */
    getByteBuffer(uri) {
        let file = null;
        try {
            file = SelectedAsset.getContentResolver().openAssetFileDescriptor(uri, 'r');
            // determine how many bytes to allocate in memory based on the file length
            const length = file.getLength();
            const buffer = java.nio.ByteBuffer.allocateDirect(length);
            const bytes = buffer.array();
            const stream = file.createInputStream();
            // buffer the data in 4KiB amounts
            const reader = new java.io.BufferedInputStream(stream, 4096);
            reader.read(bytes, 0, bytes.length);
            return buffer;
        }
        finally {
            if (file) {
                file.close();
            }
        }
    }
    openInputStream(uri) {
        return SelectedAsset.getContentResolver().openInputStream(uri);
    }
    static getContentResolver() {
        return Application.android.nativeApp.getContentResolver();
    }
}
//# sourceMappingURL=selected-asset.js.map