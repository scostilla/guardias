import { EventEmitter, Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root',
})
export class FaceApiService {
  public globalFace: any;

  private modelsForLoad = [
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/faceApiModels'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/faceApiModels'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/faceApiModels'),
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/faceApiModels'),
  ];


  constructor() {
    this.globalFace = faceapi;
    this.loadModels();
  }
  cbModels: EventEmitter<any> = new EventEmitter<any>();
  public loadModels = () => {
    Promise.all(this.modelsForLoad).then(() => {
      console.log('Modelos cargados!!');
      this.cbModels.emit(true);
    });
  };
}
