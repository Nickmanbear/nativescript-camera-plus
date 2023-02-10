/**********************************************************************************
 * (c) 2017, nStudio, LLC & LiveShopper, LLC
 *
 * Version 1.1.0                                                    team@nStudio.io
 **********************************************************************************/
import { CameraPlusBase, ICameraOptions, ICameraPlusEvents, IChooseOptions, IVideoOptions, WhiteBalance } from './common';
export * from './common';
export { CameraVideoQuality, WhiteBalance } from './common';
import fancycamera = io.github.triniwiz.fancycamera;
export declare class CameraPlus extends CameraPlusBase {
    private _camera;
    private _cameraId;
    flashOnIcon: string;
    flashOffIcon: string;
    toggleCameraIcon: string;
    confirmPhotos: boolean;
    saveToGallery: boolean;
    takePicIcon: string;
    galleryIcon: string;
    insetButtons: boolean;
    insetButtonsPercent: number;
    enableVideo: boolean;
    isRecording: boolean;
    enableAudio: boolean;
    events: ICameraPlusEvents;
    private _nativeView;
    private _owner;
    private _mediaRecorder;
    private _textureSurface;
    private _textureView;
    private _surface;
    private _flashBtn;
    private _takePicBtn;
    private _toggleCamBtn;
    private _galleryBtn;
    private _videoOptions;
    private _videoPath;
    readonly _context: any;
    _lastCameraOptions: ICameraOptions[];
    constructor();
    private isVideoEnabled;
    private isAudioEnabled;
    get ratio(): string;
    set ratio(value: string);
    get zoom(): number;
    set zoom(value: number);
    set whiteBalance(value: WhiteBalance | string);
    get whiteBalance(): WhiteBalance | string;
    /**
     * @param ratio get the sizes for a given ratio, i.e. '16:9'.
     */
    getAvailablePictureSizes(ratio: string): string[];
    getSupportedRatios(): string[];
    set pictureSize(value: string);
    get pictureSize(): string;
    get camera(): fancycamera.FancyCamera;
    /**
     * Create the native view
     */
    createNativeView(): globalAndroid.widget.RelativeLayout;
    private _onLayoutChangeFn;
    private _onLayoutChangeListener;
    private _permissionListener;
    private _permissionListenerFn;
    initNativeView(): void;
    disposeNativeView(): void;
    get cameraId(): any;
    set cameraId(id: any);
    /**
     * Takes a picture with from the camera preview.
     */
    takePicture(options?: ICameraOptions): void;
    private releaseCamera;
    get autoFocus(): boolean;
    set autoFocus(focus: boolean);
    _togglingCamera: boolean;
    /**
     * Toggle the opened camera. Only supported on devices with multiple cameras.
     */
    toggleCamera(): void;
    record(options?: IVideoOptions): Promise<void>;
    /**
     * Stop recording video
     */
    stop(): void;
    stopRecording(): void;
    /**
     * Open the device image picker
     * @param options
     */
    chooseFromLibrary(options?: IChooseOptions): Promise<any>;
    /**
     * Collect images from intent and return a collection of Image Assets.
     *
     * @param intent
     */
    private getSelectedImages;
    /**
     * Toggles the flash mode of the camera.
     */
    toggleFlash(): void;
    /**
     * Request permission to use device camera.
     * @param explanation
     */
    requestCameraPermissions(explanation?: string): Promise<boolean>;
    /**
     * Returns true if the CAMERA permission has been granted.
     */
    hasCameraPermission(): boolean;
    /**
     * Request permission to use record audio for video.
     * @param explanation
     */
    requestAudioPermissions(explanation?: string): Promise<boolean>;
    /**
     * Returns true if the RECORD_AUDIO permission has been granted.
     */
    hasAudioPermission(): boolean;
    /**
     * Request permission to read/write to external storage.
     * @param explanation
     */
    requestStoragePermissions(explanation?: string): Promise<boolean>;
    /**
     * Returns true if the WRITE_EXTERNAL_STORAGE && READ_EXTERNAL_STORAGE permissions have been granted.
     */
    hasStoragePermissions(): boolean;
    requestVideoRecordingPermissions(explanation?: string): Promise<boolean>;
    hasVideoRecordingPermissions(): boolean;
    /**
     * Gets current camera selection
     */
    getCurrentCamera(): 'front' | 'rear';
    /**
     * Check if the device has a camera
     */
    isCameraAvailable(): boolean;
    /**
     * Returns number of cameras on device
     */
    getNumberOfCameras(): number;
    /**
     * Check if device has flash modes
     * @param camera
     */
    hasFlash(): boolean;
    /**
     * Return the current flash mode of the device. Will return null if the flash mode is not supported by device.
     */
    getFlashMode(): "on" | "off";
    /**
     * Helper method to ensure the correct icon (on/off) is shown on flash.
     * Useful when toggling cameras.
     */
    _ensureCorrectFlashIcon(): void;
    private _ensureFocusMode;
    private _initFlashButton;
    private _initGalleryButton;
    private _initToggleCameraButton;
    private _initTakePicButton;
    /**
     * Creates the default buttons depending on the options to show the various default buttons.
     */
    private _initDefaultButtons;
}
