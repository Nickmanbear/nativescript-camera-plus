import { Application, ImageAsset } from '@nativescript/core';
import { CLog } from './common';
/**
 * Helper method to get the drawable of an app_resource icon for the ImageButtons 'image'
 * @param iconName
 */
export function getImageDrawable(iconName) {
    const contentContext = Application.android.context;
    return contentContext.getResources().getIdentifier(iconName, 'drawable', Application.android.context.getPackageName());
}
/**
 * Helper method to create android ImageButton
 */
export function createImageButton() {
    const btn = new android.widget.ImageButton(Application.android.context);
    btn.setPadding(24, 24, 24, 24);
    btn.setMaxHeight(48);
    btn.setMaxWidth(48);
    return btn;
}
/**
 * Creates a new rounded GradientDrawable with transparency and rounded corners.
 */
export function createTransparentCircleDrawable() {
    const shape = new android.graphics.drawable.GradientDrawable();
    shape.setColor(0x99000000);
    shape.setCornerRadius(96);
    shape.setAlpha(160);
    return shape;
}
/**
 * Create date time stamp similar to Java Date()
 */
export function createDateTimeStamp() {
    let result = '';
    const date = new Date();
    result = date.getFullYear().toString() + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) + (date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()) + '_' + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
    return result;
}
/**
 * Creates an ImageAsset from a file path
 * @param path
 * @param width
 * @param height
 * @param keepAspectRatio
 */
export function assetFromPath(path, width, height, keepAspectRatio) {
    const asset = new ImageAsset(path);
    asset.options = {
        width,
        height,
        keepAspectRatio,
    };
    return asset;
}
/**
 * Helper method to get the optimal sizing for the preview from the camera.
 * Android cameras support different sizes for previewing.
 * @param sizes
 * @param width
 * @param height
 */
export function getOptimalPreviewSize(sizes, width, height) {
    const targetRatio = height / width;
    CLog(`targetRatio = ${targetRatio}`);
    if (sizes === null)
        return null;
    let optimalSize = null;
    const targetHeight = height;
    CLog(`targetHeight = ${targetHeight}`);
    for (let i = 0; i < sizes.size(); i++) {
        const element = sizes.get(i);
        CLog(`size.width = ${element.width}, size.height = ${element.height}`);
        if (element.width <= width && element.height <= height) {
            if (optimalSize == null) {
                optimalSize = element;
            }
            else {
                const resultArea = optimalSize.width * optimalSize.height;
                const newArea = element.width * element.height;
                if (newArea > resultArea) {
                    optimalSize = element;
                }
            }
        }
    }
    CLog(`optimalSize = ${optimalSize}, optimalSize.width = ${optimalSize.width}, optimalSize.height = ${optimalSize.height}`);
    return optimalSize;
}
/**
 * Helper method to get the optimal sizing for the picture from the camera.
 * Android cameras support different sizes for taking picture.
 * @param sizes
 * @param width
 * @param height
 */
