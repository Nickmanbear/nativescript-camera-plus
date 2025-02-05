import { EventData, ImageAsset } from '@nativescript/core';
import { CameraPlus } from '.';
export declare enum CameraPlusEvents {
    ErrorEvent = "errorEvent",
    PhotoCapturedEvent = "photoCapturedEvent",
    ToggleCameraEvent = "toggleCameraEvent",
    ImagesSelectedEvent = "imagesSelectedEvent",
    VideoRecordingStartedEvent = "videoRecordingStartedEvent",
    VideoRecordingFinishedEvent = "videoRecordingFinishedEvent",
    VideoRecordingReadyEvent = "videoRecordingReadyEvent",
    ConfirmScreenShownEvent = "confirmScreenShownEvent",
    ConfirmScreenDismissedEvent = "confirmScreenDismissedEvent"
}
/**
 * Collection of interfaces representing the types
 * emitted by each event.
 */
export interface ErrorEvent extends EventData {
    eventName: CameraPlusEvents.ErrorEvent;
    data?: Error;
    message?: string;
}
export interface PhotoCapturedEvent extends EventData {
    eventName: CameraPlusEvents.PhotoCapturedEvent;
    data: ImageAsset;
}
export interface ToggleCameraEvent extends EventData {
    eventName: CameraPlusEvents.ToggleCameraEvent;
    /**
     * Which camera has been selected (front, rear).
     */
    data?: any;
}
export interface ImagesSelectedEvent extends EventData {
    eventName: CameraPlusEvents.ImagesSelectedEvent;
    /**
     * Collection of Images.
     */
    data: ImageAsset[];
}
export interface VideoRecordingStartedEvent extends EventData {
    eventName: CameraPlusEvents.VideoRecordingStartedEvent;
    /**
     * Which camera is now recording.
     */
    data?: any;
}
export interface VideoRecordingFinishedEvent extends EventData {
    eventName: CameraPlusEvents.VideoRecordingFinishedEvent;
    /**
     * Which camera is now recording.
     */
    data?: any;
}
export interface VideoRecordingReadyEvent extends EventData {
    eventName: CameraPlusEvents.VideoRecordingReadyEvent;
    /**
     * Path to file.
     */
    data: string;
}
export interface ConfirmScreenShownEvent extends EventData {
    eventName: CameraPlusEvents.ConfirmScreenShownEvent;
}
export interface ConfirmScreenDismissedEvent extends EventData {
    eventName: CameraPlusEvents.ConfirmScreenDismissedEvent;
}
/**
 * Angular Only.
 *
 * This can be used when binding a function to the loaded event with ng.
 */
export interface CameraLoadedEvent extends EventData {
    eventName: 'loaded';
    /**
     * This typing is unavailable on the opposite platform.
     * For example, on Android you will get an error for MySwifty.
     *
     * This occurs when using a type of `a | b`, instead use these for now:
     * Android: co.fitcom.fancycamera.FancyCamera
     * iOS: MySwifty
     */
    data: any;
    object: CameraPlus;
}
