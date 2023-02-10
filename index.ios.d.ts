/**********************************************************************************
 * (c) 2017, nStudio, LLC & LiveShopper, LLC
 *
 * Version 1.1.0                                                    team@nStudio.io
 **********************************************************************************/
import { CameraPlusBase, ICameraOptions, IChooseOptions, IVideoOptions } from './common';
export * from './common';
export { CameraVideoQuality, WhiteBalance } from './common';
export declare class CameraPlus extends CameraPlusBase {
    static useDeviceOrientation: boolean;
    private _swifty;
    private _isIPhoneX;
    enableVideo: boolean;
    enableAudio: boolean;
    private _galleryMax;
    private _galleryPickerWidth;
    private _galleryPickerHeight;
    private _keepAspectRatio;
    constructor();
    private isVideoEnabled;
    private isAudioEnabled;
    createNativeView(): any;
    private _cropByPreview;
    get cropByPreview(): boolean;
    set cropByPreview(value: boolean);
    _updatePhotoQuality(): void;
    getAvailablePictureSizes(ratio?: string): string[];
    private _pictureQuality;
    set pictureSize(value: string);
    get pictureSize(): string;
    private _onLayoutChangeFn;
    private _onLayoutChangeListener;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    onUnloaded(): void;
    get isIPhoneX(): boolean;
    get galleryPickerWidth(): number;
    set galleryPickerWidth(value: number);
    get galleryPickerHeight(): number;
    set galleryPickerHeight(value: number);
    get keepAspectRatio(): boolean;
    set keepAspectRatio(value: boolean);
    get galleryMax(): number;
    set galleryMax(value: number);
    /**
     * Toggle Camera front/back
     */
    toggleCamera(): void;
    /**
     * Toggle flash mode
     */
    toggleFlash(): void;
    /**
     * Return the current flash mode (either 'on' or 'off' for iOS)
     */
    getFlashMode(): 'on' | 'off';
    /**
     * Open library picker
     * @param options IChooseOptions
     */
    chooseFromLibrary(options?: IChooseOptions): Promise<any>;
    /**
     * Snap photo and display confirm save
     */
    takePicture(options?: ICameraOptions): void;
    /**
     * Record video
     */
    record(options?: IVideoOptions): Promise<void>;
    /**
     * Stop recording video
     */
    stop(): void;
    /**
     * Gets current camera selection
     */
    getCurrentCamera(): 'front' | 'rear';
    /**
     * Is camera available for use
     */
    isCameraAvailable(): any;
    private _detectDevice;
}
