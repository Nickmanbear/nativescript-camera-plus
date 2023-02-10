/**********************************************************************************
 * (c) 2017, nStudio, LLC & LiveShopper, LLC
 * Licensed under a Commercial license.
 *
 * Version 1.1.0                                       			   team@nStudio.io
 **********************************************************************************/
import { ImageAsset, ImageSource } from '@nativescript/core';
export declare class SelectedAsset extends ImageAsset {
    private _uri;
    private _thumb;
    private _thumbRequested;
    private _thumbAsset;
    private _fileUri;
    private _data;
    constructor(uri: android.net.Uri);
    data(): Promise<any>;
    getImage(options?: {
        maxWidth: number;
        maxHeight: number;
    }): Promise<ImageSource>;
    getImageData(): Promise<ArrayBuffer>;
    get thumb(): ImageSource;
    get thumbAsset(): ImageAsset;
    protected setThumbAsset(value: ImageAsset): void;
    get uri(): string;
    get fileUri(): string;
    private static _calculateFileUri;
    private static getDataColumn;
    private static isExternalStorageDocument;
    private static isDownloadsDocument;
    private static isMediaDocument;
    private decodeThumbUri;
    private decodeThumbAssetUri;
    /**
     * Discovers the sample size that a BitmapFactory.Options object should have
     * to scale the retrieved image to the given max size.
     * @param uri The URI of the image that should be scaled.
     * @param options The options that should be used to produce the correct image scale.
     */
    private getSampleSize;
    private matchesSize;
    /**
     * Decodes the given URI using the given options.
     * @param uri The URI that should be decoded into an ImageSource.
     * @param options The options that should be used to decode the image.
     */
    private decodeUri;
    /**
     * Decodes the given URI using the given options.
     * @param uri The URI that should be decoded into an ImageAsset.
     * @param options The options that should be used to decode the image.
     */
    private decodeUriForImageAsset;
    /**
     * Retrieves the raw data of the given file and exposes it as a byte buffer.
     */
    private getByteBuffer;
    private openInputStream;
    private static getContentResolver;
}
