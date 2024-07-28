import { Injectable } from '@angular/core';
import { FaceApiService } from './face-api.service';

@Injectable({
  providedIn: 'root'
})
export class VideoPlayerService {

  constructor(private faceApiService: FaceApiService) { }

  getLandMark = (videoElement:any) => {
const {globalFace} = this.faceApiService;
  }

}