export function getOptimalPictureSize(sizes, width, height) {
    let sizeSet = false;
    if (sizes === null)
        return null;
    let optimalSize = null;
    let minDiff = Number.MAX_SAFE_INTEGER;
    const targetHeight = height;
    CLog(`targetHeight = ${targetHeight}`);
    const targetWidth = height;
    CLog(`targetWidth = ${targetWidth}`);
    for (let i = 0; i < sizes.size(); i++) {
        const size = sizes.get(i);
        let desiredMinimumWidth;
        let desiredMaximumWidth;
        if (width > 1000) {
            desiredMinimumWidth = width - 200;
            desiredMaximumWidth = width + 200;
        }
        else {
            desiredMinimumWidth = 800;
            desiredMaximumWidth = 1200;
        }
        if (size.width > desiredMinimumWidth && size.width < desiredMaximumWidth && size.height < size.width) {
            optimalSize = size;
            CLog('setting size width', size.width + '');
            CLog('setting size height', size.height + '');
            sizeSet = true;
            break;
        }
    }
    if (!sizeSet) {
        // minDiff = Double.MAX_VALUE;
        minDiff = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < sizes.size(); i++) {
            const element = sizes.get(i);
            CLog(`size.width = ${element.width}, size.height = ${element.height}`);
            if (Math.abs(element.height - targetHeight) < minDiff) {
                optimalSize = element;
                minDiff = Math.abs(element.height - targetHeight);
            }
        }
        sizeSet = true;
    }
    CLog(`optimalPictureSize = ${optimalSize}, optimalPictureSize.width = ${optimalSize.width}, optimalPictureSize.height = ${optimalSize.height}`);
    return optimalSize;
}
export function calculateInSampleSize(options, reqWidth, reqHeight) {
    // Raw height and width of image
    const height = options.outHeight;
    const width = options.outWidth;
    let inSampleSize = 1;
    if (height > reqHeight || width > reqWidth) {
        const halfHeight = height / 2;
        const halfWidth = width / 2;
        // Calculate the largest inSampleSize value that is a power of 2 and keeps both
        // height and width larger than the requested height and width.
        while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
            inSampleSize *= 2;
        }
    }
    return inSampleSize;
}
/* Returns the exif data from the camera byte array */
export function getOrientationFromBytes(data) {
    // We won't auto-rotate the front Camera image
    const inputStream = new java.io.ByteArrayInputStream(data);
    let exif;
    if (android.os.Build.VERSION.SDK_INT >= 24) {
        exif = new android.media.ExifInterface(inputStream);
    }
    else {
        exif = new android.support.media.ExifInterface(inputStream);
    }
    let orientation = exif.getAttributeInt(android.media.ExifInterface.TAG_ORIENTATION, android.media.ExifInterface.ORIENTATION_UNDEFINED);
    try {
        inputStream.close();
    }
    catch (ex) {
        CLog('byteArrayInputStream.close error', ex);
    }
    if (this.cameraId === 1) {
        if (orientation === 1) {
            orientation = 2;
        }
        else if (orientation === 3) {
            orientation = 4;
        }
        else if (orientation === 6) {
            orientation = 7;
        }
    }
    CLog('Orientation: ', orientation);
    return orientation;
}
export function createImageConfirmationDialog(file, retakeText = 'Retake', saveText = 'Save') {
    return new Promise((resolve, reject) => {
        try {
            const alert = new android.app.AlertDialog.Builder(Application.android.foregroundActivity);
            alert.setOnDismissListener(new android.content.DialogInterface.OnDismissListener({
                onDismiss: (dialog) => {
                    resolve(false);
                },
            }));
            const layout = new android.widget.LinearLayout(Application.android.context);
            layout.setOrientation(1);
            // - Brad - working on OOM issue - use better Bitmap creation
            // https://developer.android.com/topic/performance/graphics/load-bitmap.html
            const bitmapFactoryOpts = new android.graphics.BitmapFactory.Options();
            bitmapFactoryOpts.inJustDecodeBounds = true;
            let picture = android.graphics.BitmapFactory.decodeFile(file, bitmapFactoryOpts);
            bitmapFactoryOpts.inSampleSize = calculateInSampleSize(bitmapFactoryOpts, 300, 300);
            // decode with inSampleSize set now
            bitmapFactoryOpts.inJustDecodeBounds = false;
            picture = android.graphics.BitmapFactory.decodeFile(file, bitmapFactoryOpts);
            const img = new android.widget.ImageView(Application.android.context);
            const scale = Application.android.context.getResources().getDisplayMetrics().density;
            img.setPadding(0, 10 * scale, 0, 0);
            img.setImageBitmap(picture);
            layout.addView(img);
            alert.setView(layout);
            alert.setNegativeButton(retakeText, new android.content.DialogInterface.OnClickListener({
                onClick: (dialog, which) => {
                    resolve(false);
                },
            }));
            alert.setPositiveButton(saveText, new android.content.DialogInterface.OnClickListener({
                onClick: (dialog, which) => {
                    resolve(true);
                },
            }));
            alert.show();
        }
        catch (err) {
            reject(err);
        }
    });
}
//# sourceMappingURL=helpers.js.map