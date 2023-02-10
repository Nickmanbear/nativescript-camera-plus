/**********************************************************************************
 * (c) 2017, nStudio, LLC & LiveShopper, LLC
 *
 * Version 1.1.0                                                   team@nStudio.io
 **********************************************************************************/
import { ContentView } from '@nativescript/core';
import { CameraPlusEvents } from './events';
export class CameraUtil {
}
CameraUtil.debug = false;
export const CLog = (...args) => {
    if (CameraUtil.debug) {
        console.log('NativeScript-CameraPlus ---', args);
    }
};
export class CameraPlusBase extends ContentView {
    constructor() {
        super(...arguments);
        /**
         *  *ANDROID ONLY*  Camera zoom uses a float 0 - 1.
         *  0 being no zoom
         *  1 being max zoom
         */
        this.zoom = 0;
        /**
         *  *ANDROID ONLY* Camera white balance
         */
        this.whiteBalance = WhiteBalance.Auto;
        /**
         *  *ANDROID ONLY* A string representing the size of picture {@link takePicture} will output. Available sizes can be fetched using {@link getAvailablePictureSizes}
         */
        this.pictureSize = '0x0';
        /**
         * If true the default take picture event will present a confirmation dialog. Default is true.
         */
        this.confirmPhotos = true;
        /**
         * If true the default videorecordingready event will present a confirmation dialog. Default is false.
         */
        this.confirmVideo = false;
        /**
         * If true the default take picture event will save to device gallery. Default is true.
         */
        this.saveToGallery = true;
        /**
         * The gallery/library selection mode. 'single' allows one image to be selected. 'multiple' allows multiple images. Default is 'multiple'
         */
        this.galleryPickerMode = 'multiple';
        /**
         * If true the default flash toggle icon/button will show on the Camera Plus layout. Default is true.
         */
        this.showFlashIcon = true;
        /**
         * If true the default camera toggle (front/back) icon/button will show on the Camera Plus layout. Default is true.
         */
        this.showToggleIcon = true;
        /**
         * If true the default capture (take picture) icon/button will show on the Camera Plus layout. Default is true.
         */
        this.showCaptureIcon = true;
        /**
         * If true the choose from gallery/library icon/button will show on the Camera Plus layout. Default is true.
         */
        this.showGalleryIcon = true;
        /**
         * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Toggle Flash button icon when flash is on (enabled).
         */
        this.flashOnIcon = '';
        /**
         * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Toggle Flash button icon when flash is off (disabled).
         */
        this.flashOffIcon = '';
        /**
         * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Toggle Flash button icon when flash is off (disabled).
         */
        this.toggleCameraIcon = '';
        /**
         * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Capture button icon.
         */
        this.takePicIcon = '';
        /**
         * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Open Gallery button icon.
         */
        this.galleryIcon = '';
        /**
         * *ANDROID ONLY* - If true the camera will auto focus to capture the image. Default is true.
         */
        this.autoFocus = true;
        /**
         * *iOS ONLY* - Enable/disable double tap gesture to switch camera. (enabled)
         */
        this.doubleTapCameraSwitch = true;
        /** If true it will crop the picture to the center square **/
        this.autoSquareCrop = false;
    }
    set debug(value) {
        CameraUtil.debug = value;
    }
    /**
     * @param ratio string
     * @returns returns an array of supported picture sizes supported by the current camera
     */
    getAvailablePictureSizes(ratio) {
        return [];
    }
    /**
     * @returns retuns an array of strings representing the preview sizes supported by the current device.
     */
    getSupportedRatios() {
        return [];
    }
    /**
     * Toggles the device camera (front/back).
     */
    toggleCamera() { }
    /**
     * Toggles the active camera flash mode.
     */
    toggleFlash() { }
    /**
     * Gets the flash mode
     * Android: various strings possible
     * iOS: only 'on' or 'off'
     */
    getFlashMode() {
        return null;
    }
    /**
     * Returns true if the device has at least one camera.
     */
    isCameraAvailable() {
        return false;
    }
    /**
     * Returns current camera <front | rear>
     */
    getCurrentCamera() {
        return 'rear';
    }
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to use the device Camera.
     */
    requestCameraPermissions(explanationText) {
        return new Promise((resolve, reject) => resolve(false));
    }
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to use the device camera.
     */
    hasCameraPermission() {
        return false;
    }
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to read and write to storage.
     */
    requestStoragePermissions(explanationText) {
        return new Promise((resolve, reject) => resolve(false));
    }
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to READ/WRITE STORAGE.
     */
    hasStoragePermissions() {
        return false;
    }
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to record audio for video recording.
     */
    requestAudioPermissions(explanationText) {
        return new Promise((resolve, reject) => resolve(false));
    }
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to record audio, which is necessary for video recording.
     */
    hasAudioPermission() {
        return false;
    }
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to record audio and write storage to save video recordings.
     */
    requestVideoRecordingPermissions(explanationText) {
        return new Promise((resolve, reject) => resolve(true));
    }
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to record audio and write storage for saving videos.
     */
    hasVideoRecordingPermissions() {
        return false;
    }
    /**
     * * ANDROID ONLY * - Gets the number of cameras on a device.
     */
    getNumberOfCameras() {
        return 0;
    }
    /**
     * * ANDROID ONLY * - Returns true if the current camera has a flash mode.
     */
    hasFlash() {
        return false;
    }
    /**
     * Notify events by name and optionally pass data
     */
    sendEvent(eventName, data, msg) {
        this.notify({
            eventName,
            object: this,
            data,
            message: msg,
        });
    }
}
/**
 * Video Support (off by default)
 * defined statically due to necessity to set this very early before constructor
 * users should set this in a component constructor before their view creates the component
 * and can reset it before different using in different views if they want to go back/forth
 * between photo/camera and video/camera
 */
