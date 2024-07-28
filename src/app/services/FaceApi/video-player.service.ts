import { Injectable } from '@angular/core';
import { FaceApiService } from './face-api.service';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerService {

  constructor(private faceApiService: FaceApiService) {

  }

  getLandMark = (videoElement: any) => {
    console.log("getLandMark");
    const { globalFace } = this.faceApiService;
    const {videoWidth, videoHeight} = videoElement.nativeElement;
    const displaySize = {width: videoWidth, height: videoHeight};
    console.log(displaySize);
  };
}
