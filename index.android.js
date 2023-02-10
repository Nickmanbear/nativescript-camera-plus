/**********************************************************************************
 * (c) 2017, nStudio, LLC & LiveShopper, LLC
 *
 * Version 1.1.0                                                    team@nStudio.io
 **********************************************************************************/
import * as permissions from 'nativescript-permissions';
import { AndroidApplication, Application, Device, ImageAsset, Utils, View } from '@nativescript/core';
import { CameraPlusBase, CameraVideoQuality, CLog, GetSetProperty, WhiteBalance } from './common';
import * as CamHelpers from './helpers';
import { SelectedAsset } from './selected-asset';
export * from './common';
export { CameraVideoQuality, WhiteBalance } from './common';
var fancycamera = io.github.triniwiz.fancycamera;
const REQUEST_VIDEO_CAPTURE = 999;
const WRAP_CONTENT = -2;
const ALIGN_PARENT_TOP = 10;
const ALIGN_PARENT_BOTTOM = 12;
const ALIGN_PARENT_LEFT = 9;
const ALIGN_PARENT_RIGHT = 11;
const CENTER_HORIZONTAL = 14;
const DIRECTORY_PICTURES = 'DIRECTORY_PICTURES';
const DIRECTORY_MOVIES = 'DIRECTORY_MOVIES';
const FOCUS_MODE_AUTO = 'auto';
const FOCUS_MODE_EDOF = 'edof';
const FOCUS_MODE_CONTINUOUS_PICTURE = 'continuous-picture';
const FOCUS_MODE_CONTINUOUS_VIDEO = 'continuous-video';
const FLASH_MODE_ON = 'on';
const FLASH_MODE_OFF = 'off';
const CAMERA_FACING_FRONT = 1; // front camera
const CAMERA_FACING_BACK = 0; // rear camera
const RESULT_CODE_PICKER_IMAGES = 941;
const RESULT_OK = -1;
// AndroidX support
// Snapshot-friendly functions
const CAMERA = () => android.Manifest.permission.CAMERA;
const RECORD_AUDIO = () => android.Manifest.permission.RECORD_AUDIO;
const READ_EXTERNAL_STORAGE = () => android.Manifest.permission.READ_EXTERNAL_STORAGE;
const WRITE_EXTERNAL_STORAGE = () => android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
// Since these device.* properties resolve directly to the android.* namespace,
// the snapshot will fail if they resolve during import, so must be done via a function
const DEVICE_INFO_STRING = () => `Device: ${Device.manufacturer} ${Device.model} on SDK: ${Device.sdkVersion}`;
export class CameraPlus extends CameraPlusBase {
    constructor() {
        super();
        this.flashOnIcon = 'ic_flash_on_white';
        this.flashOffIcon = 'ic_flash_off_white';
        this.toggleCameraIcon = 'ic_switch_camera_white';
        this.confirmPhotos = true;
        this.saveToGallery = false;
        this.takePicIcon = 'ic_camera_white';
        this.galleryIcon = 'ic_photo_library_white';
        this.insetButtons = false;
        this.insetButtonsPercent = 0.1;
        this.enableAudio = true;
        this._flashBtn = null; // reference to native flash button
        this._takePicBtn = null; // reference to native take picture button
        this._toggleCamBtn = null; // reference to native toggle camera button
        this._galleryBtn = null; // reference to native open gallery button
        this._togglingCamera = false;
        this._camera = null;
        this._textureSurface = null;
        this.flashOnIcon = this.flashOnIcon ? this.flashOnIcon : 'ic_flash_on_white';
        this.flashOffIcon = this.flashOffIcon ? this.flashOffIcon : 'ic_flash_off_white';
        this.toggleCameraIcon = this.toggleCameraIcon ? this.toggleCameraIcon : 'ic_switch_camera_white';
        this.takePicIcon = this.takePicIcon ? this.takePicIcon : 'ic_camera_alt_white';
        this.galleryIcon = this.galleryIcon ? this.galleryIcon : 'ic_photo_library_white';
        this.cameraId = CameraPlus.defaultCamera === 'front' ? CAMERA_FACING_FRONT : CAMERA_FACING_BACK;
        this._onLayoutChangeListener = this._onLayoutChangeFn.bind(this);
        this._permissionListener = this._permissionListenerFn.bind(this);
        this._lastCameraOptions = [];
    }
    isVideoEnabled() {
        return this.enableVideo === true || CameraPlus.enableVideo;
    }
    isAudioEnabled() {
        return this.enableAudio === true || CameraPlus.enableAudio;
    }
    // @ts-ignore
    get ratio() {
        return this._camera ? this._camera.getRatio() : '4:3';
    }
    set ratio(value) {
        if (this._camera) {
            this._camera.setRatio(value);
        }
    }
    // @ts-ignore
    get zoom() {
        return this._camera ? this._camera.getZoom() : 0;
    }
    set zoom(value) {
        if (this._camera) {
            this._camera.setZoom(value);
        }
    }
    // @ts-ignore
    set whiteBalance(value) {
        if (this._camera) {
            switch (value) {
                case WhiteBalance.Cloudy:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.Cloudy);
                    break;
                case WhiteBalance.Fluorescent:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.Fluorescent);
                    break;
                case WhiteBalance.Incandescent:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.Incandescent);
                    break;
                case WhiteBalance.Shadow:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.Shadow);
                    break;
                case WhiteBalance.Sunny:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.Sunny);
                    break;
                case WhiteBalance.Twilight:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.Twilight);
                    break;
                case WhiteBalance.WarmFluorescent:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.WarmFluorescent);
                    break;
                default:
                    this._camera.setWhiteBalance(fancycamera.WhiteBalance.Auto);
                    break;
            }
        }
    }
    get whiteBalance() {
        if (this._camera) {
            switch (this._camera.getWhiteBalance()) {
                case fancycamera.WhiteBalance.Cloudy:
                    return WhiteBalance.Cloudy;
                case fancycamera.WhiteBalance.Fluorescent:
                    return WhiteBalance.Fluorescent;
                case fancycamera.WhiteBalance.Incandescent:
                    return WhiteBalance.Incandescent;
                case fancycamera.WhiteBalance.Shadow:
                    return WhiteBalance.Shadow;
                case fancycamera.WhiteBalance.Sunny:
                    return WhiteBalance.Sunny;
                case fancycamera.WhiteBalance.Twilight:
                    return WhiteBalance.Twilight;
                case fancycamera.WhiteBalance.WarmFluorescent:
                    return WhiteBalance.WarmFluorescent;
                default:
                    return WhiteBalance.Auto;
            }
        }
        return WhiteBalance.Auto;
    }
    /**
     * @param ratio get the sizes for a given ratio, i.e. '16:9'.
     */
    getAvailablePictureSizes(ratio) {
        const sizes = [];
        if (this._camera && typeof ratio === 'string') {
            const nativeSizes = this._camera.getAvailablePictureSizes(ratio);
            for (const size of nativeSizes) {
                sizes.push(`${size.getWidth()}x${size.getHeight()}`);
            }
        }
        return sizes;
    }
    getSupportedRatios() {
        const ratios = [];
        if (this._camera) {
            const nativeRatios = this._camera.getGetSupportedRatios();
            for (let i = 0; i < nativeRatios.length; i++) {
                const ratio = nativeRatios[i];
                ratios.push(ratio);
            }
        }
        return ratios;
    }
    // @ts-ignore
    set pictureSize(value) {
        if (this._camera) {
            this._camera.setPictureSize(value);
        }
    }
    get pictureSize() {
        return this._camera ? this._camera.getPictureSize() : '0x0';
    }
    get camera() {
        return this._camera;
    }
    /**
     * Create the native view
     */
    createNativeView() {
        // create the Android RelativeLayout
        Application.android.on('activityRequestPermissions', this._permissionListener);
        this._nativeView = new android.widget.RelativeLayout(this._context);
        this._camera = new fancycamera.FancyCamera(this._context);
        this._camera.setLayoutParams(new android.view.ViewGroup.LayoutParams(android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.MATCH_PARENT));
        this._camera.setEnableAudio(CameraPlus.enableAudio);
        this._nativeView.addView(this._camera);
        return this._nativeView;
    }
    _onLayoutChangeFn(args) {
        const size = this.getActualSize();
        CLog('xml width/height:', size.width + 'x' + size.height);
        this._initDefaultButtons();
    }
    _permissionListenerFn(args) {
        if (this._camera) {
            CLog('', this._camera.hasCameraPermission() || this._camera.hasPermission());
            if (this._camera.hasCameraPermission() || this._camera.hasPermission()) {
                this._camera.startPreview();
            }
        }
    }
    initNativeView() {
        super.initNativeView();
        this.on(View.layoutChangedEvent, this._onLayoutChangeListener);
        const listenerImpl = fancycamera.CameraEventListenerUI.extend({
            owner: null,
            onReady() { },
            onCameraCloseUI() { },
            onCameraError(message, ex) {
                console.log('onCameraError', message);
                ex.printStackTrace();
                const owner = this.owner ? this.owner.get() : null;
                if (owner) {
                    owner._lastCameraOptions.shift();
                    CLog(message, null);
                    owner.sendEvent(CameraPlus.errorEvent, null, message);
                    if (owner.isRecording) {
                        owner.isRecording = false;
                    }
                }
            },
            async onCameraPhotoUI(event) {
                const owner = this.owner ? this.owner.get() : null;
                const file = event;
                const options = owner._lastCameraOptions.shift();
                let confirmPic;
                let confirmPicRetakeText;
                let confirmPicSaveText;
                let saveToGallery;
                let reqWidth;
                let reqHeight;
                let shouldKeepAspectRatio;
                let shouldAutoSquareCrop = owner.autoSquareCrop;
                const density = Utils.layout.getDisplayDensity();
                if (options) {
                    confirmPic = options.confirm ? true : false;
                    confirmPicRetakeText = options.confirmRetakeText ? options.confirmRetakeText : owner.confirmRetakeText;
                    confirmPicSaveText = options.confirmSaveText ? options.confirmSaveText : owner.confirmSaveText;
                    saveToGallery = options.saveToGallery ? true : false;
                    reqWidth = options.width ? options.width * density : 0;
                    reqHeight = options.height ? options.height * density : reqWidth;
                    shouldKeepAspectRatio = Utils.isNullOrUndefined(options.keepAspectRatio) ? true : options.keepAspectRatio;
                    shouldAutoSquareCrop = !!options.autoSquareCrop;
                }
                else {
                    // use xml property getters or their defaults
                    CLog('Using property getters for defaults, no options.');
                    confirmPic = owner.confirmPhotos;
                    saveToGallery = owner.saveToGallery;
                }
                if (confirmPic === true) {
                    owner.sendEvent(CameraPlus.confirmScreenShownEvent);
                    const result = await CamHelpers.createImageConfirmationDialog(file.getAbsolutePath(), confirmPicRetakeText, confirmPicSaveText).catch((ex) => {
                        CLog('Error createImageConfirmationDialog', ex);
                    });
                    owner.sendEvent(CameraPlus.confirmScreenDismissedEvent);
                    CLog(`confirmation result = ${result}`);
                    if (result !== true) {
                        file.delete();
                        return;
                    }
                    const asset = CamHelpers.assetFromPath(file.getAbsolutePath(), reqWidth, reqHeight, shouldKeepAspectRatio);
                    owner.sendEvent(CameraPlus.photoCapturedEvent, asset);
                    return;
                }
                else {
                    const asset = CamHelpers.assetFromPath(file.getAbsolutePath(), reqWidth, reqHeight, shouldKeepAspectRatio);
                    owner.sendEvent(CameraPlus.photoCapturedEvent, asset);
                    return;
                }
            },
            onCameraOpenUI() {
                const owner = this.owner ? this.owner.get() : null;
                if (owner) {
                    owner._initDefaultButtons();
                    if (owner._togglingCamera) {
                        owner.sendEvent(CameraPlus.toggleCameraEvent, owner.camera);
                        owner._ensureCorrectFlashIcon();
                        owner._togglingCamera = true;
                    }
                    else {
                        owner.sendEvent('loaded', owner.camera);
                    }
                }
            },
            onCameraVideoStartUI() {
                const owner = this.owner ? this.owner.get() : null;
                if (owner) {
                    owner.isRecording = true;
                    owner.sendEvent(CameraPlus.videoRecordingStartedEvent, owner.camera);
                }
            },
            onCameraVideoUI(event) {
                const owner = this.owner ? this.owner.get() : null;
                if (owner) {
                    owner.sendEvent(CameraPlus.videoRecordingReadyEvent, event.getAbsolutePath());
                    CLog(`Recording complete`);
                    owner.isRecording = false;
                }
            },
            onCameraAnalysisUI(imageAnalysis) { },
        });
        const listener = new listenerImpl();
        listener.owner = new WeakRef(this);
        this._camera.setListener(listener);
        this.cameraId = this._cameraId;
    }
    disposeNativeView() {
        CLog('disposeNativeView.');
        this.off(View.layoutChangedEvent, this._onLayoutChangeListener);
        Application.android.off('activityRequestPermissions', this._permissionListener);
        this.releaseCamera();
        super.disposeNativeView();
    }
    get cameraId() {
        return this._cameraId;
    }
    set cameraId(id) {
        if (this._camera) {
            switch (id) {
                case CAMERA_FACING_FRONT:
                    this._camera.setPosition(fancycamera.CameraPosition.FRONT);
                    this._cameraId = CAMERA_FACING_FRONT;
                    break;
                default:
                    this._camera.setPosition(fancycamera.CameraPosition.BACK);
                    this._cameraId = CAMERA_FACING_BACK;
                    break;
            }
        }
        this._cameraId = id;
    }
    /**
     * Takes a picture with from the camera preview.
     */
    takePicture(options) {
        if (this._camera) {
            options = options || {};
            CLog(JSON.stringify(options));
            const hasCamPerm = this.hasCameraPermission();
            if (!hasCamPerm) {
                CLog('Application does not have permission to use Camera.');
                return;
            }
            if (!!options.useCameraOptions && typeof options.width === 'number' && typeof options.height === 'number') {
                this._camera.setOverridePhotoWidth(options.width);
                this._camera.setOverridePhotoHeight(options.height);
            }
            this._camera.setSaveToGallery(!!options.saveToGallery);
            this._camera.setAutoSquareCrop(!!options.autoSquareCrop);
            this._lastCameraOptions.push(options);
            this._camera.takePhoto();
        }
    }
    releaseCamera() {
        if (this._camera) {
            this._camera.release();
        }
    }
    // @ts-ignore
    get autoFocus() {
        return this._camera ? this._camera.getAutoFocus() : false;
    }
    set autoFocus(focus) {
        if (this._camera) {
            this._camera.setAutoFocus(focus);
        }
    }
    /**
     * Toggle the opened camera. Only supported on devices with multiple cameras.
     */
    toggleCamera() {
        if (this._camera) {
            this._togglingCamera = true;
            this._camera.toggleCamera();
            const camNumber = this.getNumberOfCameras();
            if (camNumber <= 1) {
                CLog(`Android Device has ${camNumber} camera.`);
                return;
            }
            this.sendEvent(CameraPlus.toggleCameraEvent, this.camera);
            // need to check flash mode when toggling...
            // front cam may not have flash - and just ensure the correct icon shows
            this._ensureCorrectFlashIcon();
            // try to set focus mode when camera gets toggled
            this._ensureFocusMode();
        }
    }
    async record(options) {
        options = options || {};
        if (this._camera) {
            this._camera.setDisableHEVC(!!options.disableHEVC);
            this._camera.setSaveToGallery(!!options.saveToGallery);
            switch (options.quality) {
                case CameraVideoQuality.HIGHEST:
                    this._camera.setQuality(fancycamera.Quality.HIGHEST);
                    break;
                case CameraVideoQuality.LOWEST:
                    this._camera.setQuality(fancycamera.Quality.LOWEST);
                    break;
                case CameraVideoQuality.MAX_2160P:
                    this._camera.setQuality(fancycamera.Quality.MAX_2160P);
                    break;
                case CameraVideoQuality.MAX_1080P:
                    this._camera.setQuality(fancycamera.Quality.MAX_1080P);
                    break;
                case CameraVideoQuality.MAX_720P:
                    this._camera.setQuality(fancycamera.Quality.MAX_720P);
                    break;
                case CameraVideoQuality.QVGA:
                    this._camera.setQuality(fancycamera.Quality.QVGA);
                    break;
                default:
                    this._camera.setQuality(fancycamera.Quality.MAX_480P);
                    break;
            }
            // -1 uses profile value;
            this._camera.setMaxAudioBitRate(options.androidMaxAudioBitRate || -1);
            this._camera.setMaxVideoBitrate(options.androidMaxVideoBitRate || -1);
            this._camera.setMaxVideoFrameRate(options.androidMaxFrameRate || -1);
            const permResult = await this.requestVideoRecordingPermissions();
            CLog(permResult);
            this._camera.startRecording();
        }
    }
    /**
     * Stop recording video
     */
    stop() {
        this.stopRecording();
    }
    stopRecording() {
        if (this._camera) {
            CLog(`*** stopping mediaRecorder ***`);
            this._camera.stopRecording();
        }
    }
    /**
     * Open the device image picker
     * @param options
     */
    chooseFromLibrary(options) {
        return new Promise((resolve, reject) => {
            try {
                const createThePickerIntent = () => {
                    const intent = new android.content.Intent();
                    intent.setType('*/*');
                    if (!options) {
                        options = {
                            showImages: true,
                            showVideos: this.isVideoEnabled(),
                        };
                    }
                    if (options.showImages === undefined) {
                        options.showImages = true;
                    }
                    if (options.showVideos === undefined) {
                        options.showVideos = true;
                    }
                    let length = 0;
                    if (options.showImages) {
                        length++;
                    }
                    if (options.showVideos) {
                        length++;
                    }
                    const mimetypes = Array.create(java.lang.String, length);
                    let index = 0;
                    if (options.showImages) {
                        mimetypes[index] = 'image/*';
                        index++;
                    }
                    if (options.showVideos) {
                        mimetypes[index] = 'video/*';
                    }
                    // not in platform-declaration typings
                    intent.putExtra(android.content.Intent.EXTRA_MIME_TYPES, mimetypes);
                    intent.setAction('android.intent.action.GET_CONTENT');
                    // set the multiple picker mode
                    if (this.galleryPickerMode === 'multiple') {
                        intent.putExtra('android.intent.extra.ALLOW_MULTIPLE', true);
                    }
                    const onImagePickerResultEventListener = (event) => {
                        if (event.requestCode === RESULT_CODE_PICKER_IMAGES && event.resultCode === RESULT_OK) {
                            try {
                                const data = event.intent;
                                const selectedImages = this.getSelectedImages(data);
                                this.sendEvent(CameraPlus.imagesSelectedEvent, selectedImages);
                                resolve(selectedImages);
                            }
                            catch (error) {
                                CLog(error);
                                this.sendEvent(CameraPlus.errorEvent, error, 'Error with the image picker result.');
                                reject(error);
                            }
                        }
                        else {
                            const error = new Error(`Image picker activity result code ${event.resultCode}`);
                            this.sendEvent(CameraPlus.errorEvent, error, error.message);
                            reject(error);
                        }
                        // Cleanup, remove bound listener.
                        Application.android.off(AndroidApplication.activityResultEvent, onImagePickerResultEventListener);
                    };
                    // Bind listener
                    Application.android.on(AndroidApplication.activityResultEvent, onImagePickerResultEventListener);
                    // Start the intent
                    Application.android.foregroundActivity.startActivityForResult(intent, RESULT_CODE_PICKER_IMAGES);
                };
                // Ensure storage permissions
                if (!this.hasStoragePermissions()) {
                    permissions.requestPermissions([READ_EXTERNAL_STORAGE(), WRITE_EXTERNAL_STORAGE()]).then(() => {
                        if (!this.hasStoragePermissions()) {
                            const error = new Error('request for storage permissions denied');
                            this.sendEvent(CameraPlus.errorEvent, error, 'Error choosing an image from the device library.');
                            reject(error);
                        }
                        else {
                            createThePickerIntent();
                        }
                    });
                    return;
                }
                createThePickerIntent();
            }
            catch (e) {
                this.sendEvent(CameraPlus.errorEvent, e, 'Error choosing an image from the device library.');
                reject(e);
            }
        });
    }
    /**
     * Collect images from intent and return a collection of Image Assets.
     *
     * @param intent
     */
    getSelectedImages(intent) {
        const selectedImages = [];
        const clipData = intent.getClipData();
        const imageFromUri = (uri) => {
            const selectedAssetUri = new SelectedAsset(uri).fileUri;
            return new ImageAsset(selectedAssetUri);
        };
        if (clipData !== null) {
            for (let i = 0; i < clipData.getItemCount(); i++) {
                const clipItem = clipData.getItemAt(i);
                const uri = clipItem.getUri();
                const asset = imageFromUri(uri);
                selectedImages.push(asset);
            }
        }
        else {
            const uri = intent.getData();
            const asset = imageFromUri(uri);
            selectedImages.push(asset);
        }
        return selectedImages;
    }
    /**
     * Toggles the flash mode of the camera.
     */
    toggleFlash() {
        if (this._camera) {
            // @ts-ignore
            this._camera.toggleFlash();
        }
    }
    /**
     * Request permission to use device camera.
     * @param explanation
     */
    requestCameraPermissions(explanation = '') {
        return new Promise((resolve, reject) => {
            permissions
                .requestPermission(CAMERA(), explanation)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                this.sendEvent(CameraPlus.errorEvent, err, 'Error requesting Camera permissions.');
                reject(false);
            });
        });
    }
    /**
     * Returns true if the CAMERA permission has been granted.
     */
    hasCameraPermission() {
        return permissions.hasPermission(CAMERA());
    }
    /**
     * Request permission to use record audio for video.
     * @param explanation
     */
    requestAudioPermissions(explanation = '') {
        return new Promise((resolve, reject) => {
            permissions
                .requestPermission(RECORD_AUDIO(), explanation)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                this.sendEvent(CameraPlus.errorEvent, err, 'Error requesting Audio permission.');
                reject(false);
            });
        });
    }
    /**
     * Returns true if the RECORD_AUDIO permission has been granted.
     */
    hasAudioPermission() {
        return permissions.hasPermission(RECORD_AUDIO());
    }
    /**
     * Request permission to read/write to external storage.
     * @param explanation
     */
    requestStoragePermissions(explanation = '') {
        return new Promise((resolve, reject) => {
            permissions
                .requestPermissions([WRITE_EXTERNAL_STORAGE(), READ_EXTERNAL_STORAGE()], explanation)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                this.sendEvent(CameraPlus.errorEvent, err, 'Error requesting Storage permissions.');
                reject(false);
            });
        });
    }
    /**
     * Returns true if the WRITE_EXTERNAL_STORAGE && READ_EXTERNAL_STORAGE permissions have been granted.
     */
    hasStoragePermissions() {
        const writePerm = permissions.hasPermission(WRITE_EXTERNAL_STORAGE());
        const readPerm = permissions.hasPermission(READ_EXTERNAL_STORAGE());
        if (writePerm === true && readPerm === true) {
            return true;
        }
        else {
            return false;
        }
    }
    requestVideoRecordingPermissions(explanation = '') {
        return new Promise(async (resolve, reject) => {
            permissions
                .requestPermissions([WRITE_EXTERNAL_STORAGE(), RECORD_AUDIO()], explanation)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                this.sendEvent(CameraPlus.errorEvent, err, 'Error requesting Video permissions.');
                reject(false);
            });
        });
    }
    hasVideoRecordingPermissions() {
        const writePerm = permissions.hasPermission(WRITE_EXTERNAL_STORAGE());
        const audio = permissions.hasPermission(RECORD_AUDIO());
        if (writePerm === true && audio === true) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Gets current camera selection
     */
    getCurrentCamera() {
        if (!this._camera)
            return 'rear';
        switch (this._camera.getPosition()) {
            case fancycamera.CameraPosition.FRONT:
                return 'front';
            default:
                return 'rear';
        }
    }
    /**
     * Check if the device has a camera
     */
    isCameraAvailable() {
        if (Utils.ad.getApplicationContext().getPackageManager().hasSystemFeature('android.hardware.camera')) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Returns number of cameras on device
     */
    getNumberOfCameras() {
        if (!this._camera)
            return 0;
        return this._camera.getNumberOfCameras();
    }
    /**
     * Check if device has flash modes
     * @param camera
     */
    hasFlash() {
        if (!this._camera) {
            return false;
        }
        return this._camera.getHasFlash();
    }
    /**
     * Return the current flash mode of the device. Will return null if the flash mode is not supported by device.
     */
    getFlashMode() {
        if (this.hasFlash()) {
            if (this._camera.getFlashMode() !== fancycamera.CameraFlashMode.OFF) {
                return 'on';
            }
            return 'off';
        }
        return null;
    }
    /**
     * Helper method to ensure the correct icon (on/off) is shown on flash.
     * Useful when toggling cameras.
     */
    _ensureCorrectFlashIcon() {
        // get current flash mode and set correct image drawable
        const currentFlashMode = this.getFlashMode();
        CLog('_ensureCorrectFlashIcon flash mode', currentFlashMode);
        // if the flash mode is null then we need to remove the button from the parent layout
        if (currentFlashMode === null) {
            // if we have the button - remove it from parent
            if (this._flashBtn) {
                this._flashBtn.setVisibility(android.view.View.GONE);
            }
            return;
        }
        // ensure flashBtn is here - if currentFlashMode is null then don't show/assign the flash button
        if (this._flashBtn === undefined || this._flashBtn === null) {
            return;
        }
        // make sure we have our flash icon button visible - sometimes toggling might set to GONE
        this._flashBtn.setVisibility(android.view.View.VISIBLE);
        // reset the image in the button first
        this._flashBtn.setImageResource(android.R.color.transparent);
        const flashIcon = currentFlashMode === FLASH_MODE_OFF ? this.flashOffIcon : this.flashOnIcon;
        const imageDrawable = CamHelpers.getImageDrawable(flashIcon);
        this._flashBtn.setImageResource(imageDrawable);
    }
    _ensureFocusMode() {
        // setup autoFocus if possible
    }
    _initFlashButton() {
        this._flashBtn = CamHelpers.createImageButton();
        // set correct flash icon on button
        this._ensureCorrectFlashIcon();
        const shape = CamHelpers.createTransparentCircleDrawable();
        this._flashBtn.setBackgroundDrawable(shape);
        const ref = new WeakRef(this);
        this._flashBtn.setOnClickListener(new android.view.View.OnClickListener({
            onClick: (args) => {
                const owner = ref.get();
                if (owner) {
                    owner.toggleFlash();
                    owner._ensureCorrectFlashIcon();
                }
            },
        }));
        const flashParams = new android.widget.RelativeLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT);
        if (this.insetButtons === true) {
            // need to get the width of the screen
            const layoutWidth = this._nativeView.getWidth();
            CLog(`layoutWidth = ${layoutWidth}`);
            const xMargin = layoutWidth * this.insetButtonsPercent;
            const layoutHeight = this._nativeView.getHeight();
            CLog(`layoutHeight = ${layoutHeight}`);
            const yMargin = layoutHeight * this.insetButtonsPercent;
            // add margin to left and top where the button is positioned
            flashParams.setMargins(xMargin, yMargin, 8, 8);
        }
        else {
            flashParams.setMargins(8, 8, 8, 8);
        }
        flashParams.addRule(ALIGN_PARENT_TOP);
        flashParams.addRule(ALIGN_PARENT_LEFT);
        this._nativeView.addView(this._flashBtn, flashParams);
    }
    _initGalleryButton() {
        this._galleryBtn = CamHelpers.createImageButton();
        const openGalleryDrawable = CamHelpers.getImageDrawable(this.galleryIcon);
        this._galleryBtn.setImageResource(openGalleryDrawable);
        const shape = CamHelpers.createTransparentCircleDrawable();
        this._galleryBtn.setBackgroundDrawable(shape);
        const ref = new WeakRef(this);
        this._galleryBtn.setOnClickListener(new android.view.View.OnClickListener({
            onClick: (args) => {
                const owner = ref.get();
                if (owner) {
                    owner.chooseFromLibrary();
                }
            },
        }));
        const galleryParams = new android.widget.RelativeLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT);
        if (this.insetButtons === true) {
            const layoutWidth = this._nativeView.getWidth();
            CLog(`layoutWidth = ${layoutWidth}`);
            const xMargin = layoutWidth * this.insetButtonsPercent;
            const layoutHeight = this._nativeView.getHeight();
            CLog(`layoutHeight = ${layoutHeight}`);
            const yMargin = layoutHeight * this.insetButtonsPercent;
            // add margin to bottom and left where button is positioned
            galleryParams.setMargins(xMargin, 8, 8, yMargin);
        }
        else {
            galleryParams.setMargins(8, 8, 8, 8);
        }
        galleryParams.addRule(ALIGN_PARENT_BOTTOM);
        galleryParams.addRule(ALIGN_PARENT_LEFT);
        this._nativeView.addView(this._galleryBtn, galleryParams);
    }
    _initToggleCameraButton() {
        this._toggleCamBtn = CamHelpers.createImageButton();
        const switchCameraDrawable = CamHelpers.getImageDrawable(this.toggleCameraIcon);
        this._toggleCamBtn.setImageResource(switchCameraDrawable);
        const shape = CamHelpers.createTransparentCircleDrawable();
        this._toggleCamBtn.setBackgroundDrawable(shape);
        const ref = new WeakRef(this);
        this._toggleCamBtn.setOnClickListener(new android.view.View.OnClickListener({
            onClick: (view) => {
                const owner = ref.get();
                if (owner) {
                    owner.toggleCamera();
                }
            },
        }));
        const toggleCamParams = new android.widget.RelativeLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT);
        if (this.insetButtons === true) {
            const layoutWidth = this._nativeView.getWidth();
            CLog(`layoutWidth = ${layoutWidth}`);
            const xMargin = layoutWidth * this.insetButtonsPercent;
            const layoutHeight = this._nativeView.getHeight();
            CLog(`layoutHeight = ${layoutHeight}`);
            const yMargin = layoutHeight * this.insetButtonsPercent;
            toggleCamParams.setMargins(8, yMargin, xMargin, 8);
        }
        else {
            toggleCamParams.setMargins(8, 8, 8, 8);
        }
        toggleCamParams.addRule(ALIGN_PARENT_TOP);
        toggleCamParams.addRule(ALIGN_PARENT_RIGHT);
        this._nativeView.addView(this._toggleCamBtn, toggleCamParams);
    }
    _initTakePicButton() {
        this._takePicBtn = CamHelpers.createImageButton();
        const takePicDrawable = CamHelpers.getImageDrawable(this.takePicIcon);
        this._takePicBtn.setImageResource(takePicDrawable); // set the icon
        const shape = CamHelpers.createTransparentCircleDrawable();
        this._takePicBtn.setBackgroundDrawable(shape); // set the transparent background
        const ref = new WeakRef(this);
        this._takePicBtn.setOnClickListener(new android.view.View.OnClickListener({
            onClick: (args) => {
                CLog(`The default Take Picture event will attempt to save the image to gallery.`);
                const opts = {
                    saveToGallery: true,
                    confirm: this.confirmPhotos ? true : false,
                    autoSquareCrop: this.autoSquareCrop,
                };
                const owner = ref.get();
                if (owner) {
                    owner.takePicture(opts);
                }
            },
        }));
        const takePicParams = new android.widget.RelativeLayout.LayoutParams(WRAP_CONTENT, WRAP_CONTENT);
        if (this.insetButtons === true) {
            const layoutHeight = this._nativeView.getHeight();
            CLog(`layoutHeight = ${layoutHeight}`);
            const yMargin = layoutHeight * this.insetButtonsPercent;
            takePicParams.setMargins(8, 8, 8, yMargin);
        }
        else {
            takePicParams.setMargins(8, 8, 8, 8);
        }
        takePicParams.addRule(ALIGN_PARENT_BOTTOM);
        takePicParams.addRule(CENTER_HORIZONTAL);
        this._nativeView.addView(this._takePicBtn, takePicParams);
    }
    /**
     * Creates the default buttons depending on the options to show the various default buttons.
     */
    _initDefaultButtons() {
        try {
            // flash button setup - if the device doesn't support flash do not setup/show this button
            if (this.showFlashIcon === true && this.getFlashMode() !== null && this._flashBtn === null) {
                this._initFlashButton();
            }
            // gallery button setup
            if (this.showGalleryIcon === true && this._galleryBtn === null) {
                this._initGalleryButton();
            }
            // camera toggle button setup
            if (this.showToggleIcon === true && this.getNumberOfCameras() > 1 && this._toggleCamBtn === null) {
                this._initToggleCameraButton();
            }
            // take picture button setup
            if (this.showCaptureIcon === true && this._takePicBtn === null) {
                if (this.showFlashIcon === true && this.getFlashMode() !== null && this._flashBtn === null) {
                    this._initFlashButton();
                }
                // gallery button setup
                if (this.showGalleryIcon === true && this._galleryBtn === null) {
                    this._initGalleryButton();
                }
                // camera toggle button setup
                if (this.showToggleIcon === true && this.getNumberOfCameras() > 1 && this._toggleCamBtn === null) {
                    this._initToggleCameraButton();
                }
                // take picture button setup
                if (this.showCaptureIcon === true && this._takePicBtn === null) {
                    this._initTakePicButton();
                }
            }
        }
        catch (ex) {
            CLog('_initDefaultButtons error', ex);
        }
    }
}
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlus.prototype, "flashOnIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlus.prototype, "flashOffIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlus.prototype, "toggleCameraIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlus.prototype, "confirmPhotos", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlus.prototype, "saveToGallery", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlus.prototype, "takePicIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", String)
], CameraPlus.prototype, "galleryIcon", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlus.prototype, "insetButtons", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Number)
], CameraPlus.prototype, "insetButtonsPercent", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlus.prototype, "enableVideo", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlus.prototype, "isRecording", void 0);
__decorate([
    GetSetProperty(),
    __metadata("design:type", Boolean)
], CameraPlus.prototype, "enableAudio", void 0);
//# sourceMappingURL=index.android.js.map