CameraPlusBase.enableVideo = false;
CameraPlusBase.enableAudio = true;
/**
 * Default camera: must be set early before constructor to default the camera correctly on launch (default to rear)
 */
CameraPlusBase.defaultCamera = 'rear';
/*
 * String value for hooking into the errorEvent. This event fires when an error is emitted from CameraPlus.
 */
CameraPlusBase.errorEvent = CameraPlusEvents.ErrorEvent;
/**
 * String value for hooking into the photoCapturedEvent. This event fires when a photo is taken.
 */
CameraPlusBase.photoCapturedEvent = CameraPlusEvents.PhotoCapturedEvent;
/**
 * String value for hooking into the toggleCameraEvent. This event fires when the device camera is toggled.
 */
CameraPlusBase.toggleCameraEvent = CameraPlusEvents.ToggleCameraEvent;
/**
 * String value when hooking into the imagesSelectedEvent. This event fires when images are selected from the device library/gallery.
 */
CameraPlusBase.imagesSelectedEvent = CameraPlusEvents.ImagesSelectedEvent;
/**
 * String value when hooking into the videoRecordingStartedEvent. This event fires when video starts recording.
 */
CameraPlusBase.videoRecordingStartedEvent = CameraPlusEvents.VideoRecordingStartedEvent;
/**
 * String value when hooking into the videoRecordingFinishedEvent. This event fires when video stops recording but has not processed yet.
 */
CameraPlusBase.videoRecordingFinishedEvent = CameraPlusEvents.VideoRecordingFinishedEvent;
/**
 * String value when hooking into the videoRecordingReadyEvent. This event fires when video has completed processing and is ready to be used.
 */
CameraPlusBase.videoRecordingReadyEvent = CameraPlusEvents.VideoRecordingReadyEvent;
/**
 * String value when hooking into the confirmScreenShownEvent. This event fires when the picture confirm dialog is shown.
 */
CameraPlusBase.confirmScreenShownEvent = CameraPlusEvents.ConfirmScreenShownEvent;
/**
 * String value when hooking into the confirmScreenDismissedEvent. This event fires when the picture confirm dialog is dismissed either by Retake or Save button.
 */
CameraPlusBase.confirmScreenDismissedEvent = CameraPlusEvents.ConfirmScreenDismissedEvent;
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "ratio", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Number)
], CameraPlusBase.prototype, "zoom", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "whiteBalance", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "pictureSize", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "confirmPhotos", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "confirmRetakeText", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "confirmSaveText", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "confirmVideo", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "saveToGallery", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "galleryPickerMode", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "showFlashIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "showToggleIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "showCaptureIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "showGalleryIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "flashOnIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "flashOffIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "toggleCameraIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "takePicIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlusBase.prototype, "galleryIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "autoFocus", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "doubleTapCameraSwitch", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlusBase.prototype, "autoSquareCrop", void 0);
export var CameraVideoQuality;
(function (CameraVideoQuality) {
    CameraVideoQuality["MAX_480P"] = "480p";
    CameraVideoQuality["MAX_720P"] = "720p";
    CameraVideoQuality["MAX_1080P"] = "1080p";
    CameraVideoQuality["MAX_2160P"] = "2160p";
    CameraVideoQuality["HIGHEST"] = "highest";
    CameraVideoQuality["LOWEST"] = "lowest";
    CameraVideoQuality["QVGA"] = "qvga";
})(CameraVideoQuality || (CameraVideoQuality = {}));
export var WhiteBalance;
(function (WhiteBalance) {
    WhiteBalance["Auto"] = "auto";
    WhiteBalance["Sunny"] = "sunny";
    WhiteBalance["Cloudy"] = "cloudy";
    WhiteBalance["Shadow"] = "shadow";
    WhiteBalance["Twilight"] = "twilight";
    WhiteBalance["Fluorescent"] = "fluorescent";
    WhiteBalance["Incandescent"] = "incandescent";
    WhiteBalance["WarmFluorescent"] = "warm-fluorescent";
})(WhiteBalance || (WhiteBalance = {}));
export function GetSetProperty() {
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this['_' + propertyKey];
            },
            set: function (value) {
                if (this['_' + propertyKey] === value) {
                    return;
                }
                if (value === 'true') {
                    value = true;
                }
                else if (value === 'false') {
                    value = false;
                }
                this['_' + propertyKey] = value;
            },
            enumerable: true,
            configurable: true,
        });
    };
}
//# sourceMappingURL=common.js.map