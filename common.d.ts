/**********************************************************************************
 * (c) 2017, nStudio, LLC & LiveShopper, LLC
 *
 * Version 1.1.0                                                   team@nStudio.io
 **********************************************************************************/
import { ContentView } from '@nativescript/core';
import { CameraPlus as CameraPlusDefinition } from '.';
import { CameraPlusEvents } from './events';
export declare class CameraUtil {
    static debug: boolean;
}
export declare const CLog: (...args: any[]) => void;
export declare type CameraTypes = 'front' | 'rear';
export declare abstract class CameraPlusBase extends ContentView implements CameraPlusDefinition {
    set debug(value: boolean);
    events: any;
    /**
     * Video Support (off by default)
     * defined statically due to necessity to set this very early before constructor
     * users should set this in a component constructor before their view creates the component
     * and can reset it before different using in different views if they want to go back/forth
     * between photo/camera and video/camera
     */
    static enableVideo: boolean;
    static enableAudio: boolean;
    /**
     * Default camera: must be set early before constructor to default the camera correctly on launch (default to rear)
     */
    static defaultCamera: CameraTypes;
    static errorEvent: CameraPlusEvents;
    /**
     * String value for hooking into the photoCapturedEvent. This event fires when a photo is taken.
     */
    static photoCapturedEvent: CameraPlusEvents;
    /**
     * String value for hooking into the toggleCameraEvent. This event fires when the device camera is toggled.
     */
    static toggleCameraEvent: CameraPlusEvents;
    /**
     * String value when hooking into the imagesSelectedEvent. This event fires when images are selected from the device library/gallery.
     */
    static imagesSelectedEvent: CameraPlusEvents;
    /**
     * String value when hooking into the videoRecordingStartedEvent. This event fires when video starts recording.
     */
    static videoRecordingStartedEvent: CameraPlusEvents;
    /**
     * String value when hooking into the videoRecordingFinishedEvent. This event fires when video stops recording but has not processed yet.
     */
    static videoRecordingFinishedEvent: CameraPlusEvents;
    /**
     * String value when hooking into the videoRecordingReadyEvent. This event fires when video has completed processing and is ready to be used.
     */
    static videoRecordingReadyEvent: CameraPlusEvents;
    /**
     * String value when hooking into the confirmScreenShownEvent. This event fires when the picture confirm dialog is shown.
     */
    static confirmScreenShownEvent: CameraPlusEvents;
    /**
     * String value when hooking into the confirmScreenDismissedEvent. This event fires when the picture confirm dialog is dismissed either by Retake or Save button.
     */
    static confirmScreenDismissedEvent: CameraPlusEvents;
    /**
     * @default 4:3
     * *ANDROID ONLY*  A string to represent the camera preview aspect ratio e.g 4:3, 1:1 ,16:9 to check if the device supports the ratio use {@link getGetSupportedRatios}
     */
    ratio: string;
    /**
     *  *ANDROID ONLY*  Camera zoom uses a float 0 - 1.
     *  0 being no zoom
     *  1 being max zoom
     */
    zoom: number;
    /**
     *  *ANDROID ONLY* Camera white balance
     */
    whiteBalance: WhiteBalance | string;
    /**
     *  *ANDROID ONLY* A string representing the size of picture {@link takePicture} will output. Available sizes can be fetched using {@link getAvailablePictureSizes}
     */
    pictureSize: string;
    /**
     * @param ratio string
     * @returns returns an array of supported picture sizes supported by the current camera
     */
    getAvailablePictureSizes(ratio: string): string[];
    /**
     * @returns retuns an array of strings representing the preview sizes supported by the current device.
     */
    getSupportedRatios(): string[];
    /**
     * If true the default take picture event will present a confirmation dialog. Default is true.
     */
    confirmPhotos: boolean;
    /**
     * When confirming capture this text will be presented to the user to retake the photo. Default is 'Retake'
     */
    confirmRetakeText?: string;
    /**
     * When confirming capture this text will be presented to the user to save the photo. Default is 'Save'
     */
    confirmSaveText?: string;
    /**
     * If true the default videorecordingready event will present a confirmation dialog. Default is false.
     */
    confirmVideo: boolean;
    /**
     * If true the default take picture event will save to device gallery. Default is true.
     */
    saveToGallery: boolean;
    /**
     * The gallery/library selection mode. 'single' allows one image to be selected. 'multiple' allows multiple images. Default is 'multiple'
     */
    galleryPickerMode: 'single' | 'multiple';
    /**
     * If true the default flash toggle icon/button will show on the Camera Plus layout. Default is true.
     */
    showFlashIcon: boolean;
    /**
     * If true the default camera toggle (front/back) icon/button will show on the Camera Plus layout. Default is true.
     */
    showToggleIcon: boolean;
    /**
     * If true the default capture (take picture) icon/button will show on the Camera Plus layout. Default is true.
     */
    showCaptureIcon: boolean;
    /**
     * If true the choose from gallery/library icon/button will show on the Camera Plus layout. Default is true.
     */
    showGalleryIcon: boolean;
    /**
     * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Toggle Flash button icon when flash is on (enabled).
     */
    flashOnIcon: string;
    /**
     * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Toggle Flash button icon when flash is off (disabled).
     */
    flashOffIcon: string;
    /**
     * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Toggle Flash button icon when flash is off (disabled).
     */
    toggleCameraIcon: string;
    /**
     * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Capture button icon.
     */
    takePicIcon: string;
    /**
     * *ANDROID ONLY* - allows setting a custom app_resource drawable icon for the Open Gallery button icon.
     */
    galleryIcon: string;
    /**
     * *ANDROID ONLY* - If true the camera will auto focus to capture the image. Default is true.
     */
    autoFocus: boolean;
    /**
     * *iOS ONLY* - Enable/disable double tap gesture to switch camera. (enabled)
     */
    doubleTapCameraSwitch: boolean;
    /** If true it will crop the picture to the center square **/
    autoSquareCrop: boolean;
    /**
     * Toggles the device camera (front/back).
     */
    toggleCamera(): void;
    /**
     * Toggles the active camera flash mode.
     */
    toggleFlash(): void;
    /**
     * Gets the flash mode
     * Android: various strings possible
     * iOS: only 'on' or 'off'
     */
    getFlashMode(): string;
    /**
     * Opens the device Library (image gallery) to select images.
     */
    abstract chooseFromLibrary(options?: IChooseOptions): Promise<any>;
    /**
     * Takes a picture of the current preview of the CameraPlus.
     */
    abstract takePicture(options?: ICameraOptions): void;
    /**
     * Start recording video
     * @param options IVideoOptions
     */
    abstract record(options?: IVideoOptions): Promise<void>;
    /**
     * Stop recording video
     */
    abstract stop(): void;
    /**
     * Returns true if the device has at least one camera.
     */
    isCameraAvailable(): boolean;
    /**
     * Returns current camera <front | rear>
     */
    getCurrentCamera(): 'rear' | 'front';
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to use the device Camera.
     */
    requestCameraPermissions(explanationText?: string): Promise<boolean>;
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to use the device camera.
     */
    hasCameraPermission(): boolean;
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to read and write to storage.
     */
    requestStoragePermissions(explanationText?: string): Promise<boolean>;
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to READ/WRITE STORAGE.
     */
    hasStoragePermissions(): boolean;
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to record audio for video recording.
     */
    requestAudioPermissions(explanationText?: string): Promise<boolean>;
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to record audio, which is necessary for video recording.
     */
    hasAudioPermission(): boolean;
    /**
     * * ANDROID ONLY * - will prompt the user for runtime permission to record audio and write storage to save video recordings.
     */
    requestVideoRecordingPermissions(explanationText?: string): Promise<boolean>;
    /**
     * * ANDROID ONLY * - Returns true if the application has permission to record audio and write storage for saving videos.
     */
    hasVideoRecordingPermissions(): boolean;
    /**
     * * ANDROID ONLY * - Gets the number of cameras on a device.
     */
    getNumberOfCameras(): number;
    /**
     * * ANDROID ONLY * - Returns true if the current camera has a flash mode.
     */
    hasFlash(): boolean;
    /**
     * Notify events by name and optionally pass data
     */
    sendEvent(eventName: string, data?: any, msg?: string): void;
}
export interface ICameraOptions {
    confirm?: boolean;
    saveToGallery?: boolean;
    keepAspectRatio?: boolean;
    height?: number;
    width?: number;
    autoSquareCrop?: boolean;
    confirmRetakeText?: string;
    confirmSaveText?: string;
    useCameraOptions?: boolean;
}
export interface IChooseOptions {
    width?: number;
    height?: number;
    keepAspectRatio?: boolean;
    showImages?: boolean;
    showVideos?: boolean;
}
export interface ICameraPlusEvents {
    photoCapturedEvent: any;
    toggleCameraEvent: any;
    imagesSelectedEvent: any;
    videoRecordingStartedEvent: any;
    videoRecordingFinishedEvent: any;
    videoRecordingReadyEvent: any;
    confirmScreenShownEvent: any;
    confirmScreenDismissedEvent: any;
}
export declare enum CameraVideoQuality {
    MAX_480P = "480p",
    MAX_720P = "720p",
    MAX_1080P = "1080p",
    MAX_2160P = "2160p",
    HIGHEST = "highest",
    LOWEST = "lowest",
    QVGA = "qvga"
}
export interface IVideoOptions {
    quality?: CameraVideoQuality;
    confirm?: boolean;
    saveToGallery?: boolean;
    height?: number;
    width?: number;
    disableHEVC?: boolean;
    androidMaxVideoBitRate?: number;
    androidMaxFrameRate?: number;
    androidMaxAudioBitRate?: number;
}
export declare enum WhiteBalance {
    Auto = "auto",
    Sunny = "sunny",
    Cloudy = "cloudy",
    Shadow = "shadow",
    Twilight = "twilight",
    Fluorescent = "fluorescent",
    Incandescent = "incandescent",
    WarmFluorescent = "warm-fluorescent"
}
export declare function GetSetProperty(): (target: any, propertyKey: string) => void;
