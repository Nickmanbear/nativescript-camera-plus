import { ImageAsset } from '@nativescript/core';
/**
 * Helper method to get the drawable of an app_resource icon for the ImageButtons 'image'
 * @param iconName
 */
export declare function getImageDrawable(iconName: string): number;
/**
 * Helper method to create android ImageButton
 */
export declare function createImageButton(): android.widget.ImageButton;
/**
 * Creates a new rounded GradientDrawable with transparency and rounded corners.
 */
export declare function createTransparentCircleDrawable(): android.graphics.drawable.GradientDrawable;
/**
 * Create date time stamp similar to Java Date()
 */
export declare function createDateTimeStamp(): string;
/**
 * Creates an ImageAsset from a file path
 * @param path
 * @param width
 * @param height
 * @param keepAspectRatio
 */
export declare function assetFromPath(path: any, width: any, height: any, keepAspectRatio: any): ImageAsset;
/**
 * Helper method to get the optimal sizing for the preview from the camera.
 * Android cameras support different sizes for previewing.
 * @param sizes
 * @param width
 * @param height
 */
export declare function getOptimalPreviewSize(sizes: java.util.List<android.hardware.Camera.Size>, width: number, height: number): android.hardware.Camera.Size;
/**
 * Helper method to get the optimal sizing for the picture from the camera.
 * Android cameras support different sizes for taking picture.
 * @param sizes
 * @param width
 * @param height
 */
export declare function getOptimalPictureSize(sizes: java.util.List<android.hardware.Camera.Size>, width: number, height: number): android.hardware.Camera.Size;
export declare function calculateInSampleSize(options: android.graphics.BitmapFactory.Options, reqWidth: number, reqHeight: number): number;
export declare function getOrientationFromBytes(data: any): number;
export declare function createImageConfirmationDialog(file: any, retakeText?: string, saveText?: string): Promise<boolean>;